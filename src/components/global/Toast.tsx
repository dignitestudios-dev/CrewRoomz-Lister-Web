// Toast.tsx
import React from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, visible }) => {
  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-5 right-5 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-500 ${bgColor} ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
