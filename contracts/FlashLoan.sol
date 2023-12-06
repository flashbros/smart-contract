//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// Interfaces
interface FlashBorrower {
    function onFlashLoan(
        address initiator,
        uint256 amount,
        uint256 fee,
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
    uint256 public Contract_Balance = 0 ether;

    Participant[] public participants;
    Channel[] public channels;
    int256 public channel_count = 0;
    

    // Mapping: Channel_ID => Balance
    mapping(int => uint256) public balances;

    // Channel

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
        channels.push(channel);

        // Add Participants to participants
        participants.push(params.participant_a);
        participants.push(params.participant_b);

        // Update channel_count
        channel_count += 1;
    }


    // FlashLoan

    // Update Contract_Balance with the amount of ETH in every channel
    function updateContractBalance() public returns (bool) {
        Contract_Balance = 0;
        for(int i = 0; i < channel_count; i++){
            Contract_Balance += balances[i];
        }
        return true;
    }
     
    function flashLoan(
    FlashBorrower receiver,
    uint256 amount,
    bytes calldata data) external returns (bool) {
        

        return true;
    }
}
