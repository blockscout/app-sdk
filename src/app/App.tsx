import { Toaster, toaster } from "package/components/toast/Toast";
import "package/index.css";

export function App() {
  return (
    <>
      <button
        onClick={() =>
          toaster.success({
            title: "Transaction is complete",
            description: "This is a toast",
            duration: Infinity,
            meta: {
              footer: <a href="#">Footer link</a>,
            },
          })
        }
      >
        Click me
      </button>
      <Toaster />
    </>
  );
}
