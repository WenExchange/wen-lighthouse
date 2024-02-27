import React from "react";
import { ethers } from "ethers";
import TestCollectionContract from "../../../contracts/TestCollectionContract";
import { ContractCallState } from "../../../constants";
import useConstantProperties from "../../helpers/useConstantProperties";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import DannyWalletConnector from "../../../wallet/DannyWalletConnector";

dayjs.extend(duration);

export default function useTCOwnerOf(fromAddress) {
  const { ethersProvider } = DannyWalletConnector.useContainer();
  /** ownerAddress */
  const [ownerAddress, setOwnerAddress] = React.useState(null);
  const [ownerAddressState, setOwnerAddressState] = React.useState(
    ContractCallState.NEW
  );
  const { isCallSuccess, isCallError, isLoading } =
    useConstantProperties(ownerAddressState);

  const fetch = async ({ tokenId }) => {
    try {
      setOwnerAddressState(ContractCallState.FETCHING);
      let ownerAddress = await TestCollectionContract().ownerOf(tokenId, {
        from: fromAddress
      });

      setOwnerAddressState(ContractCallState.SUCCESS);
      setOwnerAddress(ownerAddress);
    } catch (error) {
      console.error(error.message);
      setOwnerAddressState(ContractCallState.ERROR);
      setOwnerAddress(null);
    }
  };

  return {
    ownerAddress,

    isLoadingOwnerAddress: isLoading,
    isCallSuccessOwnerAddress: isCallSuccess,

    fetchOwnerAddress: fetch
  };
}
