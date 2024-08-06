import * as anchor from "@coral-xyz/anchor";
import { GLOBAL_AUTHORITY_SEED, PROGRAM_ID } from "../lib/constant";
import { PublicKey, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { solConnection } from "@/utils/util";
import { IDL } from "./staking";
import { REWARD_TOKEN_MINT } from "@/config";
import {
  createInitUserTx,
  createLockPnftTx,
  createUnlockPnftTx,
} from "../lib/scripts";
import { GlobalPool, UserPool } from "../lib/types";
import {
  getATokenAccountsNeedCreate,
  getAssociatedTokenAccount,
} from "../lib/util";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

/** Address of the deployed program. */
const programId = new anchor.web3.PublicKey(PROGRAM_ID);

/** Anchor provider setup. */
const provider = new anchor.AnchorProvider(
  solConnection,
  window.solana,
  anchor.AnchorProvider.defaultOptions()
);

/** Anchor program instance. */
const program = new anchor.Program(IDL as anchor.Idl, programId, provider);

/**
 * Initialize user pool.
 * @param wallet The wallet context state.
 */
export const initializeUserPool = async (wallet: WalletContextState) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  try {
    const tx = await createInitUserTx(wallet.publicKey, program);
    const txId = await provider.sendAndConfirm(tx, [], { commitment: "confirmed" });
    console.log("User Pool Initialized, Transaction ID:", txId);
  } catch (e) {
    console.error("Error initializing user pool:", e);
  }
};

/**
 * Lock CNFTs.
 * @param wallet The wallet context state.
 * @param nftMints The array of NFT mint addresses to lock.
 */
export const lockPnft = async (
  wallet: WalletContextState,
  nftMints: PublicKey[]
) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  try {
    const tx = await createLockPnftTx(wallet, nftMints, program);
    if (tx) {
      console.log("Lock pNFT Transaction:", tx);
      const txId = await provider.sendAndConfirm(tx, [], { commitment: "confirmed" });
      console.log("Transaction ID:", txId);
    }
  } catch (e) {
    console.error("Error locking pNFTs:", e);
  }
};

/**
 * Unlock CNFTs.
 * @param wallet The wallet context state.
 * @param nftMints The array of CNFT mint addresses to unlock.
 */
export const unlockPnft = async (
  wallet: WalletContextState,
  nftMints: PublicKey[]
) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  try {
    const tx = await createUnlockPnftTx(wallet, nftMints, program, solConnection);
    if (tx) {
      console.log("Unlock pNFT Transaction:", tx);
      const txId = await provider.sendAndConfirm(tx, [], { commitment: "confirmed" });
      console.log("Transaction ID:", txId);
    }
  } catch (e) {
    console.error("Error unlocking pNFTs:", e);
  }
};

/**
 * Get global pool state.
 * @returns The global pool state or null if an error occurs.
 */
export const getGlobalState = async (): Promise<GlobalPool | null> => {
  const [globalPool] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  try {
    const globalState = await program.account.globalPool.fetch(globalPool);
    return globalState as GlobalPool;
  } catch (e) {
    console.error("Error fetching global pool state:", e);
    return null;
  }
};

/**
 * Get global pool admin info.
 * @returns The admin address as a base58 string or null if an error occurs.
 */
export const getGlobalInfo = async (): Promise<string | null> => {
  try {
    const globalPool = await getGlobalState();
    return globalPool ? globalPool.admin.toBase58() : null;
  } catch (e) {
    console.error("Error fetching global pool admin info:", e);
    return null;
  }
};

/**
 * Get user pool state.
 * @param user The public key of the user.
 * @returns The user pool state or null if an error occurs.
 */
export const getUserState = async (
  user: PublicKey
): Promise<UserPool | null> => {
  const userPoolKey = await PublicKey.createWithSeed(
    user,
    "user-pool",
    program.programId
  );

  try {
    const userState = await program.account.userPool.fetch(userPoolKey);
    return userState as UserPool;
  } catch (e) {
    console.error("Error fetching user pool state:", e);
    return null;
  }
};

/**
 * Claim reward transaction.
 * @param wallet The wallet context state.
 * @returns The transaction ID after sending and confirming the transaction.
 */
export const claimRewardTx = async (wallet: WalletContextState) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  const userAddress = wallet.publicKey;
  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  const userPoolKey = await PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    program.programId
  );

  const { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
    userAddress,
    userAddress,
    [REWARD_TOKEN_MINT]
  );

  const rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    REWARD_TOKEN_MINT
  );

  const tx = await program.methods
    .claimReward()
    .accounts({
      owner: userAddress,
      userPool: userPoolKey,
      globalAuthority,
      rewardVault,
      userRewardAccount: destinationAccounts[0],
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .preInstructions([...instructions])
    .transaction();

  tx.feePayer = userAddress;
  tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

  try {
    if (wallet.signTransaction) {
      const txData = await wallet.signTransaction(tx);
      const sTx = txData.serialize();
      const txId = await solConnection.sendRawTransaction(sTx);
      await solConnection.confirmTransaction(txId, "finalized");
      console.log("Reward Claim Transaction ID:", txId);
      return txId;
    }
  } catch (e) {
    console.error("Error claiming reward:", e);
  }
};
