import UserPanel from "./userPanel";
import strucStyle from "./../../styles.module.css";

export default function TopRightPanel() {
  let user = { name: "Alice", id: 0 };

  return (
    <div className={strucStyle.TopRightPanel}>
      <UserPanel  user={user}/>
    </div>
  );
}
