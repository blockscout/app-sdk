import styled from "styled-components";
import { AddressParam } from "package/api/types/address";
import { NonStringTxInterpretationVariable } from "./types";
import Address from "../address/Address";
import Token from "../token/Token";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import Badge from "../badge/Badge";
import Link from "../link/Link";

const EntityContainer = styled.span`
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  gap: 4px;
  &:not(:last-child) {
    margin-right: 4px;
  }
`;

const BoldEntityContainer = styled(EntityContainer)`
  font-weight: 600;
`;

const DappIcon = styled.img`
  width: 20px;
  height: 20px;
`;

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
        <EntityContainer>
          <Address
            hash={(addressDataMap?.[value.hash] || value).hash}
            explorerUrl={explorerUrl}
            // FIXME: add support of address names and alt hashes
            // address={addressDataMap?.[value.hash] || value}
          />
        </EntityContainer>
      );
    }
    case "token":
      return (
        <EntityContainer>
          <Token
            hash={value.address_hash}
            symbol={value.symbol || ""}
            icon={value.icon_url}
            explorerUrl={explorerUrl}
          />
        </EntityContainer>
      );
    case "domain": {
      return <BoldEntityContainer>{value + " "}</BoldEntityContainer>;
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
      return <BoldEntityContainer>{numberString}</BoldEntityContainer>;
    }
    case "timestamp": {
      return (
        <BoldEntityContainer>
          {dayjs(Number(value) * 1000).format("MMM DD YYYY")}
        </BoldEntityContainer>
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
        <EntityContainer>
          {icon && <DappIcon src={icon} alt="Dapp icon" />}
          {name}
        </EntityContainer>
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
