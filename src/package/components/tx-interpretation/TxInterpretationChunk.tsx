import { AddressParam } from "package/api/types/address";
import { NonStringTxInterpretationVariable } from "./types";
import Address from "../address/Address";
import style from "./TxInterpretationChunk.module.css";
import Token from "../token/Token";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import Badge from "../badge/Badge";
import Link from "../link/Link";
interface Props {
  variable: NonStringTxInterpretationVariable;
  addressDataMap?: Record<string, AddressParam>;
  explorerUrl: string;
}

const TxInterpretationChunk = ({
  variable,
  addressDataMap,
  explorerUrl,
}: Props) => {
  if (!variable) {
    return null;
  }

  const { type, value } = variable;
  switch (type) {
    case "address": {
      return (
        <span className={style.entityContainer}>
          <Address
            hash={(addressDataMap?.[value.hash] || value).hash}
            explorerUrl={explorerUrl}
            // FIXME: add support of address names and alt hashes
            // address={addressDataMap?.[value.hash] || value}
          />
        </span>
      );
    }
    case "token":
      return (
        <span className={style.entityContainer}>
          <Token
            hash={value.address_hash}
            symbol={value.symbol || ""}
            icon={value.icon_url}
            explorerUrl={explorerUrl}
          />
        </span>
      );
    case "domain": {
      return (
        <span className={style.entityContainer} style={{ fontWeight: 600 }}>
          {value + " "}
        </span>
      );
    }
    case "currency": {
      let numberString = "";
      if (BigNumber(value).isLessThan(0.1)) {
        numberString = BigNumber(value).toPrecision(2);
      } else if (BigNumber(value).isLessThan(10000)) {
        numberString = BigNumber(value).dp(2).toFormat();
      } else if (BigNumber(value).isLessThan(1000000)) {
        numberString = BigNumber(value).dividedBy(1000).toFormat(2) + "K";
      } else {
        numberString = BigNumber(value).dividedBy(1000000).toFormat(2) + "M";
      }
      return (
        <span className={style.entityContainer} style={{ fontWeight: 600 }}>
          {numberString}
        </span>
      );
    }
    case "timestamp": {
      return (
        <span className={style.entityContainer} style={{ fontWeight: 600 }}>
          {dayjs(Number(value) * 1000).format("MMM DD YYYY")}
        </span>
      );
    }
    case "external_link": {
      return (
        <a href={value.link} target="_blank" rel="noopener noreferrer">
          {value.name}
        </a>
      );
    }
    case "method": {
      return (
        <Badge
          colorPalette={value === "Multicall" ? "teal" : "gray"}
          truncated
          ml={1}
          mr={2}
          verticalAlign="text-top"
        >
          {value}
        </Badge>
      );
    }
    case "dexTag": {
      const icon = value.app_icon || value.icon;
      const name = (() => {
        if (value.url) {
          return <Link href={value.url}>{value.name}</Link>;
        }
        return value.name;
      })();

      return (
        <span className={style.entityContainer}>
          {icon && (
            <img
              style={{ width: "20px", height: "20px" }}
              src={icon}
              alt="Dapp icon"
            />
          )}
          {name}
        </span>
      );
    }
    default:
      return null;
  }
};

// ({ variable, addressDataMap }: Props) => {
//   const { type, value } = variable;
//   switch (type) {
//     case "address": {
//       return (
//         <span className={style.entityContainer}>
//           <Address
//             hash={(addressDataMap?.[value.hash] || value).hash}
//             // FIXME: add support of address names and alt hashes
//             // address={addressDataMap?.[value.hash] || value}
//           />
//         </span>
//       );
//     }
//     default:
//       return null;
//   }
// };

export default TxInterpretationChunk;
