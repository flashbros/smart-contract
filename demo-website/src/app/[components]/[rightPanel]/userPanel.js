import ButtonLayout from "../[buttonLayout]/buttonLayout";
import style from "./userPanel.module.css";
import { useState, useEffect } from "react";
import ActionField from "./actionField";
import { ethers } from "ethers";
import { getProvider, getSigner } from "../../../../../ethereum.js";

export default function UserPanel({
  user = { name: "user", id: 0 },
  users = [{ name: "user", id: 0 }],
  contract,
  currentState,
  setState,
}) {
  let channelID = 1;
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [userBalance, setUserBalance] = useState(0.0);
   
  useEffect(() => {
    async function dodo() {
      if (contract) {
        let wb = ethers.utils
          .formatEther(
            (await (await getSigner(user.id + 1)).getBalance()).toString()
          )
          .slice(0, 7);
        setWalletBalance(wb);
        let ub = ethers.utils.formatEther(
          (await contract[0].channels(1))[0][user.id + 1].toString()
        );
        setUserBalance(ub);
      }
    }
    dodo();
  }, [contract, currentState]);

  return (
    <div className={style.userContainer}>
      <div className={style.topWrapper}>
        <div className={style.left}>
          <div className={style.title}>{user.name}</div>
          <div>Wallet: {walletBalance} ETH</div>
          <div className={style.ch}>ChannelID: {channelID}</div>
        </div>
        <div className={style.right}>
          <div className={style.budget}>{userBalance} ETH - User Balance</div>
        </div>
      </div>
      <div className={style.actionField}>
        <ActionField
          currentState={currentState}
          setState={setState}
          user={user}
          users={users}
          contract={contract}
        />
      </div>
      <ButtonLayout
        user={user}
        currentState={currentState}
        setState={setState}
      />
    </div>
  );
}
