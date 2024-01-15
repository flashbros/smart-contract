// components/UserComponent.js
const UserComponent = ({ user, onFund, onClose, onFinalize }) => {
    return (
      <div>
        <p>User: {user.name}</p>
        <p>Balance: {user.balance}</p>
        <button onClick={() => onFund()}>Fund</button>
        <button onClick={() => onClose()}>Close</button>
        <button onClick={() => onFinalize()}>Finalize</button>
      </div>
    );
  };
  
  export default UserComponent;
  