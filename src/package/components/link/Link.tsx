import React from "react";
import style from "./Link.module.css";
import classNames from "classnames";

interface Props extends React.ComponentProps<"a"> {
  className?: string;
}

const Link = (props: Props) => {
  const { children, className, ...rest } = props;
  return (
    <a
      className={classNames(style.root, className)}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
