import UserPanel from "./userPanel";
import strucStyle from "./../../styles.module.css";

export default function BottomRightPanel() {
  let user = { name: "Bob", id: 1 };

  return (
    <div className={strucStyle.BottomRightPanel}>
      <UserPanel user={user} />
    </div>
  );
}
