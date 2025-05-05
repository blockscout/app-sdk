import { AddressParam } from "package/api/types/address";
import { NonStringTxInterpretationVariable } from "./types";
import Address from "../address/Address";
import style from "./TxInterpretationChunk.module.css";

interface Props {
  variable: NonStringTxInterpretationVariable;
  addressDataMap?: Record<string, AddressParam>;
}

const TxInterpretationChunk = ({ variable, addressDataMap }: Props) => {
  const { type, value } = variable;
  switch (type) {
    case "address": {
      return (
        <span className={style.entityContainer}>
          <Address
            hash={(addressDataMap?.[value.hash] || value).hash}
            // FIXME: add support of address names and alt hashes
            // address={addressDataMap?.[value.hash] || value}
          />
        </span>
      );
    }
    default:
      return null;
  }
};

export default TxInterpretationChunk;
