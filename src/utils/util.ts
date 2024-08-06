import { Connection, PublicKey, ParsedAccountData } from "@solana/web3.js";
import { BARKWALLET, SOLANA_RPC } from "@/config";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Metaplex, Metadata } from "@metaplex-foundation/js";

// Initialize a connection to the Solana blockchain
export const solConnection = new Connection(SOLANA_RPC);

/**
 * Checks if a given NFT mint address is delegated to a specific address and has a non-zero delegated amount.
 * 
 * @param mint - The mint address of the NFT.
 * @param signer - The public key of the signer.
 * @returns - A boolean indicating whether the NFT is delegated to the specific address with a non-zero amount.
 */
export const getDelegateStatus = async (mint: string, signer: PublicKey): Promise<boolean> => {
  try {
    const tokenAccount = await getAssociatedTokenAddress(new PublicKey(mint), signer);
    const tokenAccountData = await solConnection.getParsedAccountInfo(tokenAccount);
    
    if (!tokenAccountData.value?.data) {
      throw new Error("Token account data is missing");
    }

    const parsedInfo = tokenAccountData.value.data as ParsedAccountData;
    const delegateAddress = parsedInfo.parsed?.info?.delegate;
    const delegateAmount = parsedInfo.parsed?.info?.delegatedAmount;

    // Check if delegate address matches and amount is greater than zero
    return delegateAddress === BARKWALLET.toBase58() && delegateAmount > 0;
  } catch (error) {
    console.error("Error fetching delegate status:", error);
    return false; // Return false in case of any error
  }
};

/**
 * Checks if a given NFT mint address is in a frozen state with a specific delegate.
 * 
 * @param mint - The mint address of the NFT.
 * @param signer - The public key of the signer.
 * @returns - A boolean indicating whether the NFT is frozen and delegated to the specific address.
 */
export const getFrozenStatus = async (mint: string, signer: PublicKey): Promise<boolean> => {
  try {
    const tokenAccount = await getAssociatedTokenAddress(new PublicKey(mint), signer);
    const tokenAccountData = await solConnection.getParsedAccountInfo(tokenAccount);

    if (!tokenAccountData.value?.data) {
      throw new Error("Token account data is missing");
    }

    const parsedInfo = tokenAccountData.value.data as ParsedAccountData;
    const delegateAddress = parsedInfo.parsed?.info?.delegate;
    const state = parsedInfo.parsed?.info?.state;

    // Check if delegate address matches and state is 'frozen'
    return delegateAddress === BARKWALLET.toBase58() && state === "frozen";
  } catch (error) {
    console.error("Error fetching frozen status:", error);
    return false; // Return false in case of any error
  }
};

/**
 * Retrieves metadata for a given NFT mint address.
 * 
 * @param mint - The mint address of the NFT.
 * @returns - The metadata of the NFT.
 */
export const getNftMetadata = async (mint: PublicKey): Promise<Metadata> => {
  try {
    const metaplex = new Metaplex(solConnection);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
    return nft;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw new Error("Failed to retrieve NFT metadata");
  }
};

/**
 * Shortens a public key to a more readable format.
 * 
 * @param publicKey - The public key to shorten.
 * @returns - A shortened version of the public key.
 */
export const shortenPublicKey = (publicKey: string | undefined): string => {
  if (!publicKey) return "";
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};
