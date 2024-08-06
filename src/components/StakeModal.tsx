"use client";

import { FC, useEffect, useState, useCallback } from "react";
import { CloseIcon } from "./SvgIcon";
import { useModal } from "@/contexts/ModalProvider";
import { Nft } from "@/utils/type";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { lockPnft } from "@/transaction/cli/txScripts";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import useNfts from "@/hooks/useNfts";

// Define button classes
const buttonClasses = "uppercase border-2 font-bold border-white text-white py-4 px-8 hover:bg-pink-800 duration-200 disabled:opacity-30 disabled:cursor-not-allowed w-full bg-pink-800/60";

interface ModalProps {
  nfts: Nft[];
}

const StakeModal: FC<ModalProps> = ({ nfts }) => {
  const { closeModal } = useModal();
  const wallet = useWallet();
  const { fetchNfts } = useNfts(wallet.publicKey);

  const [plan, setPlan] = useState<0 | 1 | 2>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle key press for closing modal
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [closeModal]);

  // Handle staking
  const handleStake = useCallback(async () => {
    setLoading(true);
    try {
      await lockPnft(
        wallet,
        nfts.map((item) => new PublicKey(item.mint)),
        plan
      );
      toast.success("NFT Staking successful");
      await fetchNfts();
      closeModal();
    } catch (error) {
      console.error("Staking failed:", error);
      toast.error("NFT Staking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [wallet, nfts, plan, fetchNfts, closeModal]);

  return (
    <div
      className="fixed inset-0 z-[999] grid place-content-center backdrop-blur-sm bg-black/30"
      role="dialog"
      aria-labelledby="stake-modal-title"
      aria-describedby="stake-modal-description"
    >
      <div
        className="absolute inset-0"
        onClick={closeModal}
        aria-hidden="true"
      />
      <div className="relative z-20 w-[720px] min-h-[360px] border border-white/20 p-4 bg-black/80 flex">
        <button
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
          onClick={closeModal}
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="p-2 grid grid-cols-2 gap-4">
            {nfts.slice(0, 3).map((nft, key) => (
              <div
                className="relative w-[148px] h-[148px] aspect-square"
                key={key}
                aria-label={`NFT image ${key + 1}`}
              >
                <Image
                  src={nft.image}
                  unoptimized
                  width={148}
                  height={148}
                  objectFit="cover"
                  alt={`NFT image ${key + 1}`}
                />
              </div>
            ))}
            {nfts.length > 3 && (
              <div className="relative aspect-square border-2 border-white/50 grid place-content-center text-white text-3xl font-bold">
                + {nfts.length - 3}
              </div>
            )}
          </div>

          <div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <PlanItem
                key={idx}
                plan={idx}
                current={plan}
                setPlan={() => setPlan(idx as 0 | 1 | 2)}
                title={`Plan ${idx + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur viverra, nulla in eleifend condimentum.`}
              />
            ))}
            <button
              className={buttonClasses}
              disabled={loading}
              onClick={handleStake}
            >
              {loading ? (
                <>
                  Staking...
                  {/* Add a spinner or progress indicator if needed */}
                </>
              ) : (
                "Stake"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlanProps {
  plan: 0 | 1 | 2;
  current: 0 | 1 | 2;
  title: string;
  setPlan: () => void;
}

const PlanItem: FC<PlanProps> = ({ plan, current, title, setPlan }) => (
  <div
    className="mb-4 cursor-pointer"
    onClick={setPlan}
    role="button"
    tabIndex={0}
    aria-pressed={plan === current}
  >
    <div className="flex gap-2 items-center">
      <div
        className={`w-4 h-4 border border-white ${plan === current ? "bg-white" : "bg-transparent"}`}
      />
      <div className="uppercase text-white font-bold">Plan {plan + 1}</div>
    </div>
    <div className="text-sm text-white/80">{title}</div>
  </div>
);

export default StakeModal;
