import { ethers } from "ethers";
import { AnkrRPCProvider } from "../../constants";
import TestCollection from "./TestCollection";
import DannyWalletConnector from "../../wallet/DannyWalletConnector";

const TestCollectionContract = (provider = AnkrRPCProvider) => {
  return new ethers.Contract(
    TestCollection.address,
    TestCollection.abi,
    provider ? provider : AnkrRPCProvider
  );
};

export default TestCollectionContract;
