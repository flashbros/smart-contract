import ButtonLayout from "../[buttonLayout]/buttonLayout";
import style from "./userPanel.module.css";
import strucStyle from "./../../styles.module.css";
import SelectField from "./selectField";
import { useState, useEffect } from "react";
import ActionField from "./actionField";

export default function UserPanel({
  user = { name: "user", id: 0 },
  users = [{ name: "user", id: 0 }],
  contract,
}) {
  let channelID = 0;
  let userBalance = 0;

  const [inactiveButtons, setInactiveButtons] = useState([
    true,
    true,
    true,
    true,
  ]);

  const [currentSate, setState] = useState(0);

  useEffect(() => {
    switch (currentSate) {
      case 0:
        setInactiveButtons([false, true, true, true]);
        break;
      case 2:
        setInactiveButtons([true, false, false, false]);
        break;
      case 4:
        setInactiveButtons([true, true, false, false]);
        break;
      default:
        setInactiveButtons([true, true, true, true]);
    }
  }, [currentSate]);

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
        <ActionField
          state={currentSate}
          setState={setState}
          user={user}
          users={users}
          contract={contract}
        />
      </div>
      <ButtonLayout inactive={inactiveButtons} setState={setState} />
    </div>
  );
}
