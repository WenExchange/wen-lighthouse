import useSendTransaction from "./useSendTransaction";

export default function useTransaction(
  contract,
  methodName,
  onSuccess = () => {}
) {
  /** Transaction */
  const { state, txHash, txReceipt, isLoading, sendTransaction } =
    useSendTransaction(methodName, contract);

  const fetchTransaction = async (...args) => {
    try {
      const txData = {
        to: contract.address,
        data: contract.interface.encodeFunctionData(methodName, args)
      };

      await sendTransaction(txData, onSuccess);
    } catch (trxError) {
      throw trxError;
    }
  };

  return {
    state,
    txHash,
    txReceipt,
    isLoading,
    fetchTransaction
  };
}
