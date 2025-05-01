import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import localizedFormat from "dayjs/plugin/localizedFormat";

const relativeTimeConfig = {
  thresholds: [
    { l: "s", r: 1 },
    { l: "ss", r: 59, d: "second" },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 6, d: "day" },
    { l: "w", r: 1 },
    { l: "ww", r: 4, d: "week" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y", r: 17 },
    { l: "yy", d: "year" },
  ],
};

dayjs.extend(relativeTime, relativeTimeConfig);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);

dayjs.updateLocale("en", {
  formats: {
    llll: `MMM DD YYYY HH:mm:ss A (Z UTC)`,
  },
  relativeTime: {
    s: "1s",
    ss: "%ds",
    future: "in %s",
    past: "%s ago",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    w: "1w",
    ww: "%dw",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});

dayjs.locale("en");

export default dayjs;
