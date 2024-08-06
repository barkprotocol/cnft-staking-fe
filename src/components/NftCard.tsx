import Image from "next/image";
import { FC } from "react";
import { Nft } from "@/utils/type";
import moment from "moment";
import { DAY, PLANS } from "@/config";
import { CheckMark, LockIcon } from "./SvgIcon";

interface CardProps {
  refetch: () => void;
  nft: Nft;
  selected: Nft[];
  select: () => void;
}

const NftCard: FC<CardProps> = ({ nft, selected, select }) => {
  const { staked, mint, image, stakedAt, data, rate } = nft;

  const isSelected = selected.some((s) => s.mint === mint);

  // Calculate plan duration and lock date
  const planDuration = PLANS[`PLAN_${rate / 100_000_000 - 1}` as keyof typeof PLANS] * DAY * 1000;
  const lockDate = stakedAt + planDuration;

  // Check if the NFT is currently locked
  const isLocked = new Date().getTime() <= lockDate;

  return (
    <div
      className="relative overflow-hidden border border-gray-700 group cursor-pointer"
      onClick={select}
      role="button"
      aria-pressed={isSelected}
      aria-label={`NFT: ${data.name}, ${staked ? `Locked until ${moment(lockDate).format("DD-MM-YYYY HH:mm")}` : "Not staked"}`}
    >
      {/* Lock status badge */}
      {staked && isLocked && (
        <div
          className="absolute right-2 top-2 z-10 p-2 bg-black/70 rounded-lg"
          title={`Locked until ${moment(lockDate).format("DD-MM-YYYY HH:mm")}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              Lock <i>{moment(lockDate).fromNow()}</i>
            </span>
            <Image src="/icons/locked.svg" width={24} height={24} alt="Lock icon" />
          </div>
        </div>
      )}

      {/* NFT Image */}
      <div className="relative aspect-square">
        <Image src={image} alt={data.name} layout="fill" objectFit="cover" unoptimized />
      </div>

      {/* NFT Name */}
      <div className="p-4">
        <h5 className="text-sm text-white font-bold">{data.name}</h5>
      </div>

      {/* Plan Information */}
      {staked && (
        <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-sm">
          <div className="px-3 py-1 text-center text-white text-lg font-bold bg-black/60 rounded-lg">
            Plan <span className="text-red-700">{rate / 100_000_000}</span>
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div
          className="absolute inset-0 border border-pink-600 bg-pink-600/30 z-40"
          onClick={(e) => e.stopPropagation()} // Prevent triggering card select
        >
          <div className="absolute left-2 top-2">
            <CheckMark className="text-white" />
          </div>
        </div>
      )}

      {/* Lock Icon */}
      <div
        className={`absolute right-2 top-2 z-10 rounded w-7 h-7 bg-white/40 grid place-content-center backdrop-blur-sm ${!staked || !isLocked ? 'hidden' : ''}`}
        title={`Locked until ${moment(lockDate).format("DD-MM-YYYY HH:mm")}`}
      >
        <LockIcon fill="black" />
      </div>
    </div>
  );
};

export default NftCard;
