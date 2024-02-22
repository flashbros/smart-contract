"use client";
import styles from "./styles.module.css";
import LeftPanel from "./[components]/[leftPanel]/leftPanel";
import RightPanel from "./[components]/[rightPanel]/rightPanel";
import Header from "./[components]/[header]/header";
import { useState, useEffect } from "react";
import { getContract, getSigner, getProvider } from "../../../ethereum.js";
import ChannelLogic from "../../../contracts/ChannelLogic.json";
import ExampleBorrower from "../../../contracts/ExampleBorrower.json";
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
      const contractUser1 = contractChannelLogic.connect(await getSigner(1));
      const contractUser2 = contractChannelLogic.connect(await getSigner(2));

      let d = ethers.utils.formatEther(
        (
          await getProvider().getBalance(
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
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
      setContract([
        contractChannelLogic,
        contractUser1,
        contractUser2,
        contractExampleBorrower,
      ]);
    }
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      const conti = contract[0];
      conti.removeAllListeners();
      const fundEventFilter = conti.filters.ChannelFund();
      getProvider()
        .getLogs({
          ...fundEventFilter,
          fromBlock: 0,
          toBlock: "latest",
        })
        .then((logs) => {
          if (logs.length > 0 && state1 < 2 && state2 < 2) {
            setState1(2);
            setState2(2);
            console.log("ChannelFund - Logdd");
            
          }
        });
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
          setState1(7);
        } else {
          setState2(7);
        }
      });
      conti.on("ChannelWithdraw", (e) => {
        console.log("ChannelClose - Event");
        if (e) {
          setState1(7);
        } else {
          setState2(7);
        }
      });
    }
  }, [contract]);

  const onFund = async () => {
    console.trace();
    if ((await contract[0].channels(1))[2].funded_a) {
      setState1(4);
    }
    if ((await contract[0].channels(1))[2].funded_b) {
      setState2(4);
    }
  };

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
