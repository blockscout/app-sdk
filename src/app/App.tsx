import { Toaster } from "package/components/toast/Toast";
import { useTxToast } from "package/components/tx-toast/useTxToast";
import Link from "package/components/link/Link";
import "package/index.css";
import Age from "package/components/age/Age";
import Address from "package/components/address/Address";
import Token from "package/components/token/Token";

export function App() {
  const txToast = useTxToast();
  return (
    <>
      <button
        onClick={() =>
          txToast.open(
            "0x5e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b593",
          )
        }
      >
        Show toast
      </button>
      <Link href="https://eth.blockscout.com">Link</Link>
      <Address hash="0xa8FCe579a11E551635b9c9CB915BEcd873C51254" />
      <Token
        hash="0xa8FCe579a11E551635b9c9CB915BEcd873C51254"
        symbol="USDT"
        icon="https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661"
      />
      <Age timestamp={Date.now() - 1000 * 60 * 60 * 24 * 30} />
      <Toaster />
    </>
  );
}
