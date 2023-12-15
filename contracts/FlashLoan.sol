//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; //todo: which version do we need? - 0.8.23 is the latest

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
    // Variables
    uint256 public Contract_Balance = 0 ether;

    Participant[] public participants;
    
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
        //TODO: Richtig so? 

        // Check if channel already exists
        require(channels[state.channel_id].state.channel_id != state.channel_id, "Channel already exists");
        
        // Check if participants are the same
        require(compareParticipants(params.participant_a, params.participant_b) == false, "Participants are the same");

        // Check if version number is 0
        require(state.version_num == 0, "Version number is not 0");

        // Create new Channel
        Channel memory channel;
        channel.state = state;
        channel.params = params;
        channel.control.funded_a = false;
        channel.control.funded_b = false;

        // Add Channel to channels
        channels[channel_id] = channel;

        // Add Participants to participants
        participants.push(params.participant_a);
        participants.push(params.participant_b);

    }
    
    /**
     * @dev Funds a channel with the given amount
     *      and updates the balance of either participant_a or participant_b depending on the caller 
     * @param channel_id The id of the channel
     * @param amount The amount to fund the channel with
     */
    function fund (int channel_id, uint256 amount) public {

        Channel memory channel = channels[channel_id];

        // Check if channel exists
        require(channel.state.channel_id == channel_id, "Channel does not exist");

        // Check if channel is not finalized
        require(channel.state.finalized_a == false && channel.state.finalized_b == false, "Channel is finalized");

        // Check if caller is participant_a or participant_b
        if (msg.sender() == channel.params.participant_a.addresse){
            // Check if participant_a is not funded
            require(channel.control.funded_a == false, "Participant A already funded");

            // Update balance_A
            channel.state.balance_A += amount;

            // Update funded_a
            channel.control.funded_a = true;

            // Update balance of participant_a
            channel.state.balance_A = amount;
        }
        else if (msg.sender() == channel.params.participant_b.addresse){
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
    }


      // Update Contract_Balance with the amount
    //function updateContractBalance(int channel_id) public {
     //   Contract_Balance = Contract_Balance + channels[channel_id].state.balance_A + channels[channel_id].state.balance_B;
    //}
    
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
    }
    

    // FlashLoan Section
    
    function flashLoan(
    FlashBorrower receiver,
    uint256 amount,
    bytes calldata data) external returns (bool) {
        

        return true;
    }
}
