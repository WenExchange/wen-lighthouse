import React from "react";
import { useRecoilCallback, useRecoilTransaction_UNSTABLE } from "recoil";
import { layoutValueSelector } from "./selectors";

const useLayoutCallbacks = () => {
  const toggleNavigator = useRecoilCallback(
    ({ snapshot, set, transact_UNSTABLE }) =>
      () => {
        const isOpenNavigator = snapshot
          .getLoadable(layoutValueSelector({ key: "isOpenNavigator" }))
          .getValue();

        set(layoutValueSelector({ key: "isOpenNavigator" }), !isOpenNavigator);
      }
  );

  return { toggleNavigator };
};

export default useLayoutCallbacks;
