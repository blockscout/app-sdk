declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  import * as React from "react";
  interface SVGProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number;
    height?: number;
  }
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
