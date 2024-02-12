import strucStyle from "./../../styles.module.css";
import ButtonLayout from "../[buttonLayout]/buttonLayout";
import style from "./userPanel.module.css";

export default function UserPanel({ title = "user1" }) {

    let i1 = true;
    let i2 = false;
    let i3 = false;
    let i4 = false;

    return (
        <div className={style.userContainer}>
            <div className={style.title}>{title}</div>
            <div className={strucStyle.chw}>Channel with A</div>
            <ButtonLayout i1={i1} i2={i2} i3={i3} i4={i4}/>
        </div>
    );
}
