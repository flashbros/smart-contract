'use client'
// components/FlashLoanPage.js
import React, { useState } from 'react';
import styled from 'styled-components';

const FlashLoanContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa; /* Light gray background */
`;

const LeftSide = styled.div`
  flex: 1;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContractBalanceBox = styled.div`
  background-color: #dcdcdc; /* Light gray */
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 18px;
`;

const TopBox = styled.div`
  background-color: #007bff; /* Blue */
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const FlashLoanButton = styled.button`
  background-color: #007bff; /* Blue */
  color: #fff;
  padding: 12px; /* Slightly larger padding for better visibility */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
`;

const InputBox = styled.input`
  width: 200px;
  height: 30px;
  font-size: 16px;
  margin-bottom: 20px;
  padding: 5px;
`;

const BalanceBox = styled.div`
  background-color: #dcdcdc; /* Light gray */
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 18px;
`;

const BuyButton = styled.button`
  background-color: #28a745; /* Green */
  color: #fff;
  padding: 12px; /* Slightly larger padding for better visibility */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
`;

const UserBox = styled.div`
  background-color: #dcdcdc; /* Light gray */
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 18px;
`;

const UserButton = styled.button`
  background-color: #007bff; /* Blue */
  color: #fff;
  padding: 12px; /* Slightly larger padding for better visibility */
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
`;

const FlashLoanPage = () => {
  const [flashLoanAmount, setFlashLoanAmount] = useState('');
  const [buyResult, setBuyResult] = useState('');

  const handleFlashLoanRequest = () => {
    if (!flashLoanAmount) return;

    // Logic to handle flash loan request, for example, updating balance, adding transaction, etc.
    // For simplicity, let's assume the flash loan is successful if an amount is provided.
    setBuyResult('Flash loan request successful');
    setFlashLoanAmount('');
  };

  const handleBuy = () => {
    // Logic to handle the "BUY" button click, for example, randomly gaining or losing money.
    const randomResult = Math.random() > 0.5 ? 'You gained money!' : 'You lost money!';
    setBuyResult(randomResult);
  };

  const handleUserAction = (user, action) => {
    // Logic to handle user actions (fund, close, finalize) for User A and User B.
    // For simplicity, let's assume these actions are placeholders and don't affect the balance.
    console.log(`${user} ${action} clicked`);
  };

  return (
    <FlashLoanContainer>
      <LeftSide>
        <ContractBalanceBox>Contract Balance: $5000</ContractBalanceBox>
        <TopBox>
          <BalanceBox>Balance: $1000</BalanceBox>
          <InputBox
            type="number"
            value={flashLoanAmount}
            onChange={(e) => setFlashLoanAmount(e.target.value)}
            placeholder="Enter ETH amount"
          />
          <FlashLoanButton onClick={handleFlashLoanRequest}>
            {`Get Flash Loan with ${flashLoanAmount} ETH`}
          </FlashLoanButton>
          {buyResult && (
            <>
              <BuyButton onClick={handleBuy}>BUY</BuyButton>
              <div>{buyResult}</div>
            </>
          )}
        </TopBox>
      </LeftSide>
      <RightSide>
        <UserBox>
          <div>User A Balance: $500</div>
          <UserButton onClick={() => handleUserAction('User A', 'fund')}>Fund</UserButton>
          <UserButton onClick={() => handleUserAction('User A', 'close')}>Close</UserButton>
          <UserButton onClick={() => handleUserAction('User A', 'finalize')}>Finalize</UserButton>
        </UserBox>
        <UserBox>
          <div>User B Balance: $800</div>
          <UserButton onClick={() => handleUserAction('User B', 'fund')}>Fund</UserButton>
          <UserButton onClick={() => handleUserAction('User B', 'close')}>Close</UserButton>
          <UserButton onClick={() => handleUserAction('User B', 'finalize')}>Finalize</UserButton>
        </UserBox>
      </RightSide>
    </FlashLoanContainer>
  );
};

export default FlashLoanPage;
