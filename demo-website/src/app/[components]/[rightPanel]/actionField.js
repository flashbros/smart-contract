import strucStyle from "./../../styles.module.css";
import style from "./userPanel.module.css";
import { getSigner } from "../../../../../ethereum.js";
import { ethers } from "ethers";
const { useState } = require("react");
import { animate } from "framer-motion";

export default function ActionField({
  state,
  user,
  users,
  contract,
  walletBalance,
  channelBalance,
}) {
  const filterdUsers = users.filter((u) => u.id !== user.id);

  const [fundAmount, setFundAmount] = useState("0");
  const [closeAmount, setCloseAmount] = useState("0");
  const [error, setError] = useState("");

  const openChan = async () => {
    try {
      const Channel_Params = {
        participant_a: {
          addresse: await (await getSigner(1)).getAddress(),
        },
        participant_b: {
          addresse: await (await getSigner(2)).getAddress(),
        },
      };
      const Channel_State = {
        channel_id: 1,
        balance_A: 0,
        balance_B: 0,
        version_num: 0,
        finalized: false,
      };
      contract[0].open(Channel_Params, Channel_State);
    } catch (error) {
      console.log(error);
    }
  };

  const fundChan = async () => {
    try {
      if (parseFloat(fundAmount) >= walletBalance) {
        setError(`Wrong Input! Only numbers less ${walletBalance}!`);
        throw new Error(`Wrong Input! Only numbers less ${walletBalance}!`);
      }
      if (parseFloat(fundAmount) <= 0) {
        setError("Wrong Input! Only numbers greater 0!");
        throw new Error("Wrong Input! Only numbers greater 0!");
      }
      contract[user.id + 1].fund(1, {
        value: ethers.utils.parseEther(fundAmount),
      });
    } catch (error) {
      onError();
      console.log(error);
    }
  };

  const withdrawChan = async () => {
    try {
      contract[user.id + 1].withdraw(1);
    } catch (error) {
      console.log(error);
    }
  };

  const closeChan = async () => {
    try {
      if (parseFloat(closeAmount) >= channelBalance) {
        setError(`Wrong Input! Only numbers less ${channelBalance}!`);
        throw new Error(`Wrong Input! Only numbers less ${channelBalance}!`);
      }
      if (parseFloat(closeAmount) <= 0) {
        setError("Wrong Input! Only numbers greater 0!");
        throw new Error("Wrong Input! Only numbers greater 0!");
      }

      const Channel_State = {
        channel_id: 1,
        balance_A:
          user.id == 0
            ? ethers.utils.parseEther(closeAmount)
            : ethers.utils.parseEther(
                (channelBalance - parseFloat(closeAmount)).toString()
              ),
        balance_B:
          user.id == 1
            ? ethers.utils.parseEther(closeAmount)
            : ethers.utils.parseEther(
                (channelBalance - parseFloat(closeAmount)).toString()
              ),
        version_num: 1,
        finalized: true,
      };
      contract[user.id + 1].close(Channel_State);
    } catch (error) {
      onError();
      console.log(error);
    }
  };

  const onError = () => {
    const errorMsg = document.getElementById("errorMsg" + user.id);
    animate(errorMsg, { opacity: 1, display: "flex" }, { duration: 1 });
    setTimeout(async () => {
      await animate(errorMsg, { opacity: 0 }, { duration: 1 });
      animate(errorMsg, { display: "none" }, { duration: 0 });
    }, 3000);
  };

  switch (state) {
    case 0:
      return <>Press a function!</>;
    case 1:
      return (
        <>
          <select className={style.select}>
            {filterdUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button className={strucStyle.button} onClick={() => openChan()}>
            Open
          </button>
        </>
      );
    case 2:
      return <>Press a function!</>;
    case 3:
      return (
        <>
          <div id={"errorMsg" + user.id} className={style.error}>
            {error}
          </div>
          <input
            placeholder="Amount"
            className={strucStyle.input}
            type="number"
            onChange={(e) => setFundAmount(e.target.value)}
          />
          <button className={strucStyle.button} onClick={() => fundChan()}>
            Fund
          </button>
        </>
      );
    case 4:
      return <>Press a function!</>;
    case 5:
      return (
        <>
          <div id={"errorMsg" + user.id} className={style.error}>
            {error}
          </div>
          <input
            placeholder="Amount"
            className={strucStyle.input}
            type="number"
            onChange={(e) => setCloseAmount(e.target.value)}
          />
          <button className={strucStyle.button} onClick={() => closeChan()}>
            Close
          </button>
        </>
      );
    case 6:
      return <>Press a function!</>;
    case 7:
      return (
        <>
          <button className={strucStyle.button} onClick={() => withdrawChan()}>
            Withdraw
          </button>
        </>
      );
    case 8:
      return <>Transaction done!</>;
    default:
      return <>error</>;
  }
}
