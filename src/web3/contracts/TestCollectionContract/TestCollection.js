import { isProduction } from "../../../utils/constants";

import TestCollection from "./TestCollection.json";
export default {
  address: isProduction
    ? "0x67CC1ae57E6167Fb27663F50Ce5FEb12F8dD5565"
    : "0x67CC1ae57E6167Fb27663F50Ce5FEb12F8dD5565",
  abi: TestCollection.abi
};
