// components/Box.js
import React from 'react';
import styled from 'styled-components';

const BoxContainer = styled.div`
  width: 300px;
  height: 150px;
  background-color: #3498db; /* Nice blueish color */
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Roboto', sans-serif;
  color: #fff; /* Text color */

  &:hover {
    background-color: #2c81ba; /* Darker blueish color on hover */
  }

  .emoji {
    font-size: 36px;
    margin-bottom: 12px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const Box = ({ text, link, emoji }) => (
  <a href={link}>
    <BoxContainer>
      <span role="img" aria-label="emoji" className="emoji">
        {emoji}
      </span>
      <div>{text}</div>
    </BoxContainer>
  </a>
);

export default Box;
