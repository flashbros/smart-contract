import strucStyle from "./../../styles.module.css";
import style from "./leftPanel.module.css";
import { getSigner, getProvider } from "../../../../../ethereum.js";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { stagger, animate } from "framer-motion";

export default function LeftPanel({ contract, getBalance }) {
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [flashLoanAmount, setFlashLoanAmount] = useState(0.0);
  const [modal, setModal] = useState("");

  let user3 = { name: "Charlie", id: 3 };

  useEffect(() => {
    dodo();
  }, [contract]);

  async function dodo() {
    if (contract) {
      let wb = ethers.utils.formatEther(
        (
          await getProvider().getBalance(
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
          )
        ).toString()
      );
      setWalletBalance(wb);
    }
  }

  const flashLoan = async () => {
    try {
      const conti = contract[3];
      const user1Contract = conti.connect(await getSigner(user3.id));
      await user1Contract.startFlashLoan(flashLoanAmount);
      await getBalance();
      dodo();
      onSuccess();
    } catch (e) {
      onError(e);
    }
  };

  const onSuccess = () => {
    setModal("FlashLoan successful!");
    const modal = document.getElementsByClassName(style.modal)[0];
    animate(modal, { opacity: 1, backgroundColor: "#46cc34" }, { duration: 1 });
    setTimeout(() => {
      animate(modal, { opacity: 0 }, { duration: 1 });
    }, 3000);
  };

  const onError = async (e) => {
    console.log(e);
    setModal("Error! FlashLoan failed.");
    const modal = document.getElementsByClassName(style.modal)[0];
    const item = document.getElementsByClassName(style.item);
    await animate(item, { opacity: 0 }, { duration: 0 });
    animate(modal, { opacity: 1, backgroundColor: "#CA3737" }, { duration: 1 });
    animate(item, { opacity: 1 }, { delay: stagger(0.3) });
    setTimeout(() => {
      animate(modal, { opacity: 0 }, { duration: 1, delay: 1 });
    }, 3000);
  };

  return (
    <div className={strucStyle.LeftPanel}>
      <div className={strucStyle.RelativeWrapper}>
        <div className={style.pp}>
          <div className={style.container}>
            <div>Charlie</div>
            <div>Wallet: {walletBalance} Eth</div>
            <div className={style.actionField}>
              <input
                className={strucStyle.input}
                type="number"
                placeholder="Amount"
                onChange={(e) => setFlashLoanAmount(e.target.value)}
              ></input>
              <div className={strucStyle.button} onClick={() => flashLoan()}>
                Request
              </div>
            </div>
            <div className={style.modal}>{modal}</div>
          </div>
          <div className={style.log}>
            <div className={style.logTitle}>Log</div>
            <div className={style.logContent}>
              <div className={style.item}>1. FlashLoan failed!</div>
              <div className={style.item}>2. FlashLoan failed!</div>
              <div className={style.item}>3. FlashLoan failed!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
