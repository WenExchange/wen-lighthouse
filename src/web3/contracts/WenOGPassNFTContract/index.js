import { ethers } from "ethers";
import { AnkrRPCProvider } from "../../constants";
import WenOGPassNFT from "./WenOGPassNFT";
import DannyWalletConnector from "../../wallet/DannyWalletConnector";

const WenOGPassNFTContract = (provider = AnkrRPCProvider) => {
  return new ethers.Contract(
    WenOGPassNFT.address,
    WenOGPassNFT.abi,
    provider ? provider : AnkrRPCProvider
  );
};

export default WenOGPassNFTContract;
