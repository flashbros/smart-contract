"use client";
import styles from "./styles.module.css";
import LeftPanel from "./[components]/[leftPanel]/leftPanel";
import RightPanel from "./[components]/[rightPanel]/rightPanel";
import Header from "./[components]/[header]/header";
import { useState, useEffect } from "react";
import { getContract, getSigner } from "../../../ethereum.js";
import ChannelLogic from "../../../contracts/ChannelLogic.json";

export default function HomePage() {
  const [contract, setContract] = useState(null); // The contract object
  const [channelCount, setChannelCount] = useState(0);
  const [balance, setBalance] = useState(1337);

  useEffect(() => {
    async function init() {
      const conti = await getContract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        ChannelLogic.abi,
        0 // Use the first account as the signer
      );
      setContract(conti);
    }
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      getCount();
      getBalance();
      contract.removeAllListeners();
      contract.on("ChannelOpen", () => {
        console.log("ChannelOpen - Event");
        getCount();
      });
    }
  }, [contract]);

  const getCount = async () => {
    try {
      console.log("getCount");
      const ch = await contract.channel_count();
      console.log(ch.toNumber());
      setChannelCount(ch.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      console.log("getBalance");
      const balance = await contract.Contract_Balance();
      console.log(balance.toNumber());
      setBalance(balance.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header balance={balance} />
      <LeftPanel />
      <div className={styles.dividerY} />
      <RightPanel contract={contract}/>
    </div>
  );
}
