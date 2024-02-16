import strucStyle from "./../../styles.module.css";
import UserPanel from "./userPanel";
import style from "./rightPanel.module.css";

export default function RightPanel() {
  let user1 = { name: "Alice", id: 1 };
  let user2 = { name: "Bob", id: 2 };
  return (
    <div className={strucStyle.RightPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <UserPanel user={user1} />
       
        <UserPanel user={user2} />
      </div>
    </div>
  );
}
