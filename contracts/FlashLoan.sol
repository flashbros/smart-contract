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
    int balance;
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

    // 
    mapping(int => uint256) public balances;

    // Channel


    // FlashLoan

    // Update Contract_Balance with the amount of ETH in every channel
    function updateContractBalance() public returns (bool) {
        // Your code here
        return true;
    }
     
     


    function flashLoan(
    FlashBorrower receiver,
    uint256 amount,
    bytes calldata data) external returns (bool) {
    

        return true;
    }
}
