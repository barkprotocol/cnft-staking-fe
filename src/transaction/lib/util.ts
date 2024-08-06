import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { solConnection } from '@/utils/util';

// Constants
export const METAPLEX = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const MPL_DEFAULT_RULE_SET = new PublicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9");

/**
 * Get the associated token account address for a given mint and owner.
 * @param ownerPubkey The public key of the token owner.
 * @param mintPk The public key of the token mint.
 * @returns The public key of the associated token account.
 */
export const getAssociatedTokenAccount = async (
    ownerPubkey: PublicKey,
    mintPk: PublicKey
): Promise<PublicKey> => {
    try {
        return PublicKey.findProgramAddressSync(
            [
                ownerPubkey.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                mintPk.toBuffer(),
            ],
            ASSOCIATED_TOKEN_PROGRAM_ID
        )[0];
    } catch (error) {
        console.error('Error getting associated token account:', error);
        throw new Error('Failed to get associated token account.');
    }
}

/**
 * Create an instruction to create an associated token account.
 * @param associatedTokenAddress The public key of the associated token account.
 * @param payer The public key of the payer.
 * @param walletAddress The public key of the wallet address.
 * @param splTokenMintAddress The public key of the SPL token mint address.
 * @returns The transaction instruction.
 */
export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: PublicKey,
    payer: PublicKey,
    walletAddress: PublicKey,
    splTokenMintAddress: PublicKey
): anchor.web3.TransactionInstruction => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        { pubkey: anchor.web3.SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: anchor.web3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

/**
 * Get the associated token accounts that need to be created and the necessary instructions.
 * @param walletAddress The public key of the wallet address.
 * @param owner The public key of the owner.
 * @param nfts An array of public keys representing the NFTs.
 * @returns An object containing instructions and destination accounts.
 */
export const getATokenAccountsNeedCreate = async (
    walletAddress: PublicKey,
    owner: PublicKey,
    nfts: PublicKey[],
): Promise<{ instructions: anchor.web3.TransactionInstruction[], destinationAccounts: PublicKey[] }> => {
    const instructions: anchor.web3.TransactionInstruction[] = [];
    const destinationAccounts: PublicKey[] = [];

    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await solConnection.getAccountInfo(destinationPubkey);

        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }

        destinationAccounts.push(destinationPubkey);

        if (!walletAddress.equals(owner)) {
            const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
            response = await solConnection.getAccountInfo(userAccount);

            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }

    return { instructions, destinationAccounts };
}

/**
 * Get the metadata account address for a given mint.
 * @param mint The public key of the mint.
 * @returns The public key of the metadata account.
 */
export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
    try {
        return (await PublicKey.findProgramAddress(
            [Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()],
            METAPLEX
        ))[0];
    } catch (error) {
        console.error('Error getting metadata account:', error);
        throw new Error('Failed to get metadata account.');
    }
};

/**
 * Get the master edition account address for a given mint.
 * @param mint The public key of the mint.
 * @returns The public key of the master edition account.
 */
export const getMasterEdition = async (
    mint: PublicKey
): Promise<PublicKey> => {
    try {
        return (await PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                METAPLEX.toBuffer(),
                mint.toBuffer(),
                Buffer.from("edition"),
            ],
            METAPLEX
        ))[0];
    } catch (error) {
        console.error('Error getting master edition account:', error);
        throw new Error('Failed to get master edition account.');
    }
};

/**
 * Find the token record PDA for a given mint and token.
 * @param mint The public key of the mint.
 * @param token The public key of the token.
 * @returns The public key of the token record PDA.
 */
export const findTokenRecordPda = (
    mint: PublicKey,
    token: PublicKey
): PublicKey => {
    try {
        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                METAPLEX.toBuffer(),
                mint.toBuffer(),
                Buffer.from("token_record"),
                token.toBuffer(),
            ],
            METAPLEX
        )[0];
    } catch (error) {
        console.error('Error finding token record PDA:', error);
        throw new Error('Failed to find token record PDA.');
    }
}

export {
    getAssociatedTokenAccount,
    getATokenAccountsNeedCreate,
    getMetadata,
    getMasterEdition
}
