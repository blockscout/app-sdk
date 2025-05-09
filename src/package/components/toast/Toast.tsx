import {
  Toast as ArkToast,
  Toaster as ArkToaster,
  createToaster,
} from "@ark-ui/react/toast";
import styles from "./Toast.module.css";

import IconClose from "package/assets/icons/close.svg";
import IconStatusSuccess from "package/assets/icons/status_success.svg";
import IconStatusError from "package/assets/icons/status_error.svg";
import Spinner from "package/components/spinner/Spinner";

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  duration: 10_000,
  offsets: "12px",
});

export const Toaster = () => {
  return (
    <ArkToaster toaster={toaster}>
      {(toast) => {
        const indicator = (() => {
          switch (toast.type) {
            case "success":
              return <IconStatusSuccess />;
            case "error":
              return <IconStatusError />;
            case "loading":
              return <Spinner />;
          }
        })();

        return (
          <ArkToast.Root key={toast.id} className={styles.root}>
            {indicator && (
              <div data-scope="toast" data-part="indicator">
                {indicator}
              </div>
            )}
            <div data-scope="toast" data-part="container">
              <div data-scope="toast" data-part="body">
                <div data-scope="toast" data-part="content">
                  <ArkToast.Title>{toast.title}</ArkToast.Title>
                  <ArkToast.Description>
                    {toast.description}
                  </ArkToast.Description>
                </div>
                <ArkToast.CloseTrigger>
                  <IconClose />
                </ArkToast.CloseTrigger>
              </div>
              {toast.meta?.footer && (
                <div data-scope="toast" data-part="footer">
                  {toast.meta?.footer}
                </div>
              )}
            </div>
          </ArkToast.Root>
        );
      }}
    </ArkToaster>
  );
};
