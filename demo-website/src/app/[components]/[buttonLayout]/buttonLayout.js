import style from "./buttonLayout.module.css";

const ButtonLayout = ({ inactive, setState }) => (
  <div className={style.ButtonLayout}>
    <div
      className={`${style.button} ${inactive[0] ? style.inactive : ""}`}
      onClick={() => setState(1)}
    >
      Open
    </div>
    <div
      className={`${style.button} ${inactive[1] ? style.inactive : ""}`}
      onClick={() => setState(2)}
    >
      Fund
    </div>
    <div
      className={`${style.button} ${inactive[2] ? style.inactive : ""}`}
      onClick={() => setState(3)}
    >
      Close
    </div>
    <div
      className={`${style.button} ${inactive[3] ? style.inactive : ""}`}
      onClick={() => setState(4)}
    >
      Withdraw
    </div>
  </div>
);

export default ButtonLayout;
