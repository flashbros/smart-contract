const { expect } = require("chai");
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
    const contractBalanceBefore = await ethers.provider.getBalance(
      flashLoan.address
    );
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
    const fundTx = await flashLoan
      .connect(participantA)
      .fund(channel_id, { value: fundAmount });
    const receipt = await fundTx.wait();

    // Check the emitted events
    const contractBalanceUpdatedEvent = receipt.events
      ? receipt.events.find((event) => event.event === "ContractBalanceUpdated")
      : undefined;
    console.log(
      "Contract Balance Updated Event:",
      contractBalanceUpdatedEvent
        ? contractBalanceUpdatedEvent.args
        : "Event not found"
    );

    // Check if the channel is updated
    const fundedChannel = await flashLoan.channels(channel_id);
    expect(fundedChannel.state.balance_A.toString()).to.equal(
      fundAmount.toString()
    );
    expect(fundedChannel.control.funded_a).to.equal(true);

    // Check if the contract balance is updated
    const contractBalanceBefore = await ethers.provider.getBalance(
      flashLoan.address
    );
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
    const fundTx = await flashLoan
      .connect(participantA)
      .fund(channel_id, { value: fundAmount });
    const receipt = await fundTx.wait();

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
    expect(closedChannel.control.withdrawed_a).to.equal(true);
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

    //Fund the channel
    const fundAmount = ethers.utils.parseEther("1"); // 1 Ether
    const fundTx = await flashLoan
      .connect(participantA)
      .fund(channel_id, { value: fundAmount });
    const receipt = await fundTx.wait();

    // Close the channel
    const finalBalance = ethers.utils.parseEther("0.5");
    const closeTx = await flashLoan.connect(participantA).close({
      channel_id: channel_id,
      balance_A: finalBalance,
      balance_B: finalBalance,
      version_num: 0,
      finalized: true,
    });
    await closeTx.wait();

    // Withdraw the balance
    const withdrawTx = await flashLoan
      .connect(participantB)
      .withdraw(channel_id);
    await withdrawTx.wait();

    // Check if the participant's balance is updated
    const closedChannel = await flashLoan.channels(channel_id);
    expect(closedChannel.control.closed).to.equal(true);
    expect(closedChannel.control.withdrawed_a).to.equal(true);
    expect(closedChannel.control.withdrawed_b).to.equal(true);
    expect(closedChannel.state.balance_A.toString()).to.equal("0");
    expect(closedChannel.state.balance_B.toString()).to.equal("0");
  });
});

describe("FlashLoan - FlashLoan method", function () {
  it("should allow a participant to withdraw their balance after the channel is closed", async function () {
    const [owner, participantA, participantB, participantC] =
      await ethers.getSigners();
    const FlashLoan = await ethers.getContractFactory("ChannelLogic");
    const flashLoan = await FlashLoan.deploy();
    const ExampleBorrower = await ethers.getContractFactory("ExampleBorrower");
    const exampleBorrower = await ExampleBorrower.deploy();

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

    //Fund the channel
    const fundAmount = ethers.utils.parseEther("1"); // 1 Ether
    const fundTx1 = await flashLoan
      .connect(participantA)
      .fund(channel_id, { value: fundAmount });
    const receipt1 = await fundTx1.wait();
    const fundTx2 = await flashLoan
      .connect(participantB)
      .fund(channel_id, { value: fundAmount });
    const receipt2 = await fundTx2.wait();

    // Make a flash loan
    //TODO: müssen elementar noch was an ExampleBorrower ändern
    const flashLoanTx = await exampleBorrower
      .connect(participantC)
      .startFlashLoan(ethers.utils.parseEther("1"));
    await flashLoanTx.wait();

    // Close the channel
    const closeTx = await flashLoan.connect(participantA).close({
      channel_id: channel_id,
      balance_A: ethers.utils.parseEther("1.1"),
      balance_B: ethers.utils.parseEther("1"),
      version_num: 0,
      finalized: true,
    });
    await closeTx.wait();

    // Withdraw the balance
    const withdrawTx = await flashLoan
      .connect(participantB)
      .withdraw(channel_id);
    await withdrawTx.wait();

    // Check if the participant's balance is updated
    const closedChannel = await flashLoan.channels(channel_id);
    expect(closedChannel.control.closed).to.equal(true);
    expect(closedChannel.control.withdrawed_a).to.equal(true);
    expect(closedChannel.control.withdrawed_b).to.equal(true);
  });
});
