import React from "react";
import { useWalletConnect } from "../hooks/walletConnect";
import { shortenPublicKey } from "../utils/helpers";
import CONFIG from "../config.json";
import { Timer } from "./timer";
import * as C from "../home/style";

const ID_TYPE = {
  OG: "OG",
  WL: "WL",
  MEMBER: "MEMBER"
};

const CatChecker = ({ closePopup, phases }) => {
  const { groups } = CONFIG;
  const ogs = groups.find((group) => group.name === "og")?.allowlist;
  const wls = groups.find((group) => group.name === "wl")?.allowlist;

  const { openWalletConnect, wallet, address, disconnectWallet } =
    useWalletConnect();

  /** LifeCycle */

  /** Debounce */

  /** Event */

  /** Validations */

  /** UI */

  const idType = React.useMemo(() => {
    if (!address) return ID_TYPE.MEMBER;
    if (!ogs) return ID_TYPE.MEMBER;
    if (!wls) return ID_TYPE.MEMBER;
    if (ogs.includes(address)) return ID_TYPE.OG;
    if (wls.includes(address)) return ID_TYPE.WL;

    return ID_TYPE.MEMBER;
  }, [address, ogs, wls]);

  const displayPhase = React.useMemo(() => {
    let text = <></>;
    switch (idType) {
      case ID_TYPE.OG:
        text = (
          <div className="w-full flex flex-col">
            <p className="mr-[5px]">{`• 👑 Cat OG (max 1)`}</p>
            <p className="mr-[5px]">{`• 🐱 Cat WL (max 3)`}</p>
            <p className="mr-[5px]">{`• Public (max 3)`}</p>
          </div>
        );
        break;
      case ID_TYPE.WL:
        text = (
          <div className="w-full flex flex-col">
            <p className="mr-[5px]">{`• 🐱 Cat WL (max 3)`}</p>
            <p className="mr-[5px]">{`• Public (max 3)`}</p>
          </div>
        );

        break;

      default:
        text = (
          <div className="w-full flex flex-col">
            <p className="mr-[5px]">{`• Public (max 3)`}</p>
          </div>
        );
        break;
    }

    return (
      <div className=" flex items-center flex-col text-[14px] w-full">
        {text}
      </div>
    );
  }, [idType]);

  const display = React.useMemo(() => {
    switch (idType) {
      case ID_TYPE.OG:
        return (
          <div className="flex flex-col text-[14px]">
            <div className="my-[10px] ">{`You are [👑 Cat OG]`}</div>
            <div className="my-[10px] whitespace-pre-wrap">{`👇 You can join all following phase `}</div>
            {/* <div className="whitespace-pre-wrap mt-[10px]">{`You can join\n• OG(max 1)\n• WL(max 3)\n• Public(max 3)`}</div> */}
            {displayPhase}
          </div>
        );

      case ID_TYPE.WL:
        return (
          <div className="flex flex-col">
            <div className="my-[10px]">{`You are [🐱 Cat WL]`}</div>
            <div className=" whitespace-pre-wrap">{`👇 You can join all following phase `}</div>
            {displayPhase}
          </div>
        );

      default:
        return (
          <div className="flex flex-col">
            <div className="my-[10px]">{`You are Public`}</div>
            {displayPhase}
          </div>
        );
    }
  }, [idType, displayPhase]);

  return (
    <div className={`w-[80%] mt-[30px] flex flex-col text-[14px] font-thin`}>
      <div className="flex">{`Connected Address: ${shortenPublicKey(
        address
      )}`}</div>
      <div className="min-h-[10px]" />
      {display}
      <div className="mt-[20px] ">{`📌 Is there something wrong?`}</div>
      <div className="flex items-center">
        <p className="mr-[6px] ">{`✅ Open discord ticket`}</p>
        <a
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-500"
          href="https://discord.gg/seirobocat"
        >
          Discord
        </a>
      </div>
    </div>
  );
};

export default CatChecker;
