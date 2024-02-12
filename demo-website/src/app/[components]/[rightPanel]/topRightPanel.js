import UserPanel from "./userPanel";
import strucStyle from "./../../styles.module.css";

const TopRightPanel = () => (
  <div className={strucStyle.TopRightPanel}>
    <UserPanel title="user2" />
  </div>
);

export default TopRightPanel;
