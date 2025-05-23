import IconSuccess from "package/assets/icons/success.svg";
import IconError from "package/assets/icons/status_error.svg";
import Spinner from "../spinner/Spinner";

interface StatusIconProps {
  status: "pending" | "success" | "error";
  size?: number;
}

const StatusIcon = ({ status, size = 20 }: StatusIconProps) => {
  if (status === "pending") {
    return <Spinner size={size} />;
  }

  if (status === "error") {
    // @ts-expect-error SVG component props not properly typed
    return <IconError width={size} height={size} />;
  }

  // @ts-expect-error SVG component props not properly typed
  return <IconSuccess width={size} height={size} />;
};

export default StatusIcon;
