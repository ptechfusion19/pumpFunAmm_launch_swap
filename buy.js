const {PumpAmmSdk, buyBaseInputInternal,PumpAmmInternalSdk } = require("@pump-fun/pump-swap-sdk");
const { NATIVE_MINT } = require("@solana/spl-token");
const { Connection, Keypair, PublicKey, Transaction,sendAndConfirmTransaction} = require("@solana/web3.js");
const bs58 = require("bs58");
const { BN } = require("bn.js");

const RPC_URL = "https://devnet.helius-rpc.com/?api-key=";
const secretKey = bs58.decode('');
const owner = Keypair.fromSecretKey(secretKey);
const ownerPubKey = owner.publicKey

const connection = new Connection(RPC_URL)
const pumpAmmSdk = new PumpAmmSdk(connection);
const pumpbuy = new PumpAmmInternalSdk(connection);
const poolKey = new PublicKey('EBnXWcxAn8vBPNcaLUw4zdBpy5i96iDbDXWpCgcRu14d');
const baseAmount = new BN('10000000')
const slippage = 2;


async function main() {
  // Step 1: Get the Swap State
  const swapSolanaState = await pumpAmmSdk.swapSolanaState(poolKey, owner.publicKey);
  const { globalConfig, pool, poolBaseAmount, poolQuoteAmount } = swapSolanaState;

  const baseReserve = poolBaseAmount;
  const quoteReserve = poolQuoteAmount;

  console.log("Base Reserve:", baseReserve.toString());
  console.log("Quote Reserve:", quoteReserve.toString());

  // Step 2: Calculate Swap Outputs (Buying Base Token with Quote Token)
  const { uiQuote } = buyBaseInputInternal(
    baseAmount, slippage, baseReserve, quoteReserve, globalConfig, pool.creator
  );

  console.log("Calculated Buy Base Output:", uiQuote.toString());

 
  const swapInstructions = await pumpbuy.buyBaseInput(swapSolanaState, baseAmount, slippage);


  const tx = new Transaction().add(...swapInstructions);

  tx.feePayer = ownerPubKey;
  const blockhash = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash.blockhash;
  tx.signature = owner;

  try {
    const txId = await sendAndConfirmTransaction(connection, tx, [owner]);
    console.log("Transaction sent with txId:", txId);
  } catch (err) {
    console.error("Transaction failed:", err);
  }
}

main();