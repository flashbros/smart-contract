import strucStyle from "./../../styles.module.css";
import UserPanel from "./userPanel";
import style from "./rightPanel.module.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";


export default function RightPanel({ contract, currentState, setState }) {
  let user1 = { name: "Alice", id: 0 };
  let user2 = { name: "Bob", id: 1 };

  const [d1, setD1] = useState(false);

  let users = [
    {
      id: 0,
      name: "Alice",
      addresse: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    },
    {
      id: 1,
      name: "Bob",
      addresse: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    },
  ];

  useEffect(() => {
    async function dodo() {
      if (currentState[0] >= 2 && currentState[1] >= 2 && !d1) {
        let dots = document.getElementById("dots");
        dots.classList.add(style.fadeIn);
        let chSta = document.getElementById("channelStatus");
        chSta.classList.add(style.fadeIn);
        setD1(true);
      } else if (currentState[0] >= 2 || currentState[1] >= 2) {
        console.log("works!");
        let chSta = document.getElementById("channelStatus");
        chSta.innerHTML =
          "Channel Funds: " +
          (parseFloat(
            ethers.utils.formatEther(
              (await contract[0].channels(1))[0].balance_A.toString()
            )
          ) +
            parseFloat(
              ethers.utils.formatEther(
                (await contract[0].channels(1))[0].balance_B.toString()
              )
            )) +
          " Eth";
      }
    }
    dodo();
  }, [currentState]);

  useEffect(() => {
    async function dodo() {
      if (contract) {
        let chSta = document.getElementById("channelStatus");
        chSta.innerHTML =
          "Channel Funds: " +
          (parseFloat(
            ethers.utils.formatEther(
              (await contract[0].channels(1))[0].balance_A.toString()
            )
          ) +
            parseFloat(
              ethers.utils.formatEther(
                (await contract[0].channels(1))[0].balance_B.toString()
              )
            )) +
          " Eth";
      }
    }
    dodo();
  }, [contract]);

  return (
    <div className={strucStyle.RightPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <div className={style.flexContainer}>
          <div id="dots" className={style.connectionDots} />
          <UserPanel
            user={user1}
            users={users}
            contract={contract}
            currentState={currentState}
            setState={setState}
          />
          <div id="channelStatus" className={style.channelStatus}>
            ff
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
