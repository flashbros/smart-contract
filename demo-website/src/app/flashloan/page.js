"use client"
// components/EthRequestPage.js
import React, { useState } from 'react';
import styled from 'styled-components';

const EthRequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 32px;
  margin-bottom: 20px;
`;

const InputBox = styled.input`
  width: 200px;
  height: 30px;
  font-size: 16px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin-bottom: 20px;
`;

const ResultMessage = styled.div`
  font-size: 18px;
  margin-top: 20px;
  color: ${({ positive }) => (positive ? '#27ae60' : '#e74c3c')};
  text-align: center;
`;

const EthRequestPage = () => {
  const [ethAmount, setEthAmount] = useState('');
  const [grantStatus, setGrantStatus] = useState(null);

  const handleInputChange = (e) => {
    setEthAmount(e.target.value);
    setGrantStatus(null);
  };

  const handleGrantRequest = () => {
    const isGranted = parseFloat(ethAmount) < 10;
    setGrantStatus(isGranted);
  };

  return (
    <EthRequestContainer>
      <Title>How much ETH do you need?</Title>
      <InputBox
        type="number"
        value={ethAmount}
        onChange={handleInputChange}
        placeholder="Enter ETH amount"
      />
      <Button onClick={handleGrantRequest}>Request ETH</Button>
      {grantStatus !== null && (
        <ResultMessage positive={grantStatus}>
          {grantStatus ? 'Granted, have fun with the money!' : 'Denied, not enough money in contract'}
        </ResultMessage>
      )}
    </EthRequestContainer>
  );
};

export default EthRequestPage;
