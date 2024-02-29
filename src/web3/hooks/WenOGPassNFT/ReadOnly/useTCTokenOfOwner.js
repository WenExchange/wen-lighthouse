import React from "react";
import { ethers } from "ethers";
import TestCollectionContract from "../../../contracts/TestCollectionContract";
import { ContractCallState } from "../../../constants";
import useConstantProperties from "../../helpers/useConstantProperties";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BN, isBNPositive } from "../../../utils/DanyBN";
import DannyWalletConnector from "../../../wallet/DannyWalletConnector";
import { useRecoilState } from "recoil";
import { userTokenIdsState } from "../../../../recoil/collection/atoms";

dayjs.extend(duration);

export default function useTCTokenOfOwner() {
  const { ethersProvider, address } = DannyWalletConnector.useContainer();

  /** tokenIds */
  const [tokenIds, setTokenIds] = useRecoilState(userTokenIdsState);
  const [tokenIdsState, setTokenIdsState] = React.useState(
    ContractCallState.NEW
  );
  const { isCallSuccess, isCallError, isLoading } =
    useConstantProperties(tokenIdsState);

  const fetch = async (nftBalance, ownerAddress) => {
    try {
      const promises = [...Array(Number(nftBalance)).keys()].map((value) => {
        return TestCollectionContract(ethersProvider)
          .tokenOfOwnerByIndex(ownerAddress, value, {
            from: address
          })
          .then((id) => {
            return ethers.formatUnits(id, "wei");
          });
      });
      setTokenIdsState(ContractCallState.FETCHING);

      let _tokenIds = await Promise.all(promises);

      setTokenIdsState(ContractCallState.SUCCESS);
      setTokenIds(_tokenIds);
      return _tokenIds;
    } catch (error) {
      console.error(error.message);
      setTokenIdsState(ContractCallState.ERROR);
      setTokenIds([]);
    }
  };

  return {
    tokenIds,
    isLoadingTokenIds: isLoading,
    isCallSuccessTokenIds: isCallSuccess,

    fetchTokenIds: fetch
  };
}
