export type Staking = {
  version: "0.1.0",
  name: "staking",
  instructions: [
    {
      name: "initialize",
      docs: [
        "Initializes the global pool. The caller of this instruction (super admin) will be set as the global pool admin.",
        "Ensure that the global pool account is empty before calling this instruction."
      ],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: [
            "Super admin who will manage the global pool."
          ]
        },
        {
          name: "globalPool",
          isMut: true,
          isSigner: false,
          docs: [
            "Account to be initialized as the global pool."
          ]
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "System program ID required to create accounts."
          ]
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: [
            "Rent sysvar for paying account rent."
          ]
        }
      ],
      args: []
    },
    {
      name: "changeAdmin",
      docs: [
        "Changes the admin of the global pool. The new admin will replace the current admin."
      ],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: [
            "Current admin who is authorized to change the global pool admin."
          ]
        },
        {
          name: "globalPool",
          isMut: true,
          isSigner: false,
          docs: [
            "Global pool account whose admin will be changed."
          ]
        }
      ],
      args: [
        {
          name: "newAdmin",
          type: "publicKey",
          docs: [
            "Public key of the new admin to be set."
          ]
        }
      ]
    },
    {
      name: "initUser",
      docs: [
        "Initializes a user pool for managing the user's staked NFTs."
      ],
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
          docs: [
            "User who is initializing their pool."
          ]
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
          docs: [
            "Account to be initialized as the user's pool."
          ]
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "System program ID required to create accounts."
          ]
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: [
            "Rent sysvar for paying account rent."
          ]
        }
      ],
      args: []
    },
    {
      name: "lockPnft",
      docs: [
        "Allows a user to lock CNFTs (NFTs) from a specific collection. This prevents the locked NFTs from being transferred until unlocked."
      ],
      accounts: [
        {
          name: "globalPool",
          isMut: true,
          isSigner: false,
          docs: [
            "Global pool account involved in locking the NFTs."
          ]
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Token account for the NFT to be locked."
          ]
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: [
            "Mint of the token being locked."
          ]
        },
        {
          name: "tokenMintEdition",
          isMut: false,
          isSigner: false,
          docs: [
            "Edition account for the token. Fails if the edition is incorrect."
          ]
        },
        {
          name: "tokenMintRecord",
          isMut: true,
          isSigner: false,
          docs: [
            "Record for the token mint. Fails if the record is incorrect."
          ]
        },
        {
          name: "mintMetadata",
          isMut: true,
          isSigner: false,
          docs: [
            "Metadata for the mint. Fails if the metadata is incorrect."
          ]
        },
        {
          name: "authRules",
          isMut: false,
          isSigner: false,
          docs: [
            "Authentication rules for the token. Fails if the rules are incorrect."
          ]
        },
        {
          name: "sysvarInstructions",
          isMut: false,
          isSigner: false,
          docs: [
            "Sysvar instructions. Fails if the instructions are incorrect."
          ]
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
          docs: [
            "Signer authorizing the lock action."
          ]
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
          docs: [
            "User pool account that will be updated with the locked NFT."
          ]
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "Token program ID."
          ]
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "Token metadata program ID. Fails if incorrect."
          ]
        },
        {
          name: "authRulesProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "Auth rules program ID. Fails if incorrect."
          ]
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "System program ID."
          ]
        }
      ],
      args: [
        {
          name: "lockPeriod",
          type: "i64",
          docs: [
            "Period for which the NFT will be locked, specified in milliseconds."
          ]
        }
      ]
    },
    {
      name: "claimReward",
      docs: [
        "Allows a user to claim rewards accumulated for their locked NFTs."
      ],
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "User who is claiming the reward."
          ]
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
          docs: [
            "User's pool account containing their locked NFTs."
          ]
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
          docs: [
            "Authority managing the global pool's rewards."
          ]
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
          docs: [
            "Vault where rewards are stored."
          ]
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Account where the reward will be credited."
          ]
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "Token program ID for handling reward transactions."
          ]
        }
      ],
      args: []
    },
    {
      name: "unlockPnft",
      docs: [
        "Allows a user to unlock CNFTs that were previously locked."
      ],
      accounts: [
        {
          name: "globalPool",
          isMut: false,
          isSigner: false,
          docs: [
            "Global pool account involved in unlocking the NFTs."
          ]
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Token account for the NFT to be unlocked."
          ]
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: [
            "Mint of the token being unlocked."
          ]
        },
        {
          name: "tokenMintEdition",
          isMut: false,
          isSigner: false,
          docs: [
            "Edition account for the token. Fails if the edition is incorrect."
          ]
        },
        {
          name: "tokenMintRecord",
          isMut: true,
          isSigner: false,
          docs: [
            "Record for the token mint. Fails if the record is incorrect."
          ]
        },
        {
          name: "mintMetadata",
          isMut: true,
          isSigner: false,
          docs: [
            "Metadata for the mint. Fails if the metadata is incorrect."
          ]
        },
        {
          name: "authRules",
          isMut: false,
          isSigner: false,
          docs: [
            "Authentication rules for the token. Fails if the rules are incorrect."
          ]
        },
        {
          name: "sysvarInstructions",
          isMut: false,
          isSigner: false,
          docs: [
            "Sysvar instructions. Fails if the instructions are incorrect."
          ]
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
          docs: [
            "Signer authorizing the unlock action."
          ]
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
          docs: [
            "User pool account that will be updated with the unlocked NFT."
          ]
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "Token program ID."
          ]
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "Token metadata program ID. Fails if incorrect."
          ]
        },
        {
          name: "authRulesProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "Auth rules program ID. Fails if incorrect."
          ]
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: [
            "System program ID."
          ]
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: "globalPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            type: "publicKey",
            docs: [
              "The public key of the admin managing the global pool."
            ]
          }
        ]
      }
    },
    {
      name: "userPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
            docs: [
              "The public key of the user who owns this pool."
            ]
          },
          {
            name: "itemCount",
            type: "u64",
            docs: [
              "Number of items (NFTs) in the pool."
            ]
          },
          {
            name: "items",
            type: {
              array: [
                {
                  defined: "StakedNFT",
                  docs: [
                    "Array of staked NFTs in the pool."
                  ]
                },
                64
              ]
            }
          },
          {
            name: "rewardTime",
            type: "i64",
            docs: [
              "Timestamp of the last reward calculation."
            ]
          },
          {
            name: "pendingReward",
            type: "u64",
            docs: [
              "Total amount of rewards pending for the user."
            ]
          }
        ]
      }
    }
  ],
  types: [
    {
      name: "StakedNFT",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nftAddr",
            type: "publicKey",
            docs: [
              "Public key of the NFT."
            ]
          },
          {
            name: "stakeTime",
            type: "i64",
            docs: [
              "Timestamp when the NFT was staked."
            ]
          },
          {
            name: "rewardTime",
            type: "i64",
            docs: [
              "Timestamp of the last reward calculation for this NFT."
            ]
          },
          {
            name: "lockTime",
            type: "i64",
            docs: [
              "Timestamp when the NFT will be unlocked."
            ]
          },
          {
            name: "rate",
            type: "i64",
            docs: [
              "Rate of reward accumulation for this NFT."
            ]
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidAdmin",
      msg: "Admin address mismatch. The provided admin address does not match the expected address."
    },
    {
      code: 6001,
      name: "ExceedMaxCount",
      msg: "Maximum item count reached. No more items can be added to the pool."
    },
    {
      code: 6002,
      name: "InvalidMetadata",
      msg: "Metadata address is invalid. The provided metadata address does not match the expected format."
    },
    {
      code: 6003,
      name: "InvalidCollection",
      msg: "Collection is invalid. The provided collection does not match any known valid collections."
    },
    {
      code: 6004,
      name: "MetadataCreatorParseError",
      msg: "Unable to parse creators in metadata. The metadata does not contain valid creator information."
    },
    {
      code: 6005,
      name: "NftNotExist",
      msg: "NFT does not exist. The specified NFT could not be found in the collection."
    },
    {
      code: 6006,
      name: "WrongEdition",
      msg: "Incorrect edition provided. The provided edition does not match the expected edition."
    },
    {
      code: 6007,
      name: "WrongTokenRecord",
      msg: "Incorrect token record provided. The provided token record does not match the expected record."
    },
    {
      code: 6008,
      name: "WrongTokenMetadata",
      msg: "Incorrect token metadata provided. The provided token metadata does not match the expected metadata."
    },
    {
      code: 6009,
      name: "InvalidRules",
      msg: "Incorrect auth rules provided. The provided auth rules do not match the expected rules."
    },
    {
      code: 6010,
      name: "InstructionFailed",
      msg: "Instruction failed. An error occurred while processing the instruction."
    }
  ]
};
