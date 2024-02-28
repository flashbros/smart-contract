import strucStyle from "./../../styles.module.css";
import style from "./header.module.css";

const Header = ({ balance }) => (
  <div className={strucStyle.Header}>
    <div className={style.headerWrapper}>
      <div>Flash Loan</div>
      <div className={style.balance}>Contract Balance: {balance} ETH</div>
      <div>Channels</div>
    </div>
  </div>
);

export default Header;
