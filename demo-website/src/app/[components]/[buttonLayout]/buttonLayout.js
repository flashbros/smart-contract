import { cons } from "fp-ts/lib/NonEmptyArray2v";
import style from "./buttonLayout.module.css";
import { set } from "lodash";

export default function ButtonLayout({
  user,
  inactive,
  currentState,
  setState,
}) {

  return (
    <div className={style.ButtonLayout}>
      <div
        className={`${style.button} ${inactive[0] ? style.inactive : ""}`}
        onClick={() => (!inactive[0] ? setState([user.id == 0 ? 1 : currentState[0], user.id == 1 ? 1 : currentState[1]]) : "")}
      >
        Open
      </div>
      <div
        className={`${style.button} ${inactive[1] ? style.inactive : ""}`}
        onClick={() => (!inactive[1] ? setState([user.id == 0 ? 3 : currentState[0], user.id == 1 ? 3 : currentState[1]]) : "")}
      >
        Fund
      </div>
      <div
        className={`${style.button} ${inactive[2] ? style.inactive : ""}`}
        onClick={() => (!inactive[2] ? setState([user.id == 0 ? 5 : currentState[0], user.id == 1 ? 5 : currentState[1]]) : "")}
      >
        Close
      </div>
      <div
        className={`${style.button} ${inactive[3] ? style.inactive : ""}`}
        onClick={() => (!inactive[5] ? setFitState(7) : "")}
      >
        Withdraw
      </div>
    </div>
  );
}
