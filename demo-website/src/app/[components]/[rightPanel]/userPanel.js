import ButtonLayout from "../[buttonLayout]/buttonLayout";
import style from "./userPanel.module.css";

export default function UserPanel({ title = "user1" }) {
  let channelID = 0;

  return (
    <div className={style.userContainer}>
      <div className={style.title}>{title}</div>
      <div className={style.chw}>ChannelID: {channelID}</div>
      <div className={style.actionField}>
        <input
          className={style.input}
          type="text"
          placeholder="input">
        </input>
        <div className={style.button}>Send</div>
      </div>
      <ButtonLayout inactive={[false, false, false, false]} />
    </div>
  );
}
