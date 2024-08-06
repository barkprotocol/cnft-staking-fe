/**
 * Represents an individual creator associated with an NFT.
 */
export type Creator = {
  /**
   * The public key of the creator.
   */
  address: string;

  /**
   * The share percentage of the creator (0-100).
   */
  share: number;
};

/**
 * Represents an NFT with metadata and staking information.
 */
export type Nft = {
  /**
   * The mint address of the NFT.
   */
  mint: string;

  /**
   * The URL of the image associated with the NFT.
   */
  image: string;

  /**
   * A description of the NFT.
   */
  description: string;

  /**
   * Additional metadata about the NFT.
   */
  data: {
    /**
     * Array of creators associated with the NFT.
     */
    creators: Creator[];

    /**
     * The name of the NFT.
     */
    name: string;

    /**
     * The symbol of the NFT.
     */
    symbol: string;

    /**
     * The URI pointing to more details about the NFT.
     */
    uri: string;
  };

  /**
   * Indicates if the NFT is currently staked.
   */
  staked: boolean;

  /**
   * The timestamp when the NFT was staked (UNIX timestamp).
   */
  stakedAt: number;

  /**
   * The public key of the NFT owner.
   */
  owner: string;

  /**
   * The current status of the NFT (e.g., 'active', 'inactive').
   */
  status: string;

  /**
   * The lock time for the NFT, indicating when it is locked (UNIX timestamp).
   */
  lockTime: number;

  /**
   * The rate at which rewards accumulate for the staked NFT.
   */
  rate: number;
};

/**
 * Represents the status of an NFT in a pool.
 */
export type PoolStatus = {
  /**
   * The address of the NFT in the pool.
   */
  nftAddress: string;

  /**
   * Indicates whether the NFT is currently pooled.
   */
  isPooled: boolean;

  /**
   * Optional status information about the NFT in the pool.
   */
  status?: string;

  /**
   * Optional timestamp when the status was last updated (ISO 8601 format).
   */
  timestamp?: string;
};
