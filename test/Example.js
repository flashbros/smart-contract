const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Smash Loan", function () {
  /*
  it("Transfer works aiaiia", async function () {

    const [owner, user1] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract("Token");

    // show total supply
    const totalSupply = await hardhatToken.totalSupply();
    console.log("Total supply: ", totalSupply);
    await hardhatToken.transfer(user1.address, 50);
    console.log("User1's balance: ", await hardhatToken.balanceOf(user1.address));

    
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    console.log("Owner's balance: ", ownerBalance);
    expect(await hardhatToken.totalSupply() - BigInt(50)).to.equal(ownerBalance);
  });
  */
  it("Channel opening works", async function () {
    const [owner, user1] = await ethers.getSigners();
    const flashloan = await ethers.deployContract("FlashLoan");

    const partA = {
      addresse: owner.address
    };
    const partB = {
      addresse: user1.address
    };
    const params = {
      participant_a: partA,
      participant_b: partB
    };

    flashloan.open(params);

    const numberOfChannels = await flashloan.channel_count();
    const firstChannel = await flashloan.channels(0);
    //console.log("First Channel: ", firstChannel);
    console.log(numberOfChannels);

    //expect(numberOfChannels).to.equal(1);

  });
});