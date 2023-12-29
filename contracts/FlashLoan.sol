//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; //todo: which version do we need? - 0.8.23 is the latest
import "hardhat/console.sol";

// Interfaces
interface FlashBorrower {
    function onFlashLoan(
        address initiator,
        int256 amount,
        int256 fee,
        bytes calldata data
    ) external returns (bool);
}

// Stuct Section

// Define Participant
struct Participant {
    address payable addresse;
    bytes32 pubKey;
}

// Define Channel State
struct Channel_State {
    int channel_id;
    uint balance_A;
    uint balance_B;
    int version_num;
    bool finalized;
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
}

// Define Channel
struct Channel{
    Channel_State state;
    Channel_Params params;
    Channel_Control control;
}

// Contract Section

contract FlashLoan {
    // Constants
    const int256 flashLoanFee = 0.1; // 10% fee

    // Variables
    uint256 public Contract_Balance = 0 ether;

    // Mapping: Channel_ID => Channel
    mapping(int => Channel) public channels;

    // Mapping: Channel_ID => Balance
    mapping(int => uint256) public balances;

    // Compare two Participants
    function compareParticipants(Participant memory a, Participant memory b) private pure returns (bool) {
        return a.addresse == b.addresse;
    }

    // Channel Section

    /**
     * @dev Opens a new channel between two participants 
     *      and adds it to the channels mapping and updates the channel_count
     * @param params The parameters of the channel
     * @param state The state of the channel
     */
    function open(Channel_Params calldata params, Channel_State calldata state) public{
        
        //TODO: Channel abfrage richtig so? 
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

        // Add Channel to channels
        channels[state.channel_id] = channel;
    }

    receive() external payable {
        Contract_Balance += msg.value;
    }
    
    /**
     * @dev Funds a channel with the given amount
     *      and updates the balance of either participant_a or participant_b depending on the caller 
     * @param channel_id The id of the channel
     * @param amount The amount to fund the channel with
     */
    function fund (int channel_id, uint256 amount) public payable {
        Channel storage channel = channels[channel_id];

        // Check if channel exists
        require(channel.state.channel_id == channel_id, "Channel does not exist");

        // Check if channel is not finalized
        require(channel.state.finalized == false, "Channel is finalized");

        // Check if caller is participant_a or participant_b
        if (msg.sender == channel.params.participant_a.addresse){
            // Check if participant_a is not funded
            require(channel.control.funded_a == false, "Participant A already funded");

            (bool sent, bytes memory data) = address(this).call{value: msg.value}("");
            require(sent, "Failed to send Ether");
            console.log(address(this).balance);
            // Update balance_A
            channel.state.balance_A += amount;

            // Update funded_a
            channel.control.funded_a = true;

            // Update balance of participant_a
            channel.state.balance_A = amount;
            
        }
        else if (msg.sender == channel.params.participant_b.addresse){
            // Check if participant_b is not funded
            require(channel.control.funded_b == false, "Participant B already funded");

            (bool sent, bytes memory data) = address(this).call{value: msg.value}("");
            require(sent, "Failed to send Ether");
            console.log(address(this).balance);

            // Update balance_B
            channel.state.balance_B += amount;

            // Update funded_b
            channel.control.funded_b = true;

            // Update balance of participant_b
            channel.state.balance_B = amount;
        }
        else{
            revert("Caller is not a participant");
        }
    }
    
    /**
    * @dev Closes the channel and pays out the balance of the caller
    * @param channel_id The id of the channel
    */
    function close(int channel_id) public {
        Channel storage channel = channels[channel_id];

        // Check if channel exists
        require(channel.state.channel_id == channel_id, "Channel does not exist");

        // Check if Caller is part of the given Channel
        require(channel.params.participant_a.addresse == msg.sender || channel.params.participant_b.addresse == msg.sender,
            "Caller is not a participant of the given channel");

        // Checks whether the channel has been finalized
        require(!channel.state.finalized, "Channel is already finalised");

        // Determine the participant and the corresponding balance
        address payable participantAddress;
        uint256 amountToTransfer;

        if (channel.params.participant_a.addresse == msg.sender) {
            // Caller is participant A
            participantAddress = channel.params.participant_a.addresse;
            amountToTransfer = channel.state.balance_A;
        } else {
            // Caller is participant B
            participantAddress = channel.params.participant_b.addresse;
            amountToTransfer = channel.state.balance_B;
        }

        // Check if there is a balance to transfer
        require(amountToTransfer > 0, "Nothing to transfer");

        // Log information
        console.log("Transferring %s to %s", amountToTransfer, participantAddress);
        console.log(address(this).balance);
        console.log(participantAddress.balance);

        // Transfer funds
        (bool transferSuccess, bytes memory data) = participantAddress.call{value: amountToTransfer}("");
        
        // Log transfer result
        console.log("Transfer success: %s", transferSuccess);
        console.log(participantAddress.balance);

        //console.log("Transfer data: %s", data);
        // Check if the transfer was successful
        require(transferSuccess, "Transfer failed");

        // Update state
        if (participantAddress == channel.params.participant_a.addresse) {
            channel.state.balance_A = 0;
        } else {
            channel.state.balance_B = 0;
        }
    }


    /**
     * Calling this function means that you are d'accord with how the trade went and are okay with ending the trade here
     * @param newState The new state of the channel
     * @param sigA The signature of participant_a
     * @param sigB The signature of participant_b
     */
    function finalize(Channel_State calldata newState, bytes32 sigA, bytes32 sigB) public {
        //Einfache Implementation dass es erstmal läuft aber keine überprüffung der Signaturen 

        // Check if channel exists
        require(channels[newState.channel_id].state.channel_id == newState.channel_id, "Channel does not exist");
        //Check if channel is not finalized
        require(channels[newState.channel_id].state.finalized == false, "Channel is already finalized");
        //Check if new Channel is finalized
        require(newState.finalized == true, "New Channel is not finalized");
        
        //Hier müsste dann die Überprüfung der Signaturen stattfinden

        // Set new state
        channels[newState.channel_id].state = newState;
        

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
    
    function flashLoan(
    FlashBorrower receiver,
    uint256 amount,
    bytes calldata data) external returns (bool) {
        
        uint256 fee = amount * flashLoanFee;

        

        bool success = receiver.onFlashLoan(msg.sender, amount, fee, data) // Execute the FlashLoan
        require(success, "FlashLoan failed");

        return true;
    }
}
