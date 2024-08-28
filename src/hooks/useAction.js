import { useCallback, useState } from "react";

export const useAction = (action, options = {}) => {
  const [fieldErrors, setFieldErrors] = useState(null);

  const result = useCallback(
    async (input) => {
      try {
        const res = await action(input);

        if (!res) return;

        setFieldErrors(res.fieldErrors);
        if (res.error) {
          options.onError?.(res.error);
        }
        if (res.data) {
          options.onSuccess?.(res.data);
        }
      } finally {
        options.onComplete?.();
      }
    },
    [action, options]
  );

  return {
    result,
    fieldErrors,
  };
};
