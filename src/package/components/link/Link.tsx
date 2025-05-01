import React from "react";
import IconLinkExternal from "package/assets/icons/link_external.svg";
import style from "./Link.module.css";

interface Props extends React.ComponentProps<"a"> {
  external?: boolean;
}

const Link = (props: Props) => {
  const { external, children, ...rest } = props;
  return (
    <a {...rest} className={style.root}>
      {children}
      {external && <IconLinkExternal className={style.icon} />}
    </a>
  );
};

export default Link;
