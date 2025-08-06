require('dotenv').config();

module.exports = {
  rpcUrl: process.env.RPC_URL || "https://devnet.helius-rpc.com/?api-key=your-api-key", 
  walletPrivateKey: process.env.WALLET_PRIVATE_KEY || "",
  baseMint: process.env.BASE_MINT || "base-token-mint-address",
  quoteMint: process.env.QUOTE_MINT || "quote-token-mint-address",
  network: process.env.NETWORK || "devnet",
  baseIn: process.env.BASE_IN,
  quoteIn: process.env.QUOTE_IN,
  slippage: process.env.SLIPPAGE,
  buyBaseAmount: process.env.BUY_BASE_AMOUNT,
  sellBaseAmount: process.env.SELL_BASE_AMOUNT,

};


