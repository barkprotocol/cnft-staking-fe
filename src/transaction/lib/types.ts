import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

/**
 * Type alias for representing a timestamp using BigNumber.
 */
type Timestamp = anchor.BN;

/**
 * Type alias for representing the reward rate using BigNumber.
 */
type RewardRate = anchor.BN;

/**
 * Represents the global pool of the staking program.
 */
export interface GlobalPool {
    /**
     * The public key of the admin managing the global pool.
     */
    admin: PublicKey;

    // Additional attributes can be added here if needed
}

/**
 * Represents the user's pool of staked NFTs.
 */
export interface UserPool {
    /**
     * The public key of the owner of the user pool.
     */
    owner: PublicKey;

    /**
     * The total number of NFTs staked in the user's pool.
     */
    itemCount: Timestamp;

    /**
     * An array of NFTs staked by the user.
     */
    items: StakedNFT[];

    /**
     * The timestamp indicating when the rewards were last calculated.
     * This property may be optional if rewards have not yet been calculated.
     */
    rewardTime?: Timestamp;

    /**
     * The total amount of pending rewards for the user.
     * This property may be optional if rewards have not yet been calculated.
     */
    pendingReward?: Timestamp;
}

/**
 * Represents a staked NFT in the user's pool.
 */
export interface StakedNFT {
    /**
     * The public key of the NFT that is staked.
     */
    nftAddr: PublicKey;

    /**
     * The timestamp indicating when the NFT was staked.
     */
    stakeTime: Timestamp;

    /**
     * The timestamp indicating the last time rewards were updated for the NFT.
     */
    rewardTime: Timestamp;

    /**
     * The timestamp indicating when the NFT was locked.
     */
    lockTime: Timestamp;

    /**
     * The rate at which rewards are accumulated for the NFT.
     */
    rate: RewardRate;
}
