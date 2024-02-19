//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19; //todo: which version do we need? - 0.8.23 is the latest, 0.8.19 is in the hardhat.config.js file
import "hardhat/console.sol";
import "./ChannelLogic.sol";

contract ExampleBorrower is FlashBorrower {

   


    function onFlashLoan(
        address initiator,
        uint256 amount,
        uint256 fee
    ) external override returns (bool) {
        console.log("Flash loan initiated by: %s", initiator);
        console.log("Amount: %s", amount);
        console.log("Fee: %s", fee);
        
        return true;
    }
}