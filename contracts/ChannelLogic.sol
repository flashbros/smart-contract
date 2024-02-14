//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19; //todo: which version do we need? - 0.8.23 is the latest, 0.8.19 is in the hardhat.config.js file
import "hardhat/console.sol";

// Interfaces
interface FlashBorrower {
    function onFlashLoan(
        address initiator,
        uint256 amount,
        uint256 fee
    ) external returns (bool);
}


// Stuct Section

// Define Participant
struct Participant {
    address payable addresse;
    //bytes32 pubKey;
}

// Define Channel State
struct Channel_State {
    int channel_id;
    uint balance_A;
    uint balance_B;
    int version_num;
    bool finalized;
    bool closed;
}

// Define Channel Params with Participants
struct Channel_Params{
    Participant participant_a;
    Participant participant_b;
}

// Define Channel Control
struct Channel_Control{
    bool funded_a;
    bool funded_b;
    uint fundamount_a;
    uint fundamount_b;
    bool withdrawed_a;
    bool withdrawed_b;
}

// Define Channel
struct Channel{
    Channel_State state;
    Channel_Params params;
    Channel_Control control;
}

// Contract Section

contract ChannelLogic {
    // Constants
    uint256 flashLoanFee = 1; //  1 => 0.01% fee

    // Variables
    uint256 public contract_pool = 0 ether; //kann maybe durch address(this).balance ersetzt werden

    Participant[] public participants;
    
    int public channel_count = 0;
    int r = 0;

    //Events
    event ChannelOpen();
    event NewTransaction(uint indexed transactionId, address sender, address receiver, uint amount);
    event PartyFinalized(int channel_id, address party);
    event PartyFunded(address party, uint amount);

   
    // Mapping: Channel_ID => Channel
    mapping(int => Channel) public channels;

    /*
    // Mapping: User_Address => Balance, keeps track which address has funded which amount
    mapping(address => uint256) public balances;

    // Dynamic Array: Stores the addresses of accounts that currently have at least one active channel funded
    address[] shareHolders;

    // Mapping: Address => hasAlreadyFundedAChannel, keeps track if the address has already funded at least one active channel
    mapping(address => uint256) public alreadyShareholding;
    */

    // Dynamic Array: Keeps track which channels are currently active
    int[] activeChannels;

    // Compare two Participants
    function compareParticipants(Participant memory a, Participant memory b) private pure returns (bool) {
        return a.addresse == b.addresse;
    }

    // Channel Section


    /**
     * Opens a new channel between two participants 
     *      and adds it to the channels mapping and updates the channel_count
     * @param params The parameters of the channel
     * @param state The state of the channel
     */
    function open(Channel_Params calldata params, Channel_State calldata state) public{

        // Check if channel already exists
        require(channels[state.channel_id].state.channel_id != state.channel_id, "Channel already exists");

        // Check if participants are the same
        require(compareParticipants(params.participant_a, params.participant_b) == false, "Participants are the same");

        // Check if version number is 0
        require(state.version_num == 0, "Version number is not 0");

        // Check if channel is not finalized
        require(state.finalized == false, "Channel is finalized");

        // Create new Channel
        Channel memory channel;
        channel.state = state;
        channel.params = params;
        channel.control.funded_a = false;
        channel.control.funded_b = false;
        channel.control.fundamount_a = 0;
        channel.control.fundamount_b = 0;

        // Increase channel_count
        channel_count++;

        // Add Channel to channels
        channels[state.channel_id] = channel;
        activeChannels.push(state.channel_id);

        // Emit event
        emit ChannelOpen();
    }
    event ContractBalanceUpdated(uint256 newBalance);
    receive() external payable {
        contract_pool += msg.value;
            emit ContractBalanceUpdated(contract_pool);
    }

    event ChannelFunded(int indexed channel_id, address indexed participant, uint256 amount);

    /**
     * Funds a channel with the given amount
     *      and updates the balance of either participant_a or participant_b depending on the caller 
     * @param channel_id The id of the channel
     * @dev Oli Moritz Louis
     */
    function fund (int channel_id) public payable {
        Channel storage channel = channels[channel_id];

        // Check if channel exists
        require(channel.state.channel_id == channel_id, "Channel does not exist");

        // Check if msg.sender is part of the channel
        require(channel.params.participant_a.addresse == msg.sender || channel.params.participant_b.addresse == msg.sender, "Sender is not a participant of the given channel");

        bool senderIsA = msg.sender == channel.params.participant_a.addresse;

        // Check if msg.sender has not already funded yet
        if(senderIsA) {
            require(channel.control.funded_a == false, "Sender has already funded this channel");
        } else {
            require(channel.control.funded_b == false, "Sender has already funded this channel");
        }

        // Check if channel is not finalized
        require(channel.state.finalized == false, "Channel is finalized");

        uint256 amount = msg.value;

        // Check if funding is greater than zero
        require(amount > 0 ether, "Cannot fund a channel with 0 Eth");


        if(senderIsA) {
            channel.state.balance_A = amount;
            channel.control.funded_a = true;
            channel.control.fundamount_a = amount;

            // Log for tests, delete later
            console.log("Participant A has successfully funded the channel with ", channel.state.balance_A);
                    emit ChannelFunded(channel_id, msg.sender, amount);
        } else {
            channel.state.balance_B = amount;
            channel.control.funded_b = true;
            channel.control.fundamount_b = amount;

            // Log for tests, delete later
            console.log("Participant B has successfully funded the channel with ", channel.state.balance_B);
                    emit ChannelFunded(channel_id, msg.sender, amount);
        }

        /*
        balances[msg.sender] += amount;
        if(alreadyShareholding[msg.sender] == 0){
            shareHolders.push(msg.sender);
        }
        alreadyShareholding[msg.sender] += 1;
        */

        //Update Contract Pool
        contract_pool += amount;

        // Log for tests, delete later
        console.log("Their new balance is: ", address(msg.sender).balance);
    }


    
    /**
    * Closes the channel and pays out the balance of the caller
    * @param channel_id The id of the channel
    * @dev Moritz
    */
   function close(int channel_id) public {
        Channel storage channel = channels[channel_id];
        // Check if channel exists
        require(channel.state.channel_id == channel_id, "Channel does not exist");

        // Check if Caller is part of the given Channel
        require(channel.params.participant_a.addresse == msg.sender || channel.params.participant_b.addresse == msg.sender,
            "Sender is not a participant of the given channel");

        // Check whether the channel has been finalized
        require(channel.state.finalized, "Channel is not yet finalised");

        // Check whether the channel has been closed already
        require(!channel.state.closed, "Channel has already been closed, use withdraw instead");

        // Determine the participant and the corresponding balance
        bool senderIsA = msg.sender == channel.params.participant_a.addresse;
        uint256 amountToTransfer = senderIsA ? channel.state.balance_A : channel.state.balance_B;

        //Close Channel
        channel.state.closed = true;

        // Check if there is a balance to transfer and do the transfer
        if(amountToTransfer > 0) {
            //Update Contract Pool
            contract_pool -= amountToTransfer;
            if(senderIsA) {
                channel.state.balance_A = 0;
                (bool transferSuccess, bytes memory data) = payable(msg.sender).call{value: amountToTransfer}("");
                require(transferSuccess, "Transfer failed");
            } else {
                channel.state.balance_B = 0;
                (bool transferSuccess, bytes memory data) = payable(msg.sender).call{value: amountToTransfer}("");
                require(transferSuccess, "Transfer failed");
            }
        }
    }
    /**
    * Withdraws the balance of the caller if the channel has already been closed
    * @param channel_id The id of the channel
    * @dev Moritz
     */
    function withdraw(int channel_id) public {
        Channel storage channel = channels[channel_id];
        // Check if channel exists
        require(channel.state.channel_id == channel_id, "Channel does not exist");

        // Check if Caller is part of the given Channel
        require(channel.params.participant_a.addresse == msg.sender || channel.params.participant_b.addresse == msg.sender,
            "Sender is not a participant of the given channel");

        // Check whether the channel has been closed already
        require(channel.state.closed, "Channel has not been closed yet, use close instead");

        // Determine the participant and the corresponding balance
        bool senderIsA = msg.sender == channel.params.participant_a.addresse;
        uint256 amountToTransfer = senderIsA ? channel.state.balance_A : channel.state.balance_B;

        // Check if there is a balance to transfer
        require(amountToTransfer > 0, "There is no balance for you in this channel to withdraw");

        //Update Contract Pool
        contract_pool -= amountToTransfer;

        // and do the transfer
        if(senderIsA) {
            channel.state.balance_A = 0;
            (bool transferSuccess, bytes memory data) = payable(msg.sender).call{value: amountToTransfer}("");
            require(transferSuccess, "Transfer failed");
        } else {
            channel.state.balance_B = 0;
            (bool transferSuccess, bytes memory data) = payable(msg.sender).call{value: amountToTransfer}("");
            require(transferSuccess, "Transfer failed");
        }
    }

    
    /**
    * Finalizes the channel with the given state
    * @param newState The new state of the channel
    * @dev Moritz
     */
    function finalize(Channel_State calldata newState) public {
        //Einfache Implementation dass es erstmal läuft aber keine Überprüfung der Signaturen

        // Check if channel exists
        require(channels[newState.channel_id].state.channel_id == newState.channel_id, "Channel does not exist");
        // TODO: Check if participant is a paticipant of the channel
        //Check if channel is not finalized
        require(channels[newState.channel_id].state.finalized == false, "Channel is already finalized");
        //Check if new Channel is finalized
        require(newState.finalized == true, "New Channel is not finalized");
        //Check if Version Number is increased
        require(newState.version_num > channels[newState.channel_id].state.version_num, "Version Number is not increased");
        
        //Hier müsste dann die Überprüfung der Signaturen stattfinden

        // Set new state
        channels[newState.channel_id].state = newState;

        //TODO: Channel aus dem activeChannels Array entfernen

        //Ideen wie man die Signautren überprüfen kann
        //Video hilfreich: https://www.youtube.com/watch?v=ZcmQ92vBLgg
        
        //Idee1
        /*
        bytes32 hashedState = keccak256(abi.encode(newState));
        // Check if channel exists
        require(channels[newState.channel_id].state.channel_id == newState.channel_id, "Channel does not exist");

        // Check if newState is signed by both participants
        //TODO check if sigA and sigB are correct
        require(ecrecover(hashedState, uint8(sigA[0]), bytes32(sigA[1]), bytes32(sigA[2])) == channels[newState.channel_id].params.participant_a.pubKey, "Signature of participant A is not valid");
        require(ecrecover(hashedState, uint8(sigB[0]), bytes32(sigB[1]), bytes32(sigB[2])) == channels[newState.channel_id].params.participant_b.pubKey, "Signature of participant B is not valid");

        // Set new state
        channels[newState.channel_id].state = newState;

        */

        //Idee2
        /*
         // Check if channel exists
        require(channels[newState.channel_id].state.channel_id == newState.channel_id, "Channel does not exist");

        // Check if newState is signed by both participants
        require(verifySig(hashedState, sigA, channels[newState.channel_id].params.participant_a.pubKey), "Signature of participant_a is not valid");
        require(verifySig(hashedState, sigB, channels[newState.channel_id].params.participant_b.pubKey), "Signature of participant_b is not valid");

        // Set new state
        channels[newState.channel_id].state = newState;

        */
    }

      // FlashLoan Section


    uint256 expected;
    bool payedBack;

    function flashLoan(
    FlashBorrower receiver,
    uint256 amount) external returns (bool) {

        require(amount <= _maxFlashLoan(), "Amount exceeds the flash loan limit, try to choose a smaller amount");

        //initialize variables
        uint256 old = address(this).balance;
        payedBack = false;

        //pay the flashloan
        (bool transferSuccess, bytes memory data) = payable(msg.sender).call{value: amount}("");
        expected = amount + _flashFee(amount);

        //execute onFlashLoan function on borrower side
        receiver.onFlashLoan(msg.sender, amount, _flashFee(amount));

        require(payedBack, "Payback did not happen or failed");

        channelDistributor(_flashFee(amount));

        return true;
    }

    function channelDistributor(
        uint256 fees
    ) internal  {
        for(int i = 0; i < activeChannels.length; i++) {
            //get the channel via the mapping and the array
            Channel c = channels[activeChannels[i]];

            //distribute the fees to the participants and increase version number
            c.state.balance_A += (c.state.balance_A + c.state.balance_B) / address(this).balance * fees / 2;
            c.state.balance_B += (c.state.balance_A + c.state.balance_B) / address(this).balance * fees / 2;
            c.state.version_num += 1;
        }
    }

    function payBack() external payable returns (bool) {
        require(msg.value == expected, "Did not send sufficient funds to pay back the flash loan");
        payedBack = true;
        return true;
    }

    function maxFlashLoan(
    ) external view returns (uint256) {
        return _maxFlashLoan();
    }

    function _maxFlashLoan(
    ) internal view returns (uint256) {
        return contract_pool;
    }

    function flashFee(
        uint256 amount
    ) external view returns (uint256) {
        return _flashFee(amount);
    }

    function _flashFee(
        uint256 amount
    ) internal view returns (uint256) {
        return amount * flashLoanFee / 10000;
    }

}
