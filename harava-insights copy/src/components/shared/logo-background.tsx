"use client";

import Image from "next/image";

import HaravaLogo from "@/assets/1. Harava Insights Logo -TM.png";
import ProEdLogo from "@/assets/2. ProEd AI logo -TM.png";
import AccrediAILogo from "@/assets/3. Accredi AI logo -TM.png";
import FinSightLogo from "@/assets/4. FinSights AI Logo -TM.png";

const logoMap = {
  harava: HaravaLogo,
  proed: ProEdLogo,
  accrediai: AccrediAILogo,
  finsight: FinSightLogo,
  admin: HaravaLogo,
} as const;

type Product = keyof typeof logoMap;

interface LogoBackgroundProps {
  product: Product;
}

export function LogoBackground({ product }: LogoBackgroundProps) {
  const logo = logoMap[product];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Large centered logo - subtle pulse */}
      <div className="absolute inset-0 flex items-center justify-center animate-logo-breathe">
        <Image
          src={logo}
          alt=""
          width={500}
          height={500}
          className="w-[400px] h-[400px] object-contain opacity-[0.03] dark:opacity-[0.04] select-none"
          priority={false}
        />
      </div>

      {/* Top-right floating logo */}
      <div className="absolute -top-10 -right-10 animate-logo-float-slow">
        <Image
          src={logo}
          alt=""
          width={280}
          height={280}
          className="w-[220px] h-[220px] object-contain opacity-[0.02] dark:opacity-[0.03] blur-[0.5px] select-none"
          priority={false}
        />
      </div>

      {/* Bottom-left floating logo */}
      <div className="absolute -bottom-16 -left-16 animate-logo-float-reverse">
        <Image
          src={logo}
          alt=""
          width={320}
          height={320}
          className="w-[260px] h-[260px] object-contain opacity-[0.02] dark:opacity-[0.025] blur-[0.5px] select-none"
          priority={false}
        />
      </div>

      {/* Scattered small logos for texture */}
      <div className="absolute top-[15%] left-[10%] animate-logo-drift">
        <Image
          src={logo}
          alt=""
          width={100}
          height={100}
          className="w-[80px] h-[80px] object-contain opacity-[0.015] dark:opacity-[0.02] select-none"
          priority={false}
        />
      </div>

      <div className="absolute top-[60%] right-[12%] animate-logo-drift-alt">
        <Image
          src={logo}
          alt=""
          width={120}
          height={120}
          className="w-[100px] h-[100px] object-contain opacity-[0.015] dark:opacity-[0.02] select-none"
          priority={false}
        />
      </div>

      <div className="absolute top-[35%] right-[30%] animate-logo-drift">
        <Image
          src={logo}
          alt=""
          width={60}
          height={60}
          className="w-[50px] h-[50px] object-contain opacity-[0.01] dark:opacity-[0.015] select-none"
          priority={false}
        />
      </div>
    </div>
  );
}
