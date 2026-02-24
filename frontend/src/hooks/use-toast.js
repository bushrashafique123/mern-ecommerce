import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ variant = "default", title, description, action }) => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now(), variant, title, description, action },
    ]);
  };

  return { toast, toasts };
}
