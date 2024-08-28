const { useEffect } = require("react");

const useEventListener = (eventName, handler) => {
  useEffect(() => {
    const eventListener = (e) => handler(e);

    document.addEventListener(eventName, eventListener);

    return () => {
      document.removeEventListener(eventName, eventListener);
    };
  }, [eventName, handler]);
};

export default useEventListener;
