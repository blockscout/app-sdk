import { APP_CONFIG } from "package/config";
import Age from "../age/Age";
import Link from "../link/Link";
import style from "./TxToastFooter.module.css";

interface Props {
  timestamp: string | null;
  hash: string;
  explorerLogo?: string;
  cleanExplorerUrl: string;
}

const TxToastFooter = ({
  timestamp,
  hash,
  explorerLogo,
  cleanExplorerUrl,
}: Props) => {
  return (
    <div className={style.root}>
      <Link href={`${cleanExplorerUrl}${APP_CONFIG.URLS.TRANSACTION(hash)}`}>
        {explorerLogo && (
          <img
            src={explorerLogo}
            alt="Explorer logo"
            style={{ width: "20px", height: "20px", marginRight: "4px" }}
          />
        )}
        View on block explorer
      </Link>
      {timestamp && (
        <span className={style.timestamp}>
          <Age timestamp={timestamp} />
        </span>
      )}
    </div>
  );
};

export default TxToastFooter;
