import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
// Your whitelist from database
const whitelist = [
  "0xc138b0459DD44543f03C47F476F35c173a3F4071",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
];

const { keccak256 } = ethers;
let leaves = whitelist.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

// Save this value to smartcontract
const merkleRootHash = merkleTree.getHexRoot();

console.log(333, "getMerkleRoot", merkleTree.getHexRoot());

export const getMerkleRoot = () => {
  return merkleRootHash;
};

// byte 32 로 변환하면 32개 배열 나옴.
// start order 는  0
