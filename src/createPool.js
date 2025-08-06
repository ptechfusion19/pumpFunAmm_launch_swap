const {PumpAmmSdk} = require("@pump-fun/pump-swap-sdk");
const { Connection, Keypair, PublicKey, Transaction,sendAndConfirmTransaction, LAMPORTS_PER_SOL} = require("@solana/web3.js");
const bs58 = require("bs58");
const fs = require('fs');
const { BN } = require("bn.js");
const config = require ('../config/config')

const RPC_URL = config.rpcUrl;
const secretKey = bs58.decode(config.walletPrivateKey);
const owner = Keypair.fromSecretKey(secretKey);
const connection = new Connection(RPC_URL)
const baseMint = new PublicKey(config.baseMint);
const quoteMint = new PublicKey(config.quoteMint);
const baseIn = new BN(config.baseIn);
const quoteIn = new BN(config.quoteIn);

const pumpAmmSdk = new PumpAmmSdk(connection);

async function main() {

    const index = 0;
    const createPoolSolanaState = await pumpAmmSdk.createPoolSolanaState(
      index,
      owner.publicKey,
      baseMint,
      quoteMint,
    );

    //save created pool's key to interact later with buy/sell
   const poolKey = createPoolSolanaState.poolKey;   
   fs.writeFileSync('./poolKey.json', JSON.stringify({ poolKey: poolKey.toString() }));

    const createPoolInstructions = await pumpAmmSdk.createPoolInstructions(
     createPoolSolanaState,
     baseIn,
     quoteIn,
    );  

    const tx = new Transaction().add(
      ...createPoolInstructions  
    );

            tx.feePayer = owner.publicKey;
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            tx.signature = owner;

            const txId = await sendAndConfirmTransaction(connection, tx, [owner]);          
            console.log("txId ", txId);
            
}

main()
    .then( () => {
        console.log("Successfully created Pool and logged in json");
    })
    .catch(error => {
        console.error("Error creating pool:", error);
    });;
