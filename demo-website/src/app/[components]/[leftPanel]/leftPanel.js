import strucStyle from "./../../styles.module.css";
import style from "./leftPanel.module.css";

export default function LeftPanel() {
  let walletBalance = 0;

  return (
    <div className={strucStyle.LeftPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <div className={style.pp}>
          <div className={style.container}>
            <div>Charlie</div>
            <div>Wallet: {walletBalance} Eth</div>
            <div>
              <div className={style.actionField}>
                <input
                  className={strucStyle.input}
                  type="text"
                  placeholder="Amount"
                ></input>
                <div className={strucStyle.button}>Request</div>
              </div>
              <div className={style.modal}>Sucess! FlashLoan granted.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
