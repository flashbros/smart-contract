//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// Interfaces
interface FlashBorrower {
    function onFlashLoan(
        address initiator,
        int256 amount,
        int256 fee,
        bytes calldata data
    ) external returns (bytes32);
}

// Stucts

struct Participant {
    address addresse;
}

struct Channel_State {
    int channel_id;
    int balance_A;
    int balance_B;
    int version_num;
    bool finalized_a;
    bool finalized_b;
}

struct Channel_Params{
    Participant participant_a;
    Participant participant_b;
}

struct Channel_Control{
    bool funded_a;
    bool funded_b;
}

struct Channel{
    Channel_State state;
    Channel_Params params;
    Channel_Control control;
}

contract FlashLoan {
    // Variables
    int256 public Contract_Balance = 0 ether;

    Participant[] public participants;
    
    int256 public channel_count = 0;
    
    // Mapping: Channel_ID => Channel
    mapping(int => Channel) public channels;

    // Mapping: Channel_ID => Balance
    mapping(int => int256) public balances;


    // Channel

    // Open Channel
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

    function fund (int channel_id, address caller , int256 amount) public {

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
    


    // FlashLoan

    // Update Contract_Balance with the amount
    function updateContractBalance(int channel_id) public returns (bool) {
        Contract_Balance += channels[channel_id].state.balance_A + channels[channel_id].state.balance_B;
    }
     
    function flashLoan(
    FlashBorrower receiver,
    uint256 amount,
    bytes calldata data) external returns (bool) {
        

        return true;
    }
}
