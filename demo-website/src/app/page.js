"use client";
import styled from 'styled-components';
import Box from './components/Box';

const Container = styled.div`
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

const BoxesContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HomePage = () => (
  <Container>
    <Title>Choose your fighter</Title>
    <BoxesContainer>
      <Box text="Open a channel" link="/channels" emoji="⏰" />
      <Box text="Get a flashloan" link="/flashloan" emoji="💰" />
    </BoxesContainer>
  </Container>
);

export default HomePage;