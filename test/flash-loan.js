const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
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
});