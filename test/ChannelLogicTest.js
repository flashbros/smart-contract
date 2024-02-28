const { expect } = require("chai");
const { cons } = require("fp-ts/lib/NonEmptyArray2v");
const { ethers } = require("hardhat");

describe("FlashLoan - open method", function () {
  it("should open a new channel and update the channels mapping", async function () {
    const [owner, participantA, participantB] = await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("ChannelLogic");
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
    expect(newChannel.state.channel_id.toNumber()).to.equal(channel_id);
    expect(newChannel.params.participant_a.addresse).to.equal(
      participantA.address
    );
    expect(newChannel.params.participant_b.addresse).to.equal(
      participantB.address
    );
    expect(newChannel.state.version_num.toNumber()).to.equal(0);
    expect(newChannel.state.finalized).to.equal(false);
    expect(newChannel.control.funded_a).to.equal(false);
    expect(newChannel.control.funded_b).to.equal(false);

    // Check if the contract balance remains 0
    const contractBalanceBefore = await ethers.provider.getBalance(flashLoan.address);
    expect(contractBalanceBefore.toNumber()).to.equal(0);
  });
});


describe("FlashLoan - fund method", function () {
  it("should fund a channel and update balances and control flags", async function () {
    const [owner, participantA, participantB] = await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("ChannelLogic");
    const flashLoan = await FlashLoan.deploy();

    const channel_id = 1;

    // Open a new channel
    const openParams = {
      participant_a: {
        addresse: participantA.address,
      },
      participant_b: {
        addresse: participantB.address,
      },
    };
    const openState = {
      channel_id: channel_id,
      balance_A: 0,
      balance_B: 0,
      version_num: 0,
      finalized: false,
    };
    await flashLoan.connect(owner).open(openParams, openState);

    // Fund the channel
    const fundAmount = ethers.utils.parseEther("1"); // 1 Ether
    const fundTx = await flashLoan.connect(participantA).fund(channel_id, { value: fundAmount });
    const receipt = await fundTx.wait();

    // Check the emitted events
    const contractBalanceUpdatedEvent = receipt.events ? receipt.events.find((event) => event.event === 'ContractBalanceUpdated') : undefined;
    console.log('Contract Balance Updated Event:', contractBalanceUpdatedEvent ? contractBalanceUpdatedEvent.args : 'Event not found');


    // Check if the channel is updated
    const fundedChannel = await flashLoan.channels(channel_id);
    expect(fundedChannel.state.balance_A.toString()).to.equal(fundAmount.toString());
    expect(fundedChannel.control.funded_a).to.equal(true);

    // Check if the contract balance is updated
    const contractBalanceBefore = await ethers.provider.getBalance(flashLoan.address);
    //const contractBalance = await flashLoan.Contract_Balance();
    expect(contractBalanceBefore.toString()).to.equal(fundAmount.toString());

  });
});


describe("FlashLoan - close method", function () {
  it("should close a channel and transfer balances accordingly", async function () {
    const [owner, participantA, participantB] = await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("ChannelLogic");
    const flashLoan = await FlashLoan.deploy();

    const channel_id = 1;

    // Open a new channel
    const openParams = {
      participant_a: {
        addresse: participantA.address,
      },
      participant_b: {
        addresse: participantB.address,
      },
    };
    const openState = {
      channel_id: channel_id,
      balance_A: 0,
      balance_B: 0,
      version_num: 0,
      finalized: false,
    };
    await flashLoan.connect(owner).open(openParams, openState);

    // Get initial balances of participants
    //const initialBalanceA = await ethers.provider.getBalance(participantA.address);
    //const initialBalanceB = await ethers.provider.getBalance(participantB.address);

    //fund channel
    const fundAmount = ethers.utils.parseEther("1"); // 1 Ether
    const fundTx = await flashLoan.connect(participantA).fund(channel_id, { value: fundAmount });
    const receipt = await fundTx.wait();
    
    const dd = (await flashLoan.channels(channel_id));

    // Close the channel
    const closeTx = await flashLoan.connect(participantA).close({
      channel_id: channel_id,
      balance_A: ethers.utils.parseEther("0.5"),
      balance_B: ethers.utils.parseEther("0.5"),
      version_num: 0,
      finalized: true,
    });
    await closeTx.wait();

    // Check if the channel is closed
    const closedChannel = await flashLoan.channels(channel_id);
    expect(closedChannel.control.closed).to.equal(true);

  });
});

describe("FlashLoan - withdraw method", function () {
  it("should allow a participant to withdraw their balance after the channel is closed", async function () {
    const [owner, participantA, participantB] = await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("ChannelLogic");
    const flashLoan = await FlashLoan.deploy();

    const channel_id = 1;

    // Open a new channel
    const openParams = {
      participant_a: {
        addresse: participantA.address,
      },
      participant_b: {
        addresse: participantB.address,
      },
    };
    const openState = {
      channel_id: channel_id,
      balance_A: 0,
      balance_B: 0,
      version_num: 0,
      finalized: false,
    };
    await flashLoan.connect(owner).open(openParams, openState);

    // Close the channel
    await flashLoan.connect(participantA).close(openState);

    // Get initial balance of participant A
    const initialBalanceA = await ethers.provider.getBalance(participantA.address);

    // Withdraw balance from the closed channel
    const withdrawTx = await flashLoan.connect(participantA).withdraw(channel_id);
    await withdrawTx.wait();

    // Get final balance of participant A
    const finalBalanceA = await ethers.provider.getBalance(participantA.address);

    // Calculate expected final balance of participant A
    const expectedFinalBalanceA = initialBalanceA.add(ethers.utils.parseEther("1")); // Participant A receives their balance back

    // Check if the balance is transferred correctly
    expect(finalBalanceA.toString()).to.equal(expectedFinalBalanceA.toString());
  });
});