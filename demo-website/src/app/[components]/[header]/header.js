import strucStyle from "./../../styles.module.css";
import style from "./header.module.css";

const Header = ({ balance }) => (
  <div className={strucStyle.Header}>
    <div className={style.balance}>Balance:{balance} Eth</div>
  </div>
);

export default Header;
