"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { Nft } from "@/utils/type";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { CREATOR_ADDRESS } from "@/config";
import { solConnection } from "@/utils/util";
import { getUserState } from "@/transaction/cli/txScripts";

const useNfts = (address: PublicKey | null, connected?: boolean) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const publicKey = address?.toBase58();

  const fetchNftMetadata = useCallback(async (uri: string) => {
    try {
      const metadataRes = await fetch(uri);
      if (!metadataRes.ok) {
        throw new Error(`Failed to fetch metadata from URI: ${uri}`);
      }
      return await metadataRes.json();
    } catch (error) {
      throw new Error(`Metadata fetching error: ${(error as Error).message}`);
    }
  }, []);

  const fetchNfts = useCallback(async () => {
    if (!publicKey) {
      setNfts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const nftAccounts = await getParsedNftAccountsByOwner({
        publicAddress: publicKey,
        connection: solConnection,
      });

      if (!nftAccounts || nftAccounts.length === 0) {
        setNfts([]);
        setLoading(false);
        return;
      }

      const fullData: Nft[] = await Promise.all(
        nftAccounts.map(async (account) => {
          const creatorMatch = account.data?.creators?.find(
            (creator) =>
              creator.verified === 1 && creator.address === CREATOR_ADDRESS
          );

          if (!creatorMatch) return null;

          try {
            const metadata = await fetchNftMetadata(account.data.uri);

            return {
              mint: account.mint,
              image: metadata.image,
              description: metadata.description,
              data: account.data,
              staked: false,
              stakedAt: 0,
              status: "",
              owner: publicKey ?? "",
              lockTime: -1,
              rate: -1,
            };
          } catch (error) {
            console.error(`Error fetching metadata for NFT: ${account.mint}`);
            return null;
          }
        })
      );

      const filteredData = fullData.filter(Boolean) as Nft[];

      if (address) {
        const stakedData = await getUserState(address);
        if (stakedData) {
          const { itemCount, items } = stakedData;
          const sMints = items.map((item, i) => ({
            mint: item.nftAddr.toBase58(),
            stakeTime: item.stakeTime.toNumber() * 1000,
            lockTime: item.lockTime.toNumber(),
            rate: item.rate.toNumber(),
          }));

          const enrichedData = filteredData.map((nft) => {
            const matchedNft = sMints.find((item) => item.mint === nft.mint);
            return {
              ...nft,
              lockTime: matchedNft?.lockTime ?? nft.lockTime,
              rate: matchedNft?.rate ?? nft.rate,
              stakedAt: matchedNft?.stakeTime ?? nft.stakedAt,
              staked: Boolean(matchedNft),
            };
          });

          setNfts(enrichedData);
        } else {
          setNfts(filteredData);
        }
      } else {
        setNfts(filteredData);
      }
    } catch (error: any) {
      console.error("Error fetching NFTs:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [publicKey, fetchNftMetadata, address]);

  useEffect(() => {
    if (connected) {
      fetchNfts();
    } else {
      setNfts([]);
      setLoading(false);
    }
  }, [connected, fetchNfts]);

  return { nfts, error, loading, fetchNfts };
};

export default useNfts;
