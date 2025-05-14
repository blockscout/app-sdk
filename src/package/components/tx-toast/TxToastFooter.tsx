import Age from "../age/Age";
import Link from "../link/Link";
import style from "./TxToastFooter.module.css";

interface Props {
  timestamp: number;
  hash: string;
}

const TxToastFooter = ({ timestamp, hash }: Props) => {
  return (
    <div className={style.root}>
      <Link
        className={style.link}
        href={`https://eth.blockscout.com/tx/${hash}`}
      >
        View on block explorer
      </Link>
      <span className={style.timestamp}>
        <Age timestamp={timestamp} />
      </span>
    </div>
  );
};

export default TxToastFooter;
