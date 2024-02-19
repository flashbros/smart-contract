import strucStyle from "./../../styles.module.css";
import style from "./leftPanel.module.css";

export default function LeftPanel({ contract }) {
  let walletBalance = 0;

  const flashLoan = async () => {
    try {
      const conti = contract[3];
      await conti.startFlashLoan();
    } catch (e) {
      console.log(e);
    }
  };

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
                <div className={strucStyle.button} onClick={() => flashLoan()}>Request</div>
              </div>
              <div className={style.modal}>Sucess! FlashLoan granted.</div>
            </div>
          </div>
          <div className={style.log}>Log</div>
        </div>
      </div>
    </div>
  );
}
