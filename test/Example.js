const { expect } = require("chai");
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");
const { getContractAddress } = require('@ethersproject/address')
const { ethers } = require("hardhat")

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract("Token");

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});

describe("FlashLoan - open method", function () {
  it("should open a new channel and update the channels mapping", async function () {
    const [owner, participantA, participantB] = await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy();

    const channel_id = 1;
    const initialChannel = await flashLoan.channels(channel_id);

    // Parameters for the new channel
    const params = {
      participant_a: {
        addresse: participantA.address,
      },
      participant_b: {
        addresse: participantB.address,
      },
    };

    const state = {
      channel_id: channel_id,
      balance_A: 0,
      balance_B: 0,
      version_num: 0,
      finalized: false,
    };

    // Open a new channel
    await flashLoan.connect(owner).open(params, state);

    // Check if the channel exists and is updated
    const newChannel = await flashLoan.channels(channel_id);
    expect(newChannel.state.channel_id).to.equal(channel_id);
    expect(newChannel.params.participant_a.addresse).to.equal(participantA.address);
    expect(newChannel.params.participant_b.addresse).to.equal(participantB.address);
    expect(newChannel.state.version_num).to.equal(0);
    expect(newChannel.state.finalized).to.equal(false);
    expect(newChannel.control.funded_a).to.equal(false);
    expect(newChannel.control.funded_b).to.equal(false);

    // Check if the balances mapping is not updated
    const balance = await flashLoan.balances(channel_id);
    expect(balance).to.equal(0);

    // Check if the contract balance remains 0
    const contractBalance = await flashLoan.Contract_Balance();
    expect(contractBalance).to.equal(0);
  });
});

describe("FlashLoan - fund method", function () {
  it("should fund a channel and update the channel balances", async function () {
    const [owner, participantA, participantB] = await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy();

    const channel_id = 1;
    const amount = 100; // Amount to fund the channel with

    // Open a new channel
    await flashLoan.connect(owner).open(
      {
        participant_a: {
          addresse: participantA.address,
        },
        participant_b: {
          addresse: participantB.address,
        },
      },
      {
        channel_id: channel_id,
        balance_A: 0,
        balance_B: 0,
        version_num: 0,
        finalized: false,
      }
    );
    

    // Fund the channel by participant A
    const txA = await flashLoan.connect(participantA).fund(channel_id, amount, {value: ethers.parseEther(amount.toString())});
    await txA.wait();

    // Check the channel state after participant A's funding
    const channel_A = await flashLoan.channels(channel_id);

    // Check if the channel balances are updated for participant A
    expect(channel_A.state.balance_A.toString()).to.equal(amount.toString());
    expect(channel_A.control.funded_a).to.be.true;

    // Check if the channel balances are not updated for participant B
    const channel_B = await flashLoan.channels(channel_id);

    expect(channel_B.state.balance_B.toString()).to.equal("0");
    expect(channel_B.control.funded_b).to.be.false;

    // Fund the channel by participant B
    const txB = await flashLoan.connect(participantB).fund(channel_id, amount, {value: ethers.parseEther(amount.toString())});
    await txB.wait();

    // Check the final channel state after participant B's funding
    const finalChannel = await flashLoan.channels(channel_id);


    // Check if the channel balances are updated for participant B
    expect(finalChannel.state.balance_B.toString()).to.equal(amount.toString());
    expect(finalChannel.control.funded_b).to.be.true;

    // Check if the contract balance is updated
    //TODO: brauchen wir das überhaupt?
    });
});


describe("FlashLoan - close method", function () {
  it("should close the channel, pay out the caller's balance, and update participant balances", async function () {
    const [owner, participantA, participantB] = await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy();

    const channel_id = 1;
    const fundAmountA = 100; // Amount to fund the channel with
    const fundAmountB = 50; // Amount to fund the channel with


    // Open a new channel with initial balances
    await flashLoan.connect(owner).open(
      {
        participant_a: {
          addresse: participantA.address,
        },
        participant_b: {
          addresse: participantB.address,
        },
      },
      {
        channel_id: channel_id,
        balance_A: 0,
        balance_B: 0,
        version_num: 0,
        finalized: false,
      }
    );
    
    // Fund the channel by participant A
    const txA = await flashLoan.connect(participantA).fund(channel_id, fundAmountA, {value: ethers.parseEther(fundAmountA.toString())});
    await txA.wait();  

    // Fund the channel by participant B
    const txB = await flashLoan.connect(participantB).fund(channel_id, fundAmountB, {value: ethers.parseEther(fundAmountB.toString())});
    await txB.wait();

    //geg balance of A and b before closing
    const balanceAbefore = await ethers.provider.getBalance(participantA.address);
    const balanceBbefore = await ethers.provider.getBalance(participantB.address);

    //finalize channel
    const txFinalize = await flashLoan.connect(participantA).finalize(channel_id);

    // Close the channel by participant A
    const txClose = await flashLoan.connect(participantA).close(channel_id);
    await txClose.wait();

    // Check the final channel state after participant A's closing
    const channel_A = await flashLoan.channels(channel_id);
    const balanceAafter = await ethers.provider.getBalance(participantA.address);
    expect(balanceAafter).to.equal(balanceAbefore + channel_A.state.balance_A.toString());

    // Check the final channel state after participant B's closing
    const channel_B = await flashLoan.channels(channel_id);
    const balanceBafter = await ethers.provider.getBalance(participantB.address);
    expect(balanceBafter).to.equal(balanceBbefore + channel_B.state.balance_B.toString());

  });
});