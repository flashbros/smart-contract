import strucStyle from "./../../styles.module.css";
import UserPanel from "./userPanel";
import style from "./rightPanel.module.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { animate } from "framer-motion";

export default function RightPanel({
  contract,
  state1,
  state2,
  setState1,
  setState2,
  balance,
}) {
  let user1 = { name: "Alice", id: 0 };
  let user2 = { name: "Bob", id: 1 };
  let channel = { id: "1" };

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
      if (state1 >= 2 && state2 >= 2 && !d1) {
        setD1(true);
        let chSta = document.getElementsByClassName(style.channelStatus)[0];
        let conDots = document.getElementsByClassName(style.connectionDots)[0];
        animate(conDots, { opacity: 1 }, { duration: 1 });
        animate(chSta, { opacity: 1 }, { duration: 0.5 });
      } else if (state1 == 8 || state2 == 8) {
        if (state1 == 8) {
          let conDots = document.getElementsByClassName(
            style.connectionDotsTop
          )[0];
          animate(conDots, { opacity: 0 }, { duration: 0.5 });
        }
        if (state2 == 8) {
          let conDots = document.getElementsByClassName(
            style.connectionDotsBottom
          )[0];
          animate(conDots, { opacity: 0 }, { duration: 0.5 });
        }
        if (state1 == 8 && state2 == 8) {
          let chSta = document.getElementsByClassName(style.channelStatus)[0];
          animate(chSta, { opacity: 0 }, { duration: 0.5 });
        }
      }
    }
    dodo();
  }, [state1, state2]);

  useEffect(() => {
    async function dodo() {
      if (contract) {
        setChannelBalance(
          ethers.utils.formatEther(
            (await contract[0].channels(1))[2].sum_of_balances.toString()
          )
        );
      }
    }
    dodo();
  }, [contract, balance]);

  useEffect(() => {
    console.log("Channel Balance: " + channelBalance);
  }, [channelBalance]);

  return (
    <div className={strucStyle.RightPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <div className={style.flexContainer}>
          <div className={style.connectionDots}>
            <div className={style.connectionDotsTop} />
            <div className={style.connectionDotsBottom} />
          </div>
          <UserPanel
            user={user1}
            users={users}
            contract={contract}
            ownState={state1}
            otherState={state2}
            setState={setState1}
            setOtherState={setState2}
            channelBalance={channelBalance}
          />
          <div className={style.channelStatus}>
            <div className={style.channelTitle}>Channel</div>
            <div>ID: {channel.id}</div>
            <div>Balance: {channelBalance} ETH</div>
          </div>
          <UserPanel
            user={user2}
            users={users}
            contract={contract}
            ownState={state2}
            otherState={state1}
            setState={setState2}
            setOtherState={setState1}
            channelBalance={channelBalance}
          />
        </div>
      </div>
    </div>
  );
}
