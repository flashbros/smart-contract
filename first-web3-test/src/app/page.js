"use client";

import Image from 'next/image'
import styles from './page.module.css'
import { useEffect, useState } from "react";
import { getContract } from "../../../ethereum.js";
import FlashLoan from "../../../contracts/FlashLoan.json";

export default function Home() {

  const [showch] = useState(0);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function initContract() {
      const contract = getContract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        FlashLoan.abi,
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
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.js</code>
        </p>
      </div>

      <div>
        <h1>Channels: { showch }</h1>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

    </main>
  )
}
