import style from "./buttonLayout.module.css";

const ButtonLayout = ({inactive}) => (
  <div className={style.ButtonLayout}>
    <div className={`${style.button} ${inactive[0] ? style.inactive : ""}`}>Open</div>
    <div className={`${style.button} ${inactive[1] ? style.inactive : ""}`}>Fund</div>
    <div className={`${style.button} ${inactive[2] ? style.inactive : ""}`}>Close</div>
    <div className={`${style.button} ${inactive[3] ? style.inactive : ""}`}>Withdraw</div>
  </div>
);

export default ButtonLayout;
