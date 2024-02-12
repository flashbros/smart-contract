import style from "./buttonLayout.module.css";

const ButtonLayout = ({i1,i2,i3,i4}) => (
  <div className={style.ButtonLayout}>
    <div className={`${style.button} ${i1 ? style.inactive : ""}`}>Open</div>
    <div className={`${style.button} ${i2 ? style.inactive : ""}`}>Fund</div>
    <div className={`${style.button} ${i3 ? style.inactive : ""}`}>Close</div>
    <div className={`${style.button} ${i4 ? style.inactive : ""}`}>Withdraw</div>
  </div>
);

export default ButtonLayout;
