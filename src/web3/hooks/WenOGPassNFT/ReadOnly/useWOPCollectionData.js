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
      console.log(444, "contract", contract);
      setCollectionDataState(ContractCallState.FETCHING);

      const admin = "0xc138b0459DD44543f03C47F476F35c173a3F4071";
      const cw721_address = "0xED5387653A42705fAf8b32b3Fb6dB68E634a3586";
      const name = "Wen OG Pass";
      let next_token_id = 0;
      const start_order = 0;
      const supply = 1000;
      const symbol = "WEN OG";
      const tokenUri = "https://nftfile.actpass.com/json";
      const mint_groups = [
        {
          name: "Team",
          start_time: "1709145192",
          end_time: "1709155192",
          max_tokens: 10,
          unit_price: "0",
          market_root: []
        },
        {
          name: "Main Mint WL",
          start_time: "1709145192",
          end_time: "1709155192",
          max_tokens: 1,
          unit_price: "0",
          market_root: []
        },
        {
          name: "Main Mint Public",
          start_time: "1709155193",
          end_time: "1709155194",
          max_tokens: 1,
          unit_price: "0",
          market_root: []
        }
      ];
      const phases = mint_groups.map((group) => {
        return {
          ...group,
          allowlist: config.groups.find(
            (configGroup) => configGroup.name === group.name
          ).allowlist,
          noend: false
        };
      });

      let mintedSupply = await contract.getTokenCounter({
        from: address
      });

      const collectionData = {
        admin,
        cw721_address,
        name,
        supply,
        symbol,
        tokenUri,
        phases,
        mintedSupply
      };

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
