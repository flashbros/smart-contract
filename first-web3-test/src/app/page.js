"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../../ethereum.js";
import ChannelLogic from "../../../contracts/ChannelLogic.json";

export default function Home() {

  const [showch] = useState(0);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function initContract() {
      const contract = getContract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        ChannelLogic.abi,
        0 // Use the first account as the signer
      );
      setContract(contract);
      
      }
      initContract();
  }, []);

  async function showChannels() {
    const ch = await contract.channel_count();
    return <ch />;
  }

  return (
    <main>
      
      <div>
        <h1>Channels: { showch }</h1>
      </div>

    </main>
  )
}
