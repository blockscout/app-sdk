import style from "./Age.module.css";
import dayjs from "package/lib/dayjs";
import Tooltip from "package/components/tooltip/Tooltip";

interface Props {
  timestamp: number;
}

const Age = ({ timestamp }: Props) => {
  const date = dayjs(timestamp);
  const age = date.fromNow();
  return (
    <Tooltip content={date.format("llll")}>
      <span className={style.root}>{age}</span>
    </Tooltip>
  );
};

export default Age;
