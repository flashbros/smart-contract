// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const ChannelLogic = await ethers.getContractFactory("ChannelLogic");
  const cl = await ChannelLogic.deploy();
  console.log("ChannelLogic deployed to:", cl.address);
  const ExampleBorrower = await ethers.getContractFactory("ExampleBorrower");
  const eb = await ExampleBorrower.deploy();
  console.log("ExampleBorrower deployed to:", eb.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().
then(() => process.exit(0)).
catch((error) => {
  console.error(error);
  process.exit(1);
});
