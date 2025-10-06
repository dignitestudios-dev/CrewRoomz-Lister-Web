// useToast.ts
import { useState, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

export const useToast = (delay = 3000) => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (toast.visible) {
      timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [toast.visible, delay]);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, visible: true });
  };

  return { toast, showToast };
};
