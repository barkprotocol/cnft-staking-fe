import { web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// Utility function to validate environment variables and provide default values if needed
const validateEnvVar = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set. Using default value: ${defaultValue}`);
    return defaultValue;
  }
  return value;
};

// API URL to fetch the current price of Solana (SOL) in USD
export const SOL_PRICE_API = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

// Base URL for the application's API
export const BASE_URL = validateEnvVar("NEXT_PUBLIC_API_URL", "");

// PublicKey for the reward token mint
export const REWARD_TOKEN_MINT = new PublicKey(validateEnvVar("NEXT_PUBLIC_TOKEN_MINT", "11111111111111111111111111111111"));

// Metaplex Program ID for interacting with Metaplex
export const METAPLEX = new web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

// Size of the user pool (number of slots available)
export const USER_POOL_SIZE = 3264;

// Seed used to derive the global authority's public key
export const GLOBAL_AUTHORITY_SEED = "global-authority";

// Program ID for the staking program
export const PROGRAM_ID = new PublicKey("B63iBb7HBzfBHMjhrLqpmG85MoooYtiGpLfAAbc7XUiM");

// RPC endpoint for the Solana blockchain
export const SOLANA_RPC = validateEnvVar("NEXT_PUBLIC_SOLANA_RPC", "");

// Address of the creator
export const CREATOR_ADDRESS = validateEnvVar("NEXT_PUBLIC_CREATOR_ADDRESS", "");

// Maximum number of items that can be selected
export const MAX_SELECTABLE = 999;

// Address for BARK WALLET
export const BARKWALLET = new PublicKey(validateEnvVar("NEXT_PUBLIC_BARKWALLET", "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo"));

// Default duration in days
export const DAY = 15;

// Enum representing different plans with their durations in days
export enum PLANS {
  PLAN_0 = 7,   // 7 days
  PLAN_1 = 15,  // 15 days
  PLAN_2 = 30,  // 30 days
}
