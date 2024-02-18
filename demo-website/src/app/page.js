"use client";
import styles from "./styles.module.css";
import LeftPanel from "./[components]/[leftPanel]/leftPanel";
import RightPanel from "./[components]/[rightPanel]/rightPanel";
import Header from "./[components]/[header]/header";
import { useState, useEffect } from "react";
import { getContract, getSigner, getProvider } from "../../../ethereum.js";
import ChannelLogic from "../../../contracts/ChannelLogic.json";
import { ethers } from "ethers";

export default function HomePage() {
  const [contract, setContract] = useState(null); // The contract object
  const [channelCount, setChannelCount] = useState(0);
  const [balance, setBalance] = useState(0.0);

  const [currentState, setState] = useState([0, 0]);

  useEffect(() => {
    async function init() {
      const conti = await getContract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        ChannelLogic.abi,
        0 // Use the first account as the signer
      );
      const user1Contract = conti.connect(await getSigner(1));
      const user2Contract = conti.connect(await getSigner(2));
      setContract([conti, user1Contract, user2Contract]);
    }
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      getCount();
      getBalance();
      const conti = contract[0];
      conti.removeAllListeners();
      conti.on("ChannelOpen", (e) => {
        console.log("ChannelOpen - Event");
        getCount();
        setState([2, 2]);
      });
      conti.on("ChannelFund", async (e) => {
        console.log("ChannelFund - Event");
        getBalance();
        console.log(currentState);
        let arr = [
          currentState[0] < 2 ? 2 : currentState[0],
          currentState[1] < 2 ? 2 : currentState[1]
        ];
        console.log(arr);
        if ((await contract[0].channels(1))[2].funded_a) arr[0] = 4;
        if ((await contract[0].channels(1))[2].funded_b) arr[1] = 4;
        console.log(arr);
        setState(arr);
      });
      conti.on("ChannelClose", () => {
        console.log("ChannelClose - Event");
      });
    }
  }, [contract]);

  const getCount = async () => {
    try {
      console.log("getCount");
      const ch = await contract[0].channel_count();
      console.log(ch.toNumber());
      setChannelCount(ch.toNumber());
    } catch (error) {
      console.log(error);
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
      console.log(d);
      setBalance(d);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header balance={balance} />
      <LeftPanel />
      <div className={styles.dividerY} />
      <RightPanel
        contract={contract}
        currentState={currentState}
        setState={setState}
      />
    </div>
  );
}
