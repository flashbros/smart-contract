import ButtonLayout from "../[buttonLayout]/buttonLayout";
import style from "./userPanel.module.css";
import strucStyle from "./../../styles.module.css";
import SelectField from "./selectField";
import { useState } from "react";
import ActionField from "./actionField";

export default function UserPanel({ user = { name: "user", id: 0 } }) {
  let channelID = 0;
  let userBalance = 0;

  const [currentSate, setState] = useState(0);

  let users = [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
    { id: 2, name: "David" },
    { id: 3, name: "Eve" },
  ];

  return (
    <div className={style.userContainer}>
      <div className={style.topWrapper}>
        <div className={style.left}>
          <div className={style.title}>{user.name}</div>
          <div>Wallet: {userBalance} Eth</div>
          <div className={style.ch}>ChannelID: {channelID}</div>
        </div>
        <div className={style.right}>
          <div className={style.budget}>{userBalance} Eth - User Balance</div>
          <div className={style.budget}>{userBalance} Eth - Earned</div>
        </div>
      </div>
      <div className={style.actionField}>
        <ActionField state={currentSate} />
      </div>
      <ButtonLayout
        inactive={[false, false, false, false]}
        setState={setState}
      />
    </div>
  );
}
