import strucStyle from "./../../styles.module.css";
import UserPanel from "./userPanel";
import style from "./rightPanel.module.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { animate } from "framer-motion";

export default function RightPanel({
  contract,
  currentState,
  setState,
  balance,
}) {
  let user1 = { name: "Alice", id: 0 };
  let user2 = { name: "Bob", id: 1 };

  const [d1, setD1] = useState(false);
  const [channelBalance, setChannelBalance] = useState(0);

  let users = [
    {
      id: 0,
      name: "Alice",
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    },
    {
      id: 1,
      name: "Bob",
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    },
  ];

  useEffect(() => {
    async function dodo() {
      if (currentState[0] >= 2 && currentState[1] >= 2 && !d1) {
        setD1(true);
        let chSta = document.getElementsByClassName(style.channelStatus)[0];
        let conDots = document.getElementsByClassName(style.connectionDots)[0];
        animate(conDots, { opacity: 1 }, { duration: 1 });
        animate(chSta, { opacity: 1 }, { duration: 1 });
      } else if (currentState[0] >= 4 || currentState[1] >= 4) {
        setChannelBalance(
          ethers.utils.formatEther(
            (await contract[0].channels(1))[2].sum_of_balances.toString()
          )
        );
      }
    }
    dodo();
  }, [currentState]);

  useEffect(() => {
    async function dodo() {
      if (contract) {
        console.log(
          "Sum_of_balances:",
          ethers.utils.formatEther(
            (await contract[0].channels(1))[2].sum_of_balances.toString()
          )
        );
        setChannelBalance(
          ethers.utils.formatEther(
            (await contract[0].channels(1))[2].sum_of_balances.toString()
          )
        );
      }
    }
    dodo();
  }, [balance]); //TODO: contract sollte man entfernen können

  return (
    <div className={strucStyle.RightPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <div className={style.flexContainer}>
          <div className={style.connectionDots} />
          <UserPanel
            user={user1}
            users={users}
            contract={contract}
            currentState={currentState}
            setState={setState}
          />
          <div className={style.channelStatus}>
            Channel Fund: {channelBalance} ETH
          </div>
          <UserPanel
            user={user2}
            users={users}
            contract={contract}
            currentState={currentState}
            setState={setState}
          />
        </div>
      </div>
    </div>
  );
}
