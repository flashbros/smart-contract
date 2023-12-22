//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19; //todo: which version do we need? - 0.8.23 is the latest, 0.8.19 is in the hardhat.config.js file

// Interfaces
interface FlashBorrower {
    function onFlashLoan(
        address initiator,
        int256 amount,
        int256 fee,
        bytes calldata data
    ) external returns (bytes32);
}

// Stuct Section

// Define Participant
struct Participant {
    address payable addresse;
}

// Define Channel State
struct Channel_State {
    int channel_id;
    uint balance_A;
    uint balance_B;
    int version_num;
    bool finalized_a;
    bool finalized_b;
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
    // Variables
    uint256 public Contract_Balance = 0 ether;

    Participant[] public participants;
    
    int public channel_count = 0;
    int r = 0;

    //Events
    event NewTransaction(uint indexed transactionId, address sender, address receiver, uint amount);
    event PartyFinalized(int channel_id, address party);
    
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
     */
    function open(Channel_Params calldata params) public{
        // Create new Channel
        Channel memory channel;
        channel.state.channel_id = channel_count;
        channel.state.balance_A = 0;
        channel.state.balance_B = 0;
        channel.state.version_num = 0;
        channel.state.finalized_a = false;
        channel.state.finalized_b = false;
        channel.params = params;
        channel.control.funded_a = false;
        channel.control.funded_b = false;

        // Add Channel to channels
        channels[channel_count] = channel;

        // Add Participants to participants
        participants.push(params.participant_a);
        participants.push(params.participant_b);

        // Update channel_count
        channel_count += 1;
    }
    
    /**
     * @dev Funds a channel with the given amount
     *      and updates the balance of either participant_a or participant_b depending on the caller 
     * @param channel_id The id of the channel
     * @param caller The address of the caller
     * @param amount The amount to fund the channel with
     */
    function fund (int channel_id, address caller , uint256 amount) public {

        Channel memory channel = channels[channel_id];

        // Check if channel exists
        require(channel.state.channel_id == channel_id, "Channel does not exist");

        // Check if channel is not finalized
        require(channel.state.finalized_a == false && channel.state.finalized_b == false, "Channel is finalized");

        // Check if caller is participant_a or participant_b
        if (caller == channel.params.participant_a.addresse){
            // Check if participant_a is not funded
            require(channel.control.funded_a == false, "Participant A already funded");

            // Update balance_A
            channel.state.balance_A += amount;

            // Update funded_a
            channel.control.funded_a = true;

            // Update balance of participant_a
            channel.state.balance_A = amount;
        }
        else if (caller == channel.params.participant_b.addresse){
            // Check if participant_b is not funded
            require(channel.control.funded_b == false, "Participant B already funded");

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

        // Update Contract_Balance
        if(channel.control.funded_a == true && channel.control.funded_b == true){
            updateContractBalance(channel_id);
        }
    }

    /**
     * @dev Pays the given amount from the balance of the caller to the other participant
     *      and updates the balance of either participant_a or participant_b depending on the caller 
     *      sets finalized_a and finalized_b to false and increases the version_num by 1
     * @param channel_id The id of the channel
     * @param caller The address of the caller
     * @param amount The amount to pay
     */
    function pay(int channel_id, address caller, uint256 amount) public {
        //Bool to know if caller is A or B
        bool callerIsA=false;
        
        //Check if Channel exists
        require(channels[channel_id].state.channel_id == channel_id, "Channel does not exist");

        //Check if Caller is part of the given Channel
        //TODO == funktioniert nicht für Typ address
        require(channels[channel_id].params.participant_a.addresse == caller || channels[channel_id].params.participant_b.addresse == caller, "Caller is not part of the given Channel");

        //Define if Caller is A or B 
        if(channels[channel_id].params.participant_b.addresse == caller) callerIsA = true;
        
        //Check if Caller has enough Money, if True Transaktion is carried out
        if(callerIsA){
            require(channels[channel_id].state.balance_A >= amount, "Balance in Channel is not enough");

            channels[channel_id].state.balance_A -= amount;
            channels[channel_id].state.balance_B += amount; 

        }
        else{
            require(channels[channel_id].state.balance_B >= amount, "Balance in Channel is not enough");

            channels[channel_id].state.balance_B -= amount;
            channels[channel_id].state.balance_A += amount; 
        }

        //Finalized is false, because State of Channel has changed 
        channels[channel_id].state.finalized_a = false;
        channels[channel_id].state.finalized_b = false;

        //Increase of Version Number 
        channels[channel_id].state.version_num ++;

        if(callerIsA) {
            emit NewTransaction(1, msg.sender, channels[channel_id].params.participant_b.addresse, amount);
        } else {
            emit NewTransaction(1, msg.sender, channels[channel_id].params.participant_a.addresse, amount);
        }
    }

      // Update Contract_Balance with the amount
    function updateContractBalance(int channel_id) public {
        Contract_Balance = Contract_Balance + channels[channel_id].state.balance_A + channels[channel_id].state.balance_B;
    }
    
    /**
     * @dev Closes the channel and pays out the balance of the caller
     *      and updates the balance of either participant_a or participant_b depending on the caller 
     *      sets finalized_a and finalized_b to true deletes the channel from the data structure
     * @param channel_id The id of the channel
     * @param caller The address of the caller
     */
    function close(int channel_id, address caller) public {
        // Checks existence of channel
        require(channels[channel_id].state.channel_id == channel_id, "Channel does not exist");

        // Check if Caller is part of the given Channel
        require(channels[channel_id].params.participant_a.addresse == caller ||
                channels[channel_id].params.participant_b.addresse == caller,
                "Caller is not a participant of the given channel");

        // Checks whether the channel has been finalised
        require(channels[channel_id].state.finalized_a == false &&
                channels[channel_id].state.finalized_b == false,
                "Channel is already finalised");

        // Pay out Balances 
        if (channels[channel_id].params.participant_a.addresse == caller) {
            // Caller ist participant A
            channels[channel_id].params.participant_a.addresse.transfer(channels[channel_id].state.balance_A);
        } else {
            // Caller ist participant B
            channels[channel_id].params.participant_b.addresse.transfer(channels[channel_id].state.balance_B);
        }
    }

    //Calling this means that you are d'accord with how the trade went and are okay with ending the trade here
    function finalize(int channel_id) public {
        require(channels[channel_id].params.participant_a.addresse == msg.sender || channels[channel_id].params.participant_b.addresse == msg.sender, "Caller is not part of the given Channel");
        if(channels[channel_id].params.participant_a.addresse == msg.sender) {
            channels[channel_id].state.finalized_a = true;
        } else {
            channels[channel_id].state.finalized_b = true;
        }
        emit PartyFinalized(channel_id, msg.sender);
    }
    

    // FlashLoan Section
    
    function flashLoan(
    FlashBorrower receiver,
    uint256 amount,
    bytes calldata data) external returns (bool) {
        

        return true;
    }
}
