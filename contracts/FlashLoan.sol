//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// Channel




// FlashLoan

interface FlashBorrower {
    function onFlashLoan(
        address initiator,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32);
}

contract FlashLoan {

    function flashLoan(
    FlashBorrower receiver,
    uint256 amount,
    bytes calldata data) external returns (bool) {
    

        return true;
    }
}
