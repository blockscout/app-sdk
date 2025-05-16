import React from "react";
import { useEffect, useState } from "react";
import styles from "./Toast.module.css";
import IconClose from "package/assets/icons/close.svg";
import IconSuccess from "package/assets/icons/status_success.svg";
import IconError from "package/assets/icons/status_error.svg";

export type ToastOptions = {
  title: string;
  content: React.ReactNode;
  status: "success" | "error" | "pending";
  onClose?: () => void;
};

export type ToastInstance = {
  id: string;
  options: ToastOptions;
};

export type ToastProps = {
  id: string;
  title: string;
  content: React.ReactNode;
  status: "success" | "error" | "pending";
  onClose: (id: string) => void;
  onCloseCallback?: () => void;
};

const Toast = ({
  id,
  title,
  content,
  status,
  onClose,
  onCloseCallback,
}: ToastProps) => {
  const [show, setShow] = useState(false);

  // Handle animation
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    onCloseCallback?.();
    onClose(id);
  };

  const renderStatusIcon = () => {
    if (status === "success")
      return (
        <span className={`${styles.statusIcon} ${styles.statusSuccess}`}>
          <IconSuccess />
        </span>
      );
    if (status === "error")
      return (
        <span className={`${styles.statusIcon} ${styles.statusError}`}>
          <IconError />
        </span>
      );
    if (status === "pending") return <span className={styles.spinner} />;
    return null;
  };

  return (
    <div
      className={`${styles.toast} ${styles[status]} ${show ? styles.toastEntering : ""}`}
      data-toast-id={id}
    >
      <div className={styles.toastHeader}>
        {renderStatusIcon()}
        <h3 className={`${styles.toastTitle} ${styles[status]}`}>{title}</h3>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close toast"
        >
          <IconClose />
        </button>
      </div>
      <div className={styles.toastContent}>{content}</div>
    </div>
  );
};

export default Toast;
