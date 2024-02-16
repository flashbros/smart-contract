import strucStyle from "./../../styles.module.css";
import style from "./userPanel.module.css";

export default function ActionField({ state }) {
  switch (state) {
    case 0:
      return <>0</>;
    case 1:
      return <>1</>;
    case 2:
      return (
        <>
          <input
            type="text"
            placeholder="Enter amount"
            className={strucStyle.input}
          />
          <button className={strucStyle.button}>Fund</button>
        </>
      );
    case 3:
      return <>3</>;
    case 4:
      return <>4</>;
    default:
      return <div>wrong state!</div>;
  }
}
