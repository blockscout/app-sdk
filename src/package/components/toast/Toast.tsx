import React from "react";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import IconClose from "package/assets/icons/close.svg";
import IconSuccess from "package/assets/icons/status_success.svg";
import IconError from "package/assets/icons/status_error.svg";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ToastWrapper = styled.div<{ show: boolean }>`
  width: 368px;
  max-width: 368px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  opacity: 1;
  will-change: transform, opacity;
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: translateY(${({ show }) => (show ? 0 : "20px")});
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;

  @media (max-width: 600px) {
    width: calc(100vw - 16px);
    max-width: calc(100vw - 16px);
    box-sizing: border-box;
    min-width: 0;
    padding: 12px 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 0 8px;
  }
`;

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const ToastTitle = styled.h3<{ status: "success" | "error" | "pending" }>`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  padding-right: 24px;
  color: ${({ status }) =>
    status === "success"
      ? "#388744"
      : status === "error"
        ? "#bd4d45"
        : "#141715"};

  @media (max-width: 600px) {
    font-size: 15px;
    padding-right: 16px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(51, 54, 52, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 16px;
  right: 12px;
  z-index: 1;
  padding: 0;

  &:hover {
    color: #1a1a1a;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 600px) {
    top: 10px;
    right: 8px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ToastContent = styled.div`
  color: #4a4a4a;
  font-size: 14px;
  line-height: 1.5;
  padding-left: 32px;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;

  @media (max-width: 600px) {
    font-size: 13px;
    padding-left: 24px;
  }
`;

const StatusIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatusSuccess = styled(StatusIcon)`
  svg {
    color: #388744;
  }
`;

const StatusError = styled(StatusIcon)`
  svg {
    color: #bd4d45;
  }
`;

const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #596699;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  display: inline-block;
  box-sizing: border-box;
`;

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
        <StatusSuccess>
          <IconSuccess />
        </StatusSuccess>
      );
    if (status === "error")
      return (
        <StatusError>
          <IconError />
        </StatusError>
      );
    if (status === "pending") return <Spinner />;
    return null;
  };

  return (
    <ToastWrapper show={show} data-toast-id={id}>
      <ToastHeader>
        {renderStatusIcon()}
        <ToastTitle status={status}>{title}</ToastTitle>
        <CloseButton onClick={handleClose} aria-label="Close toast">
          <IconClose />
        </CloseButton>
      </ToastHeader>
      <ToastContent>{content}</ToastContent>
    </ToastWrapper>
  );
};

export default Toast;
