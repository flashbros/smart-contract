import strucStyle from "./../../styles.module.css";
import UserPanel from "./userPanel";
import style from "./rightPanel.module.css";

export default function RightPanel({openChan}) {
  let user1 = { name: "Alice", id: 0 };
  let user2 = { name: "Bob", id: 1 };

  let users = [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" }
  ];
  return (
    <div className={strucStyle.RightPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <div className={style.flexContainer}>
          <div className={style.connectionDots} />
          <UserPanel user={user1} users={users} openChan={openChan}/>
          <div className={style.channelStatus}>Channel Information</div>
          <UserPanel user={user2} users={users} openChan={openChan}/>
        </div>
      </div>
    </div>
  );
}
