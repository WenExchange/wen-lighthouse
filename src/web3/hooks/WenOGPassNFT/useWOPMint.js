import React from "react";
import DannyWalletConnector from "../../wallet/DannyWalletConnector";
import { ContractCallState } from "../../constants";
import useConstantProperties from "../helpers/useConstantProperties";
import WenOGPassNFT from "../../contracts/WenOGPassNFTContract/WenOGPassNFT";

import useDanyDidMount from "../../../hooks/helper/useDanyDidMount";
import useDannyTxSnackbar from "../../../hooks/useDannyTxSnackbar";

export default function useWOPMint() {
  const { address, isWalletConnected, isValidChain, getSignerContract } =
    DannyWalletConnector.useContainer();

  const methodName = "Mint";
  const {
    showSuccess,
    showFail,
    showInfo,
    showWarning,
    showSigningSb,
    showConfirmingSb,
    showSuccessSb,
    showFailSb,
    showInvaliNetworkSb
  } = useDannyTxSnackbar(methodName);

  /** Tx */
  const [receipt, setReceipt] = React.useState(null);
  const [txState, setTxState] = React.useState(ContractCallState.NEW);
  const { isCallSuccess, isCallError, isLoading } =
    useConstantProperties(txState);

  /** Cycles */

  useDanyDidMount(() => {
    if (!isCallError) return;
    // showWarning("You can mint 1 NFT per address");
  }, [isCallError]);

  const fetchTx = async (proof) => {
    console.log(444, "proof", proof);
    if (!isWalletConnected) return;
    if (!isValidChain) {
      showInvaliNetworkSb();
      return;
    }
    try {
      const contract = await getSignerContract(
        WenOGPassNFT.address,
        WenOGPassNFT.abi
      );

      showSigningSb();
      setTxState(ContractCallState.FETCHING);
      const transaction = await contract.mint(proof, {
        from: address
      });
      showConfirmingSb();
      const _receipt = await transaction.wait();
      setTxState(ContractCallState.SUCCESS);
      showSuccessSb(_receipt);
      setReceipt(_receipt);
      return _receipt;
    } catch (error) {
      setTxState(ContractCallState.ERROR);
      console.error(error.message);
    }
  };

  return {
    isCallSuccessWOPMint: isCallSuccess,
    isLoadingWOPMint: isLoading,

    /** Tx */
    fetchWOPMint: fetchTx
  };
}
