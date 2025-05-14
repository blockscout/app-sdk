import { APP_CONFIG } from "package/config";
import Link from "../link/Link";
import styles from "./Token.module.css";
import TokenIcon from "./TokenIcon";

interface Props {
  hash: string;
  symbol: string;
  icon?: string | null;
  explorerUrl: string;
}

const Token = ({ hash, symbol, icon, explorerUrl }: Props) => {
  return (
    <Link
      className={styles.root}
      href={`${explorerUrl}${APP_CONFIG.URLS.TOKEN(hash)}`}
    >
      <TokenIcon src={icon || undefined} />
      <span className={styles.symbol}>{symbol}</span>
    </Link>
  );
};

export default Token;
