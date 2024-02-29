import { isProduction } from "../../../utils/constants";
import config from "../../../config.json"

import WenOGPassNFT from "./WenOGPassNFT.json";
export default {
  address: config.collection_address,
  abi: WenOGPassNFT.abi
};
