import React from "react";
import styles from "./Badge.module.css";
import classNames from "classnames";

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
    <span
      className={classNames(
        styles.badge,
        styles[`color-${colorPalette}`],
        {
          [styles.truncated]: truncated,
        },
        className,
      )}
      style={{
        marginLeft: `${ml * 4}px`,
        marginRight: `${mr * 4}px`,
        verticalAlign,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
