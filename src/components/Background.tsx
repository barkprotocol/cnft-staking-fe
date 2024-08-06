"use client";

import { FC } from "react";
import Image from "next/image";

export const Background: FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Image
        src="/images/bg.jpg"
        layout="fill"
        className="object-cover blur-md"
        alt=""
        priority
      />
    </div>
  );
};
