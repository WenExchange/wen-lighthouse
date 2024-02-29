import React from "react";
import { ethers } from "ethers";
import WenOGPassNFTContract from "../../../contracts/WenOGPassNFTContract";
import { ContractCallState } from "../../../constants";
import useConstantProperties from "../../helpers/useConstantProperties";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import DannyWalletConnector from "../../../wallet/DannyWalletConnector";
import config from "../../../../config.json";

dayjs.extend(duration);

export default function useWOPCollectionData() {
  const { ethersProvider, address } = DannyWalletConnector.useContainer();
  /** collectionData */
  const [collectionData, setCollectionData] = React.useState(null);
  const [collectionDataState, setCollectionDataState] = React.useState(
    ContractCallState.NEW
  );
  const { isCallSuccess, isCallError, isLoading } =
    useConstantProperties(collectionDataState);

  const fetch = async () => {
    try {
      const contract = WenOGPassNFTContract();
      setCollectionDataState(ContractCallState.FETCHING);
      console.log(333, "config", config);

      // const mint_groups = [
      //   // {
      //   //   name: "Team",
      //   //   start_time: "1709153188",
      //   //   end_time: "1709160388",
      //   //   max_tokens: 10,
      //   //   unit_price: "0",
      //   //   market_root: []
      //   // },
      //   {
      //     name: "Main Mint WL",
      //     start_time: "1709153188",
      //     end_time: "1709160388",
      //     max_tokens: 1,
      //     unit_price: "0",
      //     market_root: []
      //   },
      //   {
      //     name: "Main Mint Public",
      //     start_time: "1709160391",
      //     end_time: "1709160392",
      //     max_tokens: 1,
      //     unit_price: "0",
      //     market_root: []
      //   }
      // ];
      const phases = config.groups.map((group) => {
        return {
          ...group,
          allowlist: group.allowlist.map((address) => address.toLowerCase()),
          noend: false
        };
      });

      console.log(333, "config", config);

      let mintedSupply = await contract.getTokenCounter({
        from: address
      });

      const collectionData = {
        ...config,
        phases,
        mintedSupply: Number(mintedSupply)
      };

      console.log(333, "collectionData", collectionData);

      setCollectionDataState(ContractCallState.SUCCESS);
      setCollectionData(collectionData);

      return collectionData;
    } catch (error) {
      console.error(error.message);
      setCollectionDataState(ContractCallState.ERROR);
      setCollectionData(null);
    }
  };

  return {
    collectionData,

    isLoadingCollectionData: isLoading,
    isCallSuccessCollectionData: isCallSuccess,

    fetchCollectionData: fetch
  };
}
