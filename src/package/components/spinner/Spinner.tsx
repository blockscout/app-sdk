import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerRoot = styled.div<{ size?: number }>`
  --spinner-track-color: rgba(51, 54, 52, 0.1);
  --spinner-border-color: #596699;
  --spinner-size: ${({ size }) => size || 32}px;

  display: inline-block;
  box-sizing: border-box;
  border-color: var(--spinner-border-color);
  border-style: solid;
  border-width: 2px;
  border-radius: 100%;
  width: var(--spinner-size);
  height: var(--spinner-size);
  animation: ${spin} 1s linear infinite;
  border-bottom-color: var(--spinner-track-color);
  border-inline-start-color: var(--spinner-track-color);
`;

interface SpinnerProps {
  size?: number;
}

const Spinner = ({ size }: SpinnerProps) => {
  return <SpinnerRoot size={size} />;
};

export default Spinner;
