import style from "./buttonLayout.module.css";

const ButtonLayout = ({ inactive, setState }) => (
  <div className={style.ButtonLayout}>
    <div
      className={`${style.button} ${inactive[0] ? style.inactive : ""}`}
      onClick={() => (!inactive[0] ? setState(1) : "")}
    >
      Open
    </div>
    <div
      className={`${style.button} ${inactive[1] ? style.inactive : ""}`}
      onClick={() => (!inactive[1] ? setState(3) : "")}
    >
      Fund
    </div>
    <div
      className={`${style.button} ${inactive[2] ? style.inactive : ""}`}
      onClick={() => (!inactive[2] ? setState(5) : "")}
    >
      Close
    </div>
    <div
      className={`${style.button} ${inactive[3] ? style.inactive : ""}`}
      onClick={() => (!inactive[3] ? setState(7) : "")}
    >
      Withdraw
    </div>
  </div>
);

export default ButtonLayout;
