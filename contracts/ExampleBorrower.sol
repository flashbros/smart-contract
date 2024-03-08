//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;
import "hardhat/console.sol";
import "./ChannelLogic.sol";
import "./CryptoMarket.sol";

contract ExampleBorrower is FlashBorrower {

    ChannelLogic public channelLogic = ChannelLogic(payable(0x5FbDB2315678afecb367f032d93F642f64180aa3));
    CryptoMarket public cryptoMarket = CryptoMarket(payable(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0));

    function startFlashLoan(uint256 amount) external {
        bool d = channelLogic.flashLoan(this, amount);
        console.log("Flash loan result: %s", d);
    }

    function onFlashLoan(
        address initiator,
        uint256 amount,
        uint256 fee
    ) external override returns (bool) {
        console.log("Flash loan initiated by: %s", initiator);
        console.log("Amount: %s", amount);
        console.log("Fee: %s", fee);

        //do arbitrage on the crypto market
        cryptoMarket.doArbitrage{value: amount}();

        channelLogic.payBack{value: (amount + fee)}();
        console.log("ExampleBorrower paid back flash loan");
        return true;
    }

    function receiver() external payable {
        console.log("Receiver %s", msg.value);
    }

    receive() external payable {
        console.log("ExampleBorrower Received %s", msg.value);
    }

    fallback() external payable {
        console.log("ExampleBorrower Fallback, Received %s", msg.value);
    }
}