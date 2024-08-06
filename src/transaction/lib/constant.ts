import { PublicKey } from "@solana/web3.js";

// Utility function to validate environment variables
const validateEnvVar = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set. Using default value: ${defaultValue}`);
    return defaultValue;
  }
  return value;
};

// Seed used for deriving the global authority program address
export const GLOBAL_AUTHORITY_SEED = validateEnvVar("GLOBAL_AUTHORITY_SEED", "global-authority");

// Seed used for deriving user pool addresses
export const USER_POOL_SEED = validateEnvVar("USER_POOL_SEED", "user-pool");

// Size of the user pool in bytes (ensure this matches the required space for your program state)
export const USER_POOL_SIZE = parseInt(validateEnvVar("USER_POOL_SIZE", "4160"), 10);

// Program ID for the staking program (ensure this matches your deployed program ID)
export const PROGRAM_ID = new PublicKey(validateEnvVar("PROGRAM_ID", "Er8eAGu5j9fV5dUgRJnAzwKtAWvmovjNuyEvdUJrvXet"));

// Reward token mint address (verify this matches your reward token mint address)
export const REWARD_TOKEN_MINT = new PublicKey(validateEnvVar("REWARD_TOKEN_MINT", "FsVhY4aZvarxQSejTQdKs9VSVsdTEgwK2nB6dtTkG4MP"));

// Admin address for the staking program (ensure this address has the required permissions)
export const ADMIN_ADDRESS = new PublicKey(validateEnvVar("ADMIN_ADDRESS", "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo"));

// Metaplex Program ID for managing NFTs (confirm this is the correct version)
export const METAPLEX_PROGRAM_ID = new PublicKey(validateEnvVar("METAPLEX_PROGRAM_ID", "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"));

// Default rule set for MPL token auth rules (replace with actual rule set ID if different)
export const MPL_DEFAULT_RULE_SET = new PublicKey(validateEnvVar("MPL_DEFAULT_RULE_SET", "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9"));

// Placeholder for Token Auth Rules Program ID - replace with actual ID
export const TOKEN_AUTH_RULES_PROGRAM_ID = new PublicKey(validateEnvVar("TOKEN_AUTH_RULES_PROGRAM_ID", "TOKEN_AUTH_RULES_PROGRAM_ID_PLACEHOLDER"));
