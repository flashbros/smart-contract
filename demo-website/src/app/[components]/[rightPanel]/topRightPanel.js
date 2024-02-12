import ButtonLayout from "../[buttonLayout]/buttonLayout";
import strucStyle from "./../../styles.module.css";
import style from "./topRightPanel.module.css";

const TopRightPanel = () => (
  <div className={strucStyle.TopRightPanel}>
    <ButtonLayout i1={false} i2={false} i3={false} i4={true}/>
  </div>
);

export default TopRightPanel;