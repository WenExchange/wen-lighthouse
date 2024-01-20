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
  const ogs = groups[0].allowlist;
  const wls = groups[1].allowlist;
  const { openWalletConnect, wallet, address, disconnectWallet } =
    useWalletConnect();

  /** LifeCycle */

  /** Debounce */

  /** Event */

  /** Validations */

  /** UI */

  const idType = React.useMemo(() => {
    if (!address) return ID_TYPE.MEMBER;
    if (ogs.includes(address)) return ID_TYPE.OG;
    if (wls.includes(address)) return ID_TYPE.WL;
    return ID_TYPE.MEMBER;
  }, [address, ogs, wls]);

  const displayPhase = React.useMemo(() => {
    let _phases = [];
    if (phases.length <= 0) return _phases;
    switch (idType) {
      case ID_TYPE.OG:
        _phases = phases;
        break;
      case ID_TYPE.WL:
        _phases = phases.filter((phase, index) => {
          return index !== 0;
        });

        break;

      default:
        _phases = phases.filter((phase, index) => index === 2);
        break;
    }

    return (
      <div className="flex items-center flex-col text-[14px]">
        {_phases.map((phase, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-between w-full"
            >
              <p className="mr-[5px]">{`• ${phase.name} (max ${phase.max_tokens})`}</p>
              {!phase.noend && (
                <>
                  {new Date(phase.start_time) < new Date() &&
                    new Date(phase.end_time) > new Date() && (
                      <div className="border-[1px] border-gray-300 p-[3px] flex items-center">
                        <span>Ends In</span> <Timer date={phase.end_time} />
                      </div>
                    )}
                </>
              )}
              {new Date(phase.start_time) > new Date() && (
                <div className="border-[1px] border-gray-300 p-[3px] flex items-center">
                  <span>Starts In</span> <Timer date={phase.start_time} />
                </div>
              )}{" "}
              {!phase.noend && new Date(phase.end_time) < new Date() && (
                <p className="border-[1px] border-gray-300 p-[3px] rounded-md">
                  Ended
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [idType, phases]);

  const display = React.useMemo(() => {
    switch (idType) {
      case ID_TYPE.OG:
        return (
          <div className="flex flex-col text-[14px]">
            <div className="my-[10px] ">{`You are [👑 Cat OG]`}</div>
            <div className="my-[10px] whitespace-pre-wrap">{`[👑 Cat OG] are VIP of our community.\n👇 You can join all following phase `}</div>
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
    <div className={` mt-[30px] flex flex-col text-[14px] font-thin`}>
      <div className="flex">{`Address: ${shortenPublicKey(address)}`}</div>
      <div className="min-h-[10px]" />
      {display}
      <div className="mt-[20px] ">{`📌 Is there something wrong?`}</div>
      <div className="flex items-center">
        <p className="mr-[6px]">{`✅ Wallet Submission at`}</p>
        <a
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-500"
          href="https://www.subber.xyz/seirobocat/wallet-collection"
        >
          Link
        </a>
      </div>
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
