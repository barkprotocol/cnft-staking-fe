import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { solConnection } from "@/utils/util";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { 
    GLOBAL_AUTHORITY_SEED, 
    USER_POOL_SEED, 
    PROGRAM_ID, 
    REWARD_TOKEN_MINT, 
    METAPLEX_PROGRAM_ID, 
    MPL_DEFAULT_RULE_SET, 
    TOKEN_AUTH_RULES_PROGRAM_ID 
} from "./constant";
import { 
    getAssociatedTokenAccount, 
    getMetadata, 
    getMasterEdition, 
    findTokenRecordPda 
} from "./util";
import { createInitUserTx } from "./initUserTx";

/**
 * Creates a transaction to lock NFTs.
 * 
 * @param wallet The wallet context state.
 * @param nftMints The array of NFT mint addresses to lock.
 * @param program The Anchor program instance.
 * @returns The transaction ID after sending and confirming the transaction.
 */
export const createLockPnftTx = async (
  wallet: WalletContextState,
  nftMints: PublicKey[],
  program: anchor.Program
): Promise<string | undefined> => {
  const userAddress = wallet.publicKey;
  if (!userAddress) throw new Error("Wallet not connected");

  const tx = new Transaction();
  const instructions: anchor.web3.TransactionInstruction[] = [];
  const userPoolKey = await PublicKey.createWithSeed(
    userAddress,
    USER_POOL_SEED,
    program.programId
  );

  try {
    // Check if the user pool exists; initialize if not
    const poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (!poolAccount) {
      console.log("Initializing User Pool...");
      const initUserTx = await createInitUserTx(userAddress, program);
      instructions.push(...initUserTx.instructions);
    }

    // Prepare instructions for each NFT mint
    for (const nftMint of nftMints) {
      const [globalPool] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
      );

      // Fetch necessary accounts and metadata
      const nftEdition = await getMasterEdition(nftMint);
      const tokenAccount = await getAssociatedTokenAccount(userAddress, nftMint);
      const mintMetadata = await getMetadata(nftMint);
      const tokenMintRecord = findTokenRecordPda(nftMint, tokenAccount);

      // Create lock NFT transaction instruction
      const lockTx = await program.methods
        .lockPnft(new anchor.BN(10)) // Placeholder reward amount
        .accounts({
          globalPool,
          tokenAccount,
          tokenMint: nftMint,
          tokenMintEdition: nftEdition,
          tokenMintRecord,
          mintMetadata,
          authRules: MPL_DEFAULT_RULE_SET,
          sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
          signer: userAddress,
          userPool: userPoolKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenMetadataProgram: METAPLEX_PROGRAM_ID,
          authRulesProgram: TOKEN_AUTH_RULES_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      instructions.push(...lockTx.instructions);
    }

    // Handle transaction size limits
    const MAX_INSTRUCTIONS_PER_TRANSACTION = 20; // Example limit, adjust as needed
    if (instructions.length > MAX_INSTRUCTIONS_PER_TRANSACTION) {
      const batchedTxs: Transaction[] = [];
      while (instructions.length > 0) {
        const txBatch = new Transaction();
        txBatch.add(...instructions.splice(0, MAX_INSTRUCTIONS_PER_TRANSACTION));
        txBatch.feePayer = userAddress;
        txBatch.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;
        batchedTxs.push(txBatch);
      }

      for (const batch of batchedTxs) {
        if (wallet.signTransaction) {
          const txData = await wallet.signTransaction(batch);
          const sTx = txData.serialize();
          const txId = await solConnection.sendRawTransaction(sTx);
          await solConnection.confirmTransaction(txId, "finalized");
          console.log("Batch Lock NFT transaction ID:", txId);
        }
      }
    } else {
      tx.add(...instructions);
      tx.feePayer = userAddress;
      tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

      if (wallet.signTransaction) {
        const txData = await wallet.signTransaction(tx);
        const sTx = txData.serialize();
        const txId = await solConnection.sendRawTransaction(sTx);
        await solConnection.confirmTransaction(txId, "finalized");
        console.log("Lock NFT transaction ID:", txId);
        return txId;
      }
    }
  } catch (error) {
    console.error("Error creating lock NFT transaction:", error);
    throw error;
  }
};
