const {PumpAmmSdk, sellBaseInputInternal,PumpAmmInternalSdk } = require("@pump-fun/pump-swap-sdk");
const { NATIVE_MINT } = require("@solana/spl-token");
const { Connection, Keypair, PublicKey, Transaction,sendAndConfirmTransaction} = require("@solana/web3.js");
const bs58 = require("bs58");
const fs = require('fs');
const { BN } = require("bn.js");
const config = require("../config/config");

const rpc = config.rpcUrl;
const secretKey = bs58.decode(config.walletPrivateKey);
const owner = Keypair.fromSecretKey(secretKey);
const ownerPubKey = owner.publicKey

const connection = new Connection(rpc)
const pumpAmmSdk = new PumpAmmSdk(connection);
const pumpbuy = new PumpAmmInternalSdk(connection);

const poolData = JSON.parse(fs.readFileSync('./poolKey.json', 'utf8'));
const poolKey = new PublicKey(poolData.poolKey); 

const baseAmount = new BN(config.sellBaseAmount);
const slippage = config.slippage;


async function main() {
  // Get the Swap State
  const swapSolanaState = await pumpAmmSdk.swapSolanaState(poolKey, owner.publicKey);
  const { globalConfig, pool, poolBaseAmount, poolQuoteAmount } = swapSolanaState;

  const baseReserve = poolBaseAmount;
  const quoteReserve = poolQuoteAmount;

  console.log("Base Reserve:", baseReserve.toString());
  console.log("Quote Reserve:", quoteReserve.toString());

  // Calculate Swap Outputs (Buying Base Token with Quote Token)
  const { base: sellQuoteAmount } = sellBaseInputInternal(
    baseAmount, slippage, baseReserve, quoteReserve, globalConfig, pool.creator
  );

 // make the swap instruction
  const swapInstructions = await pumpbuy.sellBaseInput(swapSolanaState, baseAmount, slippage);

  const tx = new Transaction().add(...swapInstructions);
//send the transcation.
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