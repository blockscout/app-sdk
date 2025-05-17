import styled from "styled-components";
import dayjs from "package/lib/dayjs";
import Tooltip from "package/components/tooltip/Tooltip";
import useTimeAgoIncrement from "./useTimeAgoIncrement";

const StyledSpan = styled.span`
  color: rgba(52, 63, 57, 0.36);
`;

interface Props {
  timestamp: string;
}

const Age = ({ timestamp }: Props) => {
  const date = dayjs(timestamp);
  const age = useTimeAgoIncrement(timestamp);
  return (
    <Tooltip content={date.format("llll")}>
      <StyledSpan>{age}</StyledSpan>
    </Tooltip>
  );
};

export default Age;
