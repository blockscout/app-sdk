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
    <a {...rest} className={classNames(style.root, className)}>
      {children}
      {!noIcon && <IconLinkExternal className={style.icon} />}
    </a>
  );
};

export default Link;
