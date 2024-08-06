"use client";

import { Nft } from "@/utils/type";
import { Dispatch, FC, SetStateAction, useMemo } from "react";

interface TabsProps {
  nfts: Nft[];
  tab: "staked" | "unstaked" | "all";
  setTab: Dispatch<SetStateAction<"staked" | "unstaked" | "all">>;
}

export const Tabs: FC<TabsProps> = ({ nfts, tab, setTab }) => {
  // Memoize the count calculations for performance optimization
  const unstakedCount = useMemo(() => nfts.filter((nft) => !nft.staked).length, [nfts]);
  const stakedCount = useMemo(() => nfts.filter((nft) => nft.staked).length, [nfts]);

  return (
    <div className="text-white capitalize flex items-center gap-2 w-full md:w-auto">
      <div role="tablist" aria-label="NFT Tabs">
        <button
          role="tab"
          aria-selected={tab === "unstaked"}
          aria-label={`Show unstaked NFTs (${unstakedCount})`}
          className={`w-full md:w-auto border border-white/30 py-2 px-2 lg:px-4 rounded-lg font-medium text-center capitalize text-sm lg:text-lg transition-colors duration-300 ${
            tab === "unstaked" ? "text-white bg-black/30" : "text-white/60"
          }`}
          title={`Unstaked NFTs (${unstakedCount})`}
          onClick={() => setTab("unstaked")}
        >
          Unstaked ({unstakedCount})
        </button>
        <button
          role="tab"
          aria-selected={tab === "staked"}
          aria-label={`Show staked NFTs (${stakedCount})`}
          className={`w-full md:w-auto border border-white/30 py-2 px-2 lg:px-4 rounded-lg font-medium text-center capitalize text-sm lg:text-lg transition-colors duration-300 ${
            tab === "staked" ? "text-white bg-black/30" : "text-white/60"
          }`}
          title={`Staked NFTs (${stakedCount})`}
          onClick={() => setTab("staked")}
        >
          Staked ({stakedCount})
        </button>
      </div>
    </div>
  );
};
