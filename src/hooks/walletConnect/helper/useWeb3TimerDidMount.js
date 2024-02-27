import React from "react";
import useDidMount from "./useDidMount";
import useTimeout from "./useTimeout";
import DannyWalletConnector from "../../web3/wallet/DannyWalletConnector";

export default function useWeb3TimerDidMount(
  callback,
  dependencies = [],
  isWalletCheck = true
) {
  const didMount = useDidMount();
  const { address, isWalletConnected } = DannyWalletConnector.useContainer();
  const walletDependencies = isWalletCheck ? [isWalletConnected] : [];

  useTimeout(
    () => {
      if (!didMount) return;
      if (isWalletCheck && !isWalletConnected) return;
      if (typeof callback === "function") callback();
    },
    500,
    [didMount, address, ...dependencies, ...walletDependencies]
  );
}
