

pragma solidity ^0.8.19; 
import "hardhat/console.sol";

contract CryptoMarket {

    function doArbitrage() external payable {
        require(msg.value != 0, "Can't do arbitrage without money");
        (bool transferSuccess, bytes memory data) = payable(msg.sender).call{value: msg.value * 11 / 10}("");
        require(transferSuccess, "Transfer failed");    
    }

}

