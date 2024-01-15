'use client';
// pages/index.js
import { useState } from 'react';
import FlashLoanRequest from '../components/FlashLoanRequest';
import UserComponent from '../components/UserComponent';
import styles from '../styles/styles.css';

const HomePage = () => {
  const [contractBalance, setContractBalance] = useState(1000);
  const [balanceOfC, setBalanceOfC] = useState(0);
  const [flashLoanRequested, setFlashLoanRequested] = useState(false);

  const handleFlashLoanRequest = (amount) => {
    if (!flashLoanRequested && amount <= contractBalance) {
      setBalanceOfC(balanceOfC + parseInt(amount));
      setFlashLoanRequested(true);
    }
  };

  const handleTrade = (isAddition, randomAmount) => {
    // Update balance based on trade
    setBalanceOfC(isAddition ? balanceOfC + randomAmount : balanceOfC - randomAmount);
  };

  const handleFund = () => {
    // Your logic for the "Fund" button
  };

  const handleClose = () => {
    // Your logic for the "Close" button
  };

  const handleFinalize = () => {
    // Your logic for the "Finalize" button
  };

  return (
    <div>
      <h1>Flash Loan Concept</h1>
      <div className={styles.container}>
        <div className={styles.box}>
          <FlashLoanRequest
            contractBalance={contractBalance}
            onRequest={handleFlashLoanRequest}
            onTrade={handleTrade}
            isFlashLoanRequested={flashLoanRequested}
          />
        <p>Balance of C: {balanceOfC}</p>
        </div>
        <div className={`${styles.box} ${styles.userBox}`}>          
        <UserComponent user={{ name: 'User A', balance: 100 }} onFund={handleFund} onClose={handleClose} onFinalize={handleFinalize} />
          <UserComponent user={{ name: 'User B', balance: 100 }} onFund={handleFund} onClose={handleClose} onFinalize={handleFinalize} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
