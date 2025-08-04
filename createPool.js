const {PumpAmmSdk} = require("@pump-fun/pump-swap-sdk");
const { NATIVE_MINT } = require("@solana/spl-token");
const { Connection, Keypair, PublicKey, Transaction,sendAndConfirmTransaction, LAMPORTS_PER_SOL} = require("@solana/web3.js");
const bs58 = require("bs58");
const { BN } = require("bn.js");

const RPC_URL = "https://devnet.helius-rpc.com/?api-key=";
const secretKey = bs58.decode('');
const owner = Keypair.fromSecretKey(secretKey);

const connection = new Connection(RPC_URL)
const pumpAmmSdk = new PumpAmmSdk(connection);
const baseMint = new PublicKey('FzCBYateKxGhcK8QAqBJuTyQpVV8P5HrUcz9XGU9x1E6');
const quoteMint = new PublicKey('So11111111111111111111111111111111111111112');
const baseIn = new BN('1000000000');
const quoteIn = new BN('1000000000');



async function main() {

    const index = 0;
    const createPoolSolanaState = await pumpAmmSdk.createPoolSolanaState(
      index,
      owner.publicKey,
      baseMint,
      quoteMint,
    );
    console.log("this is the pool", createPoolSolanaState);

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

main();