import style from "./buttonLayout.module.css";
import { useState, useEffect } from "react";

export default function ButtonLayout({ user, currentState, setState }) {
  const [inactive, setInactiveButtons] = useState([true, true, true, true]);

  useEffect(() => {
    switch (currentState[user.id]) {
      case 0:
        setInactiveButtons([false, true, true, true]);
        break;
      case 2:
        setInactiveButtons([true, false, false, true]);
        break;
      case 4:
        setInactiveButtons([true, true, false, true]);
        break;
      case 5:
        setInactiveButtons([true, true, true, false]);
        break;
      default:
        setInactiveButtons([true, true, true, true]);
    }
  }, [currentState]);

  return (
    <div className={style.ButtonLayout}>
      <div
        className={`${style.button} ${inactive[0] ? style.inactive : ""}`}
        onClick={() =>
          !inactive[0]
            ? setState([
                user.id == 0 ? 1 : currentState[0],
                user.id == 1 ? 1 : currentState[1],
              ])
            : ""
        }
      >
        Open
      </div>
      <div
        className={`${style.button} ${inactive[1] ? style.inactive : ""}`}
        onClick={() =>
          !inactive[1]
            ? setState([
                user.id == 0 ? 3 : currentState[0],
                user.id == 1 ? 3 : currentState[1],
              ])
            : ""
        }
      >
        Fund
      </div>
      <div
        className={`${style.button} ${inactive[2] ? style.inactive : ""}`}
        onClick={() =>
          !inactive[2]
            ? setState([user.id == 0 ? 6 : 5, user.id == 1 ? 6 : 5])
            : ""
        }
      >
        Close
      </div>
      <div
        className={`${style.button} ${inactive[3] ? style.inactive : ""}`}
        onClick={() => (!inactive[3] ? setState([6, 6]) : "")}
      >
        Withdraw
      </div>
    </div>
  );
}
