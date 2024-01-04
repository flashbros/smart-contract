"use client";
import { useState, useEffect } from "react";
import { getContract, getSigner } from "../../../ethereum.js";
import ChannelLogic from "../../../contracts/ChannelLogic.json";
import { get } from "lodash";
import { use } from "chai";

export default function Home() {
  const [contract, setContract] = useState(null); // The contract object
  const [channelCount, setChannelCount] = useState(0);

  useEffect(() => {
    const cont = getContract(
      "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      ChannelLogic.abi,
      0 // Use the first account as the signer
    );
    
    // Funktioniert nicjt :(((((((((((((((((
    cont.on("ChannelOpen", (from, to, amount, event) => {
      getCount();
     });

   
     setContract(cont);
  }, []);

  const getCount = async () => {
    try {
      const ch = await (await contract).channelCount();
      console.log(ch.toNumber());
      setChannelCount(ch.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const openChan = async () => {
    try {
      const Channel_Params = {
        participant_a: {
          addresse: await (await getSigner(1)).getAddress(),
        },
        participant_b: {
          addresse: await (await getSigner(2)).getAddress(),
        },
      };
      const Channel_State = {
        channel_id: 1,
        balance_A: 0,
        balance_B: 0,
        version_num: 0,
        finalized: false,
      };

      console.log(Channel_Params);

      await (await contract).open(Channel_Params, Channel_State);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div>
        <button onClick={getCount}>Get Count</button>
        <button onClick={openChan}>Open Chan</button>
        <p>Channel Count: {channelCount}</p>
      </div>
    </main>
  );
}
