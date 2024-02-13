import strucStyle from "./../../styles.module.css";
import BottomRightPanel from "./bottomRightPanel";
import TopRightPanel from "./topRightPanel";

const RightPanel = () => (
  <div className={strucStyle.RightPanel}>
    <div className={strucStyle.RelativeWrapper}>
      <TopRightPanel />
      {/* <div className={strucStyle.dividerX} /> */}
      <BottomRightPanel />
    </div>
  </div>
);

export default RightPanel;
