import ButtonLayout from "../[buttonLayout]/buttonLayout";
import style from "./userPanel.module.css";
import strucStyle from "./../../styles.module.css";
import SelectField from "./selectField";

export default function UserPanel({ user = { name: "user", id: 0 } }) {
  let channelID = 0;
  let userBalance = 0;

  let users = [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
    { id: 2, name: "Charlie" },
    { id: 3, name: "David" },
    { id: 4, name: "Eve" },
  ];

  return (
    <div className={strucStyle.HalfPanel}>
      <div className={style.userContainer}>
        <div className={style.left}>
          <div className={style.title}>{user.name}</div>
          <div>Wallet: {userBalance} Eth</div>
          <div className={style.ch}>ChannelID: {channelID}</div>
        </div>
        <div className={style.right}>
          <div className={style.budget}>{userBalance} Eth - User Balance</div>
          <div className={style.budget}>{userBalance} Eth - Earned</div>
        </div>

        <div className={style.fields}>
          <div className={style.actionField}>
            <input
              className={strucStyle.input}
              type="text"
              placeholder="Input"
            ></input>
            <div className={strucStyle.button}>Send</div>
          </div>
        </div>
        <ButtonLayout inactive={[false, false, false, false]} />
      </div>
    </div>
  );
}