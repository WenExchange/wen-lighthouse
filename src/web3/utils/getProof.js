import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
// export default async function handler() {
// Whitelist array from you database
const whitelist = [
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0xc138b0459DD44543f03C47F476F35c173a3F4071"
];

// This variable will contain the signature we need
let proof = [];

// Parse params passed to server and get user wallet address
const userWalletAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";

if (whitelist.includes(userWalletAddress)) {
  const { keccak256 } = ethers.utils;
  let leaves = whitelist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  let hashedAddress = keccak256(userWalletAddress);
  proof = merkleTree.getHexProof(hashedAddress);
}

console.log(proof);
// Return proof to web
// }

//
