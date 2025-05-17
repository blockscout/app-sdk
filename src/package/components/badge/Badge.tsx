import React from "react";
import styled, { css } from "styled-components";

interface BadgeProps {
  children: React.ReactNode;
  colorPalette?:
    | "gray"
    | "teal"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "purple"
    | "orange";
  truncated?: boolean;
  ml?: number;
  mr?: number;
  verticalAlign?: "text-top" | "middle" | "text-bottom";
  className?: string;
}

const colorPalettes = {
  gray: css`
    background-color: #e2e8f0;
    color: #4a5568;
  `,
  teal: css`
    background-color: #b2f5ea;
    color: #285e61;
  `,
  blue: css`
    background-color: #bee3f8;
    color: #2c5282;
  `,
  red: css`
    background-color: #fed7d7;
    color: #c53030;
  `,
  green: css`
    background-color: #c6f6d5;
    color: #276749;
  `,
  yellow: css`
    background-color: #fefcbf;
    color: #975a16;
  `,
  purple: css`
    background-color: #e9d8fd;
    color: #553c9a;
  `,
  orange: css`
    background-color: #feebc8;
    color: #c05621;
  `,
};

const StyledBadge = styled.span<{
  $colorPalette: keyof typeof colorPalettes;
  $truncated?: boolean;
  $ml?: number;
  $mr?: number;
  $verticalAlign?: "text-top" | "middle" | "text-bottom";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  height: 20px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  border-radius: 4px;
  white-space: nowrap;
  margin-left: ${({ $ml = 0 }) => `${$ml * 4}px`};
  margin-right: ${({ $mr = 0 }) => `${$mr * 4}px`};
  vertical-align: ${({ $verticalAlign }) => $verticalAlign};

  ${({ $truncated }) =>
    $truncated &&
    css`
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    `}

  ${({ $colorPalette }) => colorPalettes[$colorPalette]}
`;

const Badge: React.FC<BadgeProps> = ({
  children,
  colorPalette = "gray",
  truncated = false,
  ml = 0,
  mr = 0,
  verticalAlign = "middle",
  className,
}) => {
  return (
    <StyledBadge
      $colorPalette={colorPalette}
      $truncated={truncated}
      $ml={ml}
      $mr={mr}
      $verticalAlign={verticalAlign}
      className={className}
    >
      {children}
    </StyledBadge>
  );
};

export default Badge;
