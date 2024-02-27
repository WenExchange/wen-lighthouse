export const isProduction = process.env.REACT_APP_IS_PRODUCTION === "TRUE";
// export const isProduction = false;

const CONSTANTS = {
  URL: {
    APP: "https://wen.exchange",
    DOCS: "https://docs.wen.exchange",
    FOOTER: {
      EARLY_ACCESS: "https://docs.wen.exchange/general/usdwen/early-access",
      AIRDROP: "https://docs.wen.exchange/general/usdwen/airdrop",
      TRADE_POOL: "https://docs.wen.exchange/product/wen-trade-pool",
      GAS_STATION: "https://docs.wen.exchange/product/wen-gas-station",
      NFT_BUILDER: "https://docs.wen.exchange/product/wen-nft-builder"
    },

    COMMUNITY: {
      TWITTER: "https://twitter.com/wen_exchange",
      DISCORD: "https://discord.gg/eT9fj7hTS9",
      MEDIUM: ""
    }
  }
};

export default CONSTANTS;
