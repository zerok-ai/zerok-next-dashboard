import TooltipX from "components/themeX/TooltipX";
import {
  getFormattedTime,
  getFormattedTimeFromEpoc,
  getRelativeTime,
  getRelativeTimeFromEpoc,
} from "utils/dateHelpers";

interface TableTimeCellProps {
  time: string | number;
  epoch?: boolean;
}

const TableTimeCell = ({ time, epoch = false }: TableTimeCellProps) => {
  const fullTime = epoch
    ? getFormattedTimeFromEpoc(time as number)
    : getFormattedTime(time as string);
  const displayTime = epoch
    ? getRelativeTimeFromEpoc(time as number)
    : getRelativeTime(time as string);
  return (
    <TooltipX title={fullTime as string}>
      <span>{displayTime}</span>
    </TooltipX>
  );
};

export default TableTimeCell;
