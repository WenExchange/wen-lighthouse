import React from "react";
import DannyWalletConnector from "../../wallet/DannyWalletConnector";
import { ContractCallState } from "../../constants";
import useConstantProperties from "../helpers/useConstantProperties";
import TestCollection from "../../contracts/TestCollectionContract/TestCollection";

import useDannySnackbar from "../../../hooks/useDannySnackbar";
import { shortenPublicKey } from "../../utils/helpers";

import useDanyDidMount from "../../../hooks/helper/useDanyDidMount";
import WenExchange from "../../contracts/WenExchangeContract/WenExchange";
import useDannyTxSnackbar from "../../../hooks/useDannyTxSnackbar";

export default function useWCSetApprovalForAll() {
  const methodName = "Approve";
  const {
    showSuccess,
    showFail,
    showInfo,
    showWarning,
    showSigningSb,
    showConfirmingSb,
    showSuccessSb,
    showFailSb
  } = useDannyTxSnackbar(methodName);
  const { address, isWalletConnected, getSignerContract } =
    DannyWalletConnector.useContainer();

  /** Tx */
  const [receipt, setReceipt] = React.useState(null);
  const [txState, setTxState] = React.useState(ContractCallState.NEW);
  const { isCallSuccess, isCallError, isLoading } =
    useConstantProperties(txState);

  /** Cycles */

  useDanyDidMount(() => {
    if (!isCallError) return;
    showFailSb();
  }, [isCallError]);

  const fetchTx = async () => {
    if (!isWalletConnected) return;
    try {
      const contract = await getSignerContract(
        TestCollection.address,
        TestCollection.abi
      );

      showSigningSb();
      setTxState(ContractCallState.FETCHING);
      const transaction = await contract.setApprovalForAll(
        WenExchange.address,
        true,
        {
          from: address
        }
      );
      showConfirmingSb();
      const _receipt = await transaction.wait();
      setTxState(ContractCallState.SUCCESS);
      showSuccessSb(_receipt);

      setReceipt(_receipt);
      return _receipt;
    } catch (error) {
      setTxState(ContractCallState.ERROR);
      console.error(error.message);
      throw new Error(error);
    }
  };

  return {
    isCallSuccessWCSetApproveForAll: isCallSuccess,
    isLoadingWCSetApproveForAll: isLoading,

    /** Tx */
    fetchWCSetApproveForAll: fetchTx
  };
}

/** 
blockHash
: 
"0xa7f7d5a2c7696844ab2bad8306300a47b1e65840f3a3fab784e7b80ab8610beb"
blockNumber
: 
1779748
contractAddress
: 
null
cumulativeGasUsed
: 
1130228n
from
: 
"0xc138b0459DD44543f03C47F476F35c173a3F4071"
gasPrice
: 
1500001122n
gasUsed
: 
175471n
hash
: 
"0x5ef8715719a4863eaea79164b4a4290c86018e6893c099d64f4de23eacbe29c7"
index
: 
9
logsBloom
: 
"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000008000000000000000100040000000000000000000008000002020000000000000000000800000000000000000000000010000000000000000000000000200000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000"
provider
: 
BrowserProvider {#subs: Map(0), #plugins: Map(0), #pausedState: null, #destroyed: false, #networkPromise: Promise, …}
root
: 
undefined
status
: 
1
to
: 
"0x67CC1ae57E6167Fb27663F50Ce5FEb12F8dD5565"
type
: 
2
 */
