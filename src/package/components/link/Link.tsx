import React from "react";
import styled from "styled-components";

interface Props extends React.ComponentProps<"a"> {
  className?: string;
}

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  color: #596699;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    .icon {
      color: #596699;
    }
  }
`;

const Link = (props: Props) => {
  const { children, className, ...rest } = props;
  return (
    <StyledLink
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </StyledLink>
  );
};

export default Link;
