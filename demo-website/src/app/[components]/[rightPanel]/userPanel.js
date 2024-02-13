import ButtonLayout from "../[buttonLayout]/buttonLayout";
import style from "./userPanel.module.css";
import SelectField from "./selectField";

export default function UserPanel({ user = { name: "user", id: 0}}) {
  let channelID = 0;

  let users = [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
    { id: 2, name: "Charlie" },
    { id: 3, name: "David" },
    { id: 4, name: "Eve" },
  ];

  return (
    <div className={style.userContainer}>
      <div className={style.title}>{user.name}</div>
      <div className={style.chw}>ChannelID: {channelID}</div>
      <div className={style.fields}>
        <div className={style.actionField}>
          <input
            className={style.input}
            type="text"
            placeholder="input"
          ></input>
          <div className={style.button}>Send</div>
        </div>
        <div className={style.fieldDivider}/>
        <SelectField ownId={user.id} users={users}/>
      </div>
      <ButtonLayout inactive={[false, false, false, false]} />
    </div>
  );
}
