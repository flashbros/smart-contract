// components/FlashLoanRequest.js
import { useState } from 'react';
import styles from '../styles/styles.css';

const FlashLoanRequest = ({ contractBalance, onRequest, onTrade, isFlashLoanRequested }) => {
  const [amount, setAmount] = useState(0);
  const [latestTradeMessage, setLatestTradeMessage] = useState('');
  const [flashLoanError, setFlashLoanError] = useState('');

  const handleAmountChange = (e) => {
    if (!isFlashLoanRequested) {
      setAmount(e.target.value);
      setFlashLoanError(''); // Clear any previous error message when the amount changes
    }
  };

  const handleRequest = () => {
    if (parseInt(amount) > contractBalance) {
      setFlashLoanError('Flash loan request amount exceeds contract balance.');
      return;
    }

    onRequest(amount);
    setAmount(0); // Reset amount after requesting
    setFlashLoanError(''); // Clear any previous error message after successful request
  };

  const handleTrade = () => {
    if (isFlashLoanRequested) {
      // Randomly decide whether to add or subtract money from Balance of C
      const isAddition = Math.random() < 0.5;
      const randomAmount = Math.floor(Math.random() * 100) + 1; // Random amount between 1 and 100

      // Update balance based on trade
      onTrade(isAddition, randomAmount);

      // Update the latest trade message based on whether money is gained or lost
      const tradeMessage = isAddition
        ? <span style={{ color: 'green' }}>Gained ${randomAmount} money!</span>
        : <span style={{ color: 'red' }}>Lost ${randomAmount} money!</span>;

      setLatestTradeMessage(tradeMessage);
    }
  };

  return (
    <div className={`${styles.userContainer} ${styles.flashLoanContainer}`}>      
    <p>Contract Balance: {contractBalance}</p>
      {!isFlashLoanRequested && (
        <>
          <label>
            Amount:
            <input type="number" value={amount} onChange={handleAmountChange} />
          </label>
          <button onClick={handleRequest}>Request Flash Loan</button>
          {flashLoanError && <p style={{ color: 'red' }}>{flashLoanError}</p>}
        </>
      )}
      {isFlashLoanRequested && (
        <>
          <p>Flash Loan Requested!</p>
          <button onClick={handleTrade}>
            Trade
          </button>
          {latestTradeMessage && <p>{latestTradeMessage}</p>}
        </>
      )}
    </div>
  );
};

export default FlashLoanRequest;
