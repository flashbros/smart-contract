"use client";
import { getContract } from "../../../ethereum.js";
import ChannelLogic from "../../../contracts/ChannelLogic.json";

export default function Home() {
  const dooo = async () => {
    const contract = getContract(
      "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      ChannelLogic.abi,
      0 // Use the first account as the signer
    );
    try {
      const ch = await (await contract).channel_count();
      console.log(ch.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div>
        <button onClick={dooo}>Init Contract</button>
      </div>
    </main>
  );
}
