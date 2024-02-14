import strucStyle from "./../../styles.module.css";
import UserPanel from "./userPanel";

export default function RightPanel() {
  let user1 = { name: "Bob", id: 1 };
  let user2 = { name: "Alice", id: 2 };
  return (
    <div className={strucStyle.RightPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <UserPanel user={user1} />
        <UserPanel user={user2} />
      </div>
    </div>
  );
}
