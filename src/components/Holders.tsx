"use client";
import React, { useState } from "react";
import { Spinner } from "@chakra-ui/react";

const secureRPC = "https://mainnet.helius-rpc.com/?api-key=c2548f93-3d41-4a6b-b329-bc2b6fffd91d";

interface Holder {
  address: string;
  solAmount: number;
  tokenBalances: number;
}

interface ApiResponse {
  success: boolean;
  result?: {
    items: NFTItem[];
  };
  error?: string;
}

interface NFTItem {
  ownership: {
    owner: string;
  };
  burnt: boolean;
}

export default function Holders() {
  const [isLoading, setIsLoading] = useState(false);
  const [holders, setHolders] = useState<Holder[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCreatorArrayCollection = async () => {
    setIsLoading(true);
    setError(null);
    let page = 1;
    let holderList: Holder[] = [];
    const creatorAddress = "Er8eAGu5j9fV5dUgRJnAzwKtAWvmovjNuyEvdUJrvXet";

    try {
      while (true) {
        const response = await fetch(secureRPC, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "my-id",
            method: "getAssetsByCreator",
            params: {
              creatorAddress,
              onlyVerified: true,
              page,
              limit: 1000,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        const { result, error } = data;

        if (error) {
          throw new Error(`API error: ${error}`);
        }

        if (!result || !result.items || result.items.length === 0) break;

        // Fetch actual SOL amount and token balances here
        holderList = holderList.concat(
          result.items
            .filter((nft: NFTItem) => !nft.burnt)
            .map((nft: NFTItem) => ({
              address: nft.ownership.owner,
              solAmount: 0, // Replace with actual SOL amount fetching
              tokenBalances: 0, // Replace with actual token balances fetching
            }))
        );

        page++; // Increment page for pagination
      }

      setHolders(holderList);
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      setError("Failed to fetch holders data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl py-4 text-center">Holders</h1>
      <div className="text-center mb-4">
        <button
          className="border px-4 py-2 bg-black text-white uppercase hover:opacity-80 transition duration-300"
          onClick={fetchCreatorArrayCollection}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Holders"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {isLoading && <div className="flex justify-center items-center py-4"><Spinner size="lg" /></div>}
      {holders.length > 0 ? (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">Address</th>
                <th className="px-4 py-2 border-b">SOL Amount</th>
                <th className="px-4 py-2 border-b">Token Balances</th>
              </tr>
            </thead>
            <tbody>
              {holders.map((holder, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-2 border-b">{holder.address}</td>
                  <td className="px-4 py-2 border-b">{holder.solAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 border-b">{holder.tokenBalances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && !error && <p className="text-gray-500 text-center mt-4">No holders found.</p>
      )}
    </div>
  );
}
