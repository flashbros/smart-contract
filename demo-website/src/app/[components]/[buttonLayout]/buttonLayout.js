import style from "./buttonLayout.module.css";
import { useState, useEffect } from "react";

export default function ButtonLayout({
  user,
  state,
  setState,
  otherState,
  setOtherState,
}) {
  const [inactive, setInactiveButtons] = useState([true, true, true, true]);

  useEffect(() => {
    switch (state) {
      case 0:
        setInactiveButtons([false, true, true, true]);
        break;
      case 2:
        setInactiveButtons([true, false, false, true]);
        break;
      case 4:
        setInactiveButtons([true, true, false, true]);
        break;
      case 6:
        setInactiveButtons([true, true, true, false]);
        break;
      default:
        setInactiveButtons([true, true, true, true]);
    }
  }, [state]);

  return (
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
        onClick={() => {
          if (!inactive[2]) {
            setState(5);
            setOtherState(6);
          }
        }}
      >
        Close
      </div>
      <div
        className={`${style.button} ${inactive[3] ? style.inactive : ""}`}
        onClick={() => {
          if (!inactive[3]) {
            setState(7);
          }
        }}
      >
        Withdraw
      </div>
    </div>
  );
}
