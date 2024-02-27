import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

export const Hex2Rgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const shortenPublicKey = (publicKey, len) => {
  try {
    if (len) {
      return publicKey.slice(0, len);
    }
    return publicKey.slice(0, 5) + "..." + publicKey.slice(-5);
  } catch (e) {
    return publicKey;
  }
};

export function getWeb3URL(url) {
  try {
    if (!url) return null;
    const _url = new URL(url);

    if (_url.protocol === "ipfs:") {
      return "https://ipfs.io/ipfs/" + _url.pathname.replace("//", "");
    }
    return url;
  } catch (error) {
    return null;
  }
}
