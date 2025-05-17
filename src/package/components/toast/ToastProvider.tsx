import React, { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Toast from "./Toast";
import { ToastContext, ToastOptions } from "./ToastContext";

const ToastPortal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: auto;
`;

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
        <ToastPortal>
          <ToastContainer>
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
          </ToastContainer>
        </ToastPortal>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};
