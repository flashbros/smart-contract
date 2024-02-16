import strucStyle from "./../../styles.module.css";
import style from "./userPanel.module.css";

export default function ActionField({ state }) {
  switch (state) {
    case 0:
      return (
        <div>
          0
        </div>
      );
    case 1:
      return (
        <div >
          1
        </div>
      );
    case 2:
      return (
        <>
         <input type="text" placeholder="Enter amount" className={strucStyle.input}/>
          <button className={strucStyle.button}>Fund</button>
        </>
      );
    case 3:
      return (
        <div >
          3
        </div>
      );
      case 4:
        return (
          <div >
            4
          </div>
        );
    default:
      return (
        <div>
          wrong state!
        </div>
      );
  }
}
