import React from "react";
import IconLinkExternal from "package/assets/icons/link_external.svg";
import style from "./Link.module.css";
import classNames from "classnames";

interface Props extends React.ComponentProps<"a"> {
  noIcon?: boolean;
  className?: string;
}

const Link = (props: Props) => {
  const { noIcon, children, className, ...rest } = props;
  return (
    <a
      className={classNames(style.root, className)}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
      {!noIcon && (
        <span className={style.icon}>
          <IconLinkExternal />
        </span>
      )}
    </a>
  );
};

export default Link;
