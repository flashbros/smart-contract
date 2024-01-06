// components/Box.js
import styled from 'styled-components';

const BoxContainer = styled.div`
  width: 250px; /* Increased width */
  height: 120px; /* Increased height */
  background-color: #3498db;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Roboto', sans-serif; /* Use your desired font */

  &:hover {
    background-color: #2980b9;
  }

  .emoji {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const Box = ({ text, link, emoji }) => (
  <a href={link}>
    <BoxContainer>
      <span role="img" aria-label="emoji" className="emoji">
        {emoji}
      </span>
      {text}
    </BoxContainer>
  </a>
);

export default Box;