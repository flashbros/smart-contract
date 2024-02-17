import strucStyle from "./../../styles.module.css";
import style from "./userPanel.module.css";
import { getSigner } from "../../../../../ethereum.js";

export default function ActionField({
  state,
  setState,
  user,
  users,
  contract,
}) {
  const filterdUsers = users.filter((u) => u.id !== user.id);

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
      console.log(contract);
      contract.open(Channel_Params, Channel_State);
    } catch (error) {
      console.log(error);
    }
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
      return <>2</>;
    case 3:
      return (
        <>
          <input
            type="text"
            placeholder="Enter amount"
            className={strucStyle.input}
          />
          <button className={strucStyle.button} onClick={() => setState(4)}>
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
