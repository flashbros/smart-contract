import strucStyle from "./../../styles.module.css";
import style from "./leftPanel.module.css";
import { getSigner } from "../../../../../ethereum.js";

export default function LeftPanel({ contract, getBalance }) {
  let walletBalance = 0;

  const flashLoan = async () => {
    try {
      const conti = contract[3];
      //console.log(conti);
      const user1Contract = conti.connect(await getSigner(3));
      //console.log(user1Contract);
      await user1Contract.startFlashLoan();
      await getBalance();
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
                <div className={strucStyle.button} onClick={() => flashLoan()}>
                  Request
                </div>
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
