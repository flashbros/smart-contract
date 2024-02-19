import style from "./userPanel.module.css";

export default function SelectField({ ownId, users }) {
  console.log(ownId);

  const filteredUsers = users.filter((user) => user.id !== ownId);
  return (
    <div className={style.selectField}>
      <div className={style.selectTitle}>Users</div>
      {filteredUsers.map((user) => (
        <div key={user.id} value={user.id} className={style.selectEntry}>
          {user.name}
        </div>
      ))}
    </div>
  );
}
