import style from "./buttonLayout.module.css";

const ButtonLayout = () => (
  <div className={style.ButtonLayout}>
        <div className={style.button}>Open</div>
        <div className={style.button}>Fund</div>
        <div className={style.button}>Close</div>
        <div className={style.button}>Withdraw</div>
  </div>
);

export default ButtonLayout;