import strucStyle from "./../../styles.module.css";
import style from "./header.module.css";


const Header = ({retBalance}) => (
  <div className={strucStyle.Header}>
    <div className={style.balance}>
      Balance: {retBalance}
      </div>
  </div>
);

export default Header;