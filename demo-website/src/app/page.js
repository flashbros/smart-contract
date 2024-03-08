"use client";
import styles from "./styles.module.css";
import LeftPanel from "./[components]/[leftPanel]/leftPanel";
import RightPanel from "./[components]/[rightPanel]/rightPanel";
import Header from "./[components]/[header]/header";
import { useState, useEffect } from "react";
import { getContract, getSigner, getProvider } from "../../../ethereum.js";
import ChannelLogic from "../../../contracts/ChannelLogic.json";
import ExampleBorrower from "../../../contracts/ExampleBorrower.json";
import CryptoMarket from "../../../contracts/CryptoMarket.json";
import { ethers } from "ethers";

export default function HomePage() {
  const [contract, setContract] = useState(null); // The contract object
  const [balance, setBalance] = useState(0.0);

  const [state1, setState1] = useState(0);
  const [state2, setState2] = useState(0);

  useEffect(() => {
    async function init() {
      const contractChannelLogic = await getContract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        ChannelLogic.abi,
        0 // Use the first account as the signer
      );
      const contractExampleBorrower = await getContract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        ExampleBorrower.abi,
        3 // Use the fourth account as the signer
      );
      const contractCryptoMarket = await getContract(
        "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        CryptoMarket.abi,
        4 // Use the fifth account as the signer
      );
      
      const contractUser1 = contractChannelLogic.connect(await getSigner(1));
      const contractUser2 = contractChannelLogic.connect(await getSigner(2));

      let d = ethers.utils.formatEther(
        (
          await getProvider().getBalance(
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
          )
        ).toString()
      );
      let e = ethers.utils.formatEther(
        (
          await getProvider().getBalance(
            "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
          )
        ).toString()
      );
      if (d < 1000) {
        await contractExampleBorrower.receiver({
          value: ethers.utils.parseEther("1000"),
        });
      }
      d = ethers.utils.formatEther(
        (
          await getProvider().getBalance(
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
          )
        ).toString()
      );
      if (e < 2500) {
        await contractCryptoMarket.receiver({
          value: ethers.utils.parseEther("2500"),
        });
      }
      e = ethers.utils.formatEther(
        (
          await getProvider().getBalance(
            "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
          )
        ).toString()
      );
      setContract([
        contractChannelLogic,
        contractUser1,
        contractUser2,
        contractExampleBorrower,
        contractCryptoMarket,
      ]);
    }
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      const conti = contract[0];
      conti.removeAllListeners();
      async function dodo() {
        const fundEventFilter = conti.filters.ChannelFund();
        await getProvider()
          .getLogs({
            ...fundEventFilter,
            fromBlock: 0,
            toBlock: "latest",
          })
          .then((logs) => {
            if (logs.length > 0 && state1 < 2 && state2 < 2) {
              setState1(2);
              setState2(2);
              onFund();
              console.log("ChannelFund - Past");
            }
          });
        const closeEventFilter = conti.filters.ChannelClose();
        await getProvider()
          .getLogs({
            ...closeEventFilter,
            fromBlock: 0,
            toBlock: "latest",
          })
          .then(async (logs) => {
            const dd = (await contract[0].channels(1)).control;

            if (dd.closed) {
              if (dd.withdrawed_a && !dd.withdrawed_b) {
                setState1(8);
                setState2(6);
              } else if (dd.withdrawed_b && !dd.withdrawed_a) {
                setState1(6);
                setState2(8);
              } else if (dd.withdrawed_a && dd.withdrawed_b) {
                setState1(8);
                setState2(8);
              }
            }
          });
      }
      dodo();
      conti.on("ChannelOpen", (e) => {
        console.log("ChannelOpen - Event");
        setState1(2);
        setState2(2);
      });
      conti.on("ChannelFund", async (e) => {
        console.log("ChannelFund - Event");
        onFund();
      });
      conti.on("ChannelClose", (e) => {
        console.log("ChannelClose - Event");
        if (e) {
          setState1(8);
        } else {
          setState2(8);
        }
      });
      conti.on("ChannelWithdraw", (e) => {
        console.log("ChannelClose - Event");
        if (e) {
          setState1(8);
        } else {
          setState2(8);
        }
      });
    }
  }, [contract]);

  async function onFund() {
    const dd = (await contract[0].channels(1))[2];
    if (dd.funded_a && state1 < 2) {
      setState1(4);
    }

    if (dd.funded_b && state2 < 2) {
      setState2(4);
    }
  }

  const getBalance = async () => {
    try {
      let d = ethers.utils.formatEther(
        (
          await getProvider().getBalance(
            "0x5fbdb2315678afecb367f032d93f642f64180aa3"
          )
        ).toString()
      );
      setBalance(d);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
  }, [state1, state2]);

  return (
    <div>
      <Header balance={balance} />
      <LeftPanel contract={contract} getBalance={getBalance} />
      <div className={styles.dividerY} />
      <RightPanel
        contract={contract}
        state1={state1}
        state2={state2}
        setState1={setState1}
        setState2={setState2}
        balance={balance}
      />
    </div>
  );
}
