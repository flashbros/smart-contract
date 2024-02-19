import strucStyle from "./../../styles.module.css";
import style from "./userPanel.module.css";
import { getSigner } from "../../../../../ethereum.js";
import { ethers } from "ethers";
const { useState } = require("react");

export default function ActionField({
  currentState,
  setState,
  user,
  users,
  contract,
}) {
  const filterdUsers = users.filter((u) => u.id !== user.id);

  const [fundAmount, setFundAmount] = useState(0);

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
        closed: false,
      };
      contract[0].open(Channel_Params, Channel_State);
    } catch (error) {
      console.log(error);
    }
  };

  const fundChan = async () => {
    try {
      contract[user.id + 1].fund(1, {
        value: ethers.utils.parseEther(fundAmount),
      });
    } catch (error) {
      console.log(error);
    }
  };


  switch (currentState[user.id]) {
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
      return <>2</>;
    case 3:
      return (
        <>
          <input
            placeholder="Enter amount"
            className={strucStyle.input}
            type="number"
            onChange={(e) => setFundAmount(e.target.value)}
          />
          <button
            className={strucStyle.button}
            onClick={() => fundChan()}
          >
            Fund
          </button>
        </>
      );
    case 4:
      return <>4</>;
    case 5:
      return <>5</>;
    default:
      return <>wrong state!</>;
  }
}
