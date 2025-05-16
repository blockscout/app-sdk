import React, { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import "./Toast.module.css";
import styles from "./Toast.module.css";
import Toast from "./Toast";
import { ToastContext, ToastOptions } from "./ToastContext";

export type ToastInstance = {
  id: string;
  options: ToastOptions;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  console.log("toasts", toasts);

  const open = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, options }]);
    return id;
  }, []);

  const close = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.options.onClose) {
        toast.options.onClose();
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const update = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, options: { ...t.options, ...options } } : t,
      ),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ open, close, update }}>
      {children}
      {createPortal(
        <div className={styles.toastPortal}>
          <div className={styles.toastContainer}>
            {toasts.map((t) => (
              <Toast
                key={t.id}
                id={t.id}
                title={t.options.title}
                content={t.options.content}
                status={t.options.status}
                onClose={close}
                onCloseCallback={t.options.onClose}
              />
            ))}
          </div>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};
