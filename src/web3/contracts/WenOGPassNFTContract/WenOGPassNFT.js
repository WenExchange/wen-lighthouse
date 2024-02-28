import { isProduction } from "../../../utils/constants";

import WenOGPassNFT from "./WenOGPassNFT.json";
export default {
  address: isProduction
    ? "0xED5387653A42705fAf8b32b3Fb6dB68E634a3586"
    : "0xED5387653A42705fAf8b32b3Fb6dB68E634a3586",
  abi: WenOGPassNFT.abi
};
