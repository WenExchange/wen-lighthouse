import React from "react";
import useDidMount from "./useDidMount";

export default function useDanyDidMount(callback, dependencies = []) {
  const didMount = useDidMount();
  React.useEffect(() => {
    if (!didMount) return;
    if (typeof callback === "function") callback();
  }, [didMount, ...dependencies]);

  return didMount;
}
