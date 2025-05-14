import style from "./Age.module.css";
import dayjs from "package/lib/dayjs";
import Tooltip from "package/components/tooltip/Tooltip";
import useTimeAgoIncrement from "./useTimeAgoIncrement";

interface Props {
  timestamp: string;
}

const Age = ({ timestamp }: Props) => {
  const date = dayjs(timestamp);
  const age = useTimeAgoIncrement(timestamp);
  return (
    <Tooltip content={date.format("llll")}>
      <span className={style.root}>{age}</span>
    </Tooltip>
  );
};

export default Age;
