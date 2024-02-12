import strucStyle from "./../../styles.module.css";
import style from "./header.module.css";

const Header = () => (
  <div className={strucStyle.Header}>
    <div className={style.balance}>
      Balance: $0.00
      </div>
  </div>
);

export default Header;