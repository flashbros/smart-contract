require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accountsBalance: "10000000000000000000000",
      allowUnlimitedContractSize: true,
    },
  },
};
