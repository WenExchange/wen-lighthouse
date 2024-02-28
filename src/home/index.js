import { useState, useEffect, useRef, useMemo } from "react";
import * as C from "./style";
import { useWalletConnect } from "hooks/walletConnect";
import { ethers } from "ethers";
import config from "config.json";
import { Bg } from "styles/bg";
import Wallet, { DropdownItem } from "components/wallet";
import { getSigningCosmWasmClient } from "@sei-js/core";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCircleNotch, faGlobe } from "@fortawesome/free-solid-svg-icons";
import BigNumber from "bignumber.js";
import { Timer } from "components/timer";
import { GasPrice } from "@cosmjs/stargate";
import { keccak_256 } from "@noble/hashes/sha3";
import { MerkleTree } from "merkletreejs";
import { toast } from "react-hot-toast";
import MintedModal from "components/mintedModal";
import axios from "axios";
import { useSigmaAlert } from "components/SigmaAlert";
import CatChecker from "components/CatChecker";
import DannyWalletConnector from "../web3/wallet/DannyWalletConnector";
import DanyLoadingLayout from "../components/Loading/DanyLoadingLayout";
import useWOPCollectionData from "../web3/hooks/WenOGPassNFT/ReadOnly/useWOPCollectionData";
import useDanyDidMount from "../hooks/walletConnect/helper/useDanyDidMount";
import { getMerkleRoot } from "../web3/utils/getMerkleRoot";
import useWOPBalanceOf from "web3/hooks/WenOGPassNFT/ReadOnly/useWOPBalanceOf";
import useETHBalance from "../web3/hooks/ETH/useETHBalance";
import useWOPMint from "../web3/hooks/WenOGPassNFT/useWOPMint";

const LIGHTHOUSE_CONTRACT_ATLANTIC_2 =
  "sei12gjnfdh2kz06qg6e4y997jfgpat6xpv9dw58gtzn6g75ysy8yt5snzf4ac";
const LIGHTHOUSE_CONTRACT_PACIFIC_1 =
  "sei1hjsqrfdg2hvwl3gacg4fkznurf36usrv7rkzkyh29wz3guuzeh0snslz7d";

const getLighthouseContract = (network) => {
  if (network === "pacific-1") {
    return LIGHTHOUSE_CONTRACT_PACIFIC_1;
  } else if (network === "atlantic-2") {
    return LIGHTHOUSE_CONTRACT_ATLANTIC_2;
  } else if (network === "sei-chain") {
    return "sei1j5uc8aly825mnjl0napky8nxnnkmcqpl2lx8dud29xyhw2dmr24s6lquut";
  } else {
    throw new Error("Invalid network");
  }
};

var phaseTimer = {};
var interval = null;
var phaseSwitch = false;

const Home = () => {
  // const {
  //   openWalletConnect: connectWallet,
  //   wallet,
  //   address,
  //   disconnectWallet
  // } = useWalletConnect();

  const {
    wallet,
    address,
    isWalletConnected,
    connectWallet,
    disconnectWallet
  } = DannyWalletConnector.useContainer();

  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState(null);
  const [phases, setPhases] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [walletWhitelisted, setWalletWhitelisted] = useState(true);
  const [myMintedNfts, setMyMintedNfts] = useState([]);
  const [myMintedNftsData, setMyMintedNftsData] = useState([]);

  const [amount, setAmount] = useState(1);
  const amountInput = useRef(null);

  const [showMintedModal, setShowMintedModal] = useState(false);
  const [mintedInfo, setMintedInfo] = useState({});
  const [showMintedNfts, setShowMintedNfts] = useState(false);
  // const [balance, setBalance] = useState("");

  const {
    collectionData,

    isLoadingCollectionData,
    isCallSuccessCollectionData: isCallSuccess,

    fetchCollectionData
  } = useWOPCollectionData();

  const {
    nftBalance,
    isLoadingNFTBalance,
    isCallSuccessNFTBalance,
    displayNFTBalance,
    fetchNFTBalance
  } = useWOPBalanceOf();

  const {
    ethBalance,
    weiETHBalance,
    ethBalanceCallState,
    isLoadingETHBalance,
    isCallSuccessETHBalance,

    numberedETHBalance: balance,
    displayETHBalance,
    displayNumberFormatETHBalance: displayNumberFormat,

    fetchETHBalance
  } = useETHBalance();

  const {
    isCallSuccessWOPMint,
    isLoadingWOPMint,

    /** Tx */
    fetchWOPMint
  } = useWOPMint();
  useEffect(() => {
    refresh();
    // clearInterval(interval);
    // interval = setInterval(() => {
    //   refresh();
    // }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [wallet]);

  useDanyDidMount(() => {
    fetchCollectionData();
    const root = getMerkleRoot();
    console.log(555, "root", root);
  });

  useDanyDidMount(() => {
    setLoading(isLoadingCollectionData);
  }, [isLoadingCollectionData]);

  const refresh = async () => {
    const collectionData = await fetchCollectionData();
    console.log(444, "collectionData", collectionData);

    setCollection(collectionData);
    managePhases(collectionData.phases);
    refreshMyMintedNfts();
  };

  const refreshMyMintedNfts = async () => {
    if (wallet === null) {
      setMyMintedNfts([]);
      return;
    }
    fetchETHBalance();

    const balanceCount = await fetchNFTBalance(address);
    setMyMintedNfts(balanceCount > 0 ? [0] : []);
  };

  const managePhases = (phases) => {
    let currentPhase = null;

    for (let i = 0; i < phases.length; i++) {
      let phase = phases[i];

      phase.start_time *= 1000;
      phase.end_time = phase.end_time === 0 ? 0 : phase.end_time * 1000;

      let start = new Date(phase.start_time);
      let end = new Date(phase.end_time);
      let now = new Date();

      if (phase.end_time === 0) end = new Date(32503680000000);

      if (end.getTime() - start.getTime() > 31536000000) phases[i].noend = true;
      else phases[i].noend = false;

      if (now > start && now < end) currentPhase = phase;
    }

    if (currentPhase === null) {
      let closest = null;
      for (let i = 0; i < phases.length; i++) {
        let phase = phases[i];
        let start = new Date(phase.start_time);

        if (closest === null) closest = phase;
        else {
          let closestStart = new Date(closest.start_time);
          if (start < closestStart) closest = phase;
        }
      }

      currentPhase = closest;
    }

    //order phases by start date
    phases.sort((a, b) => {
      let aStart = new Date(a.start_time);
      let bStart = new Date(b.start_time);

      if (aStart < bStart) {
        return -1;
      } else if (aStart > bStart) {
        return 1;
      } else {
        return 0;
      }
    });

    if (phaseTimer.name !== currentPhase.name) {
      if (phaseTimer.timeout) clearTimeout(phaseTimer.timeout);

      const now = new Date();
      const start = new Date(currentPhase.start_time);
      const end = new Date(currentPhase.end_time);

      phaseTimer.name = currentPhase.name;

      if (now > start && now < end) {
        if (end.getTime() - now.getTime() < 31536000000) {
          phaseTimer.timeout = setTimeout(() => {
            refresh();
            phaseTimer.timeout = null;
            phaseTimer.name = null;
          }, new Date(currentPhase.end_time).getTime() - new Date().getTime());
        } else {
          currentPhase.noend = true;
        }
      } else if (now < start) {
        phaseTimer.timeout = setTimeout(() => {
          managePhases(phases);
          refresh();
          phaseTimer.timeout = null;
          phaseTimer.name = null;
        }, new Date(currentPhase.start_time).getTime() - new Date().getTime());
      } else if (now > end) {
        //past phase
      }
    }

    setPhases(phases);
    if (!phaseSwitch) {
      manageWhitelist(currentPhase);
      setCurrentPhase(currentPhase);
    }
  };

  const manageWhitelist = (currentPhase) => {
    if (wallet !== null) {
      if (
        typeof currentPhase.allowlist !== "undefined" &&
        currentPhase.allowlist !== null
      ) {
        let allowlist = currentPhase.allowlist.find(
          (a) => a?.toLowerCase() === address?.toLowerCase()
        );
        if (allowlist) {
          setWalletWhitelisted(true);
        } else {
          setWalletWhitelisted(false);
        }
      } else {
        setWalletWhitelisted(true);
      }
    } else {
      setWalletWhitelisted(true);
    }
  };

  const switchPhase = (phase) => {
    if (
      (!phase.noend && new Date(phase.end_time) < new Date()) ||
      phase.name === currentPhase.name
    )
      return;

    setCurrentPhase(phase);
    manageWhitelist(phase);
    phaseSwitch = true;
  };

  const mint = async () => {
    if (wallet === null) return connectWallet();

    //check if amount is larger than max tokens
    if (currentPhase.max_tokens > 0 && amount > currentPhase.max_tokens) {
      toast.error(
        "You can only mint " + currentPhase.max_tokens + " tokens per wallet"
      );
      return;
    }

    //check if amount is larger than remaining tokens
    if (amount > collection.supply - collection.mintedSupply) {
      toast.error(
        "There are only " +
          (collection.supply - collection.mintedSupply) +
          " tokens left"
      );
      return;
    }

    //check if current phase is active
    if (new Date(currentPhase.start_time) > new Date()) {
      toast.error("This phase has not started yet");
      return;
    }

    //check if current phase has ended
    if (!currentPhase.noend && new Date(currentPhase.end_time) < new Date()) {
      toast.error("This phase has ended");
      return;
    }

    //load client
    // const client = await getSigningCosmWasmClient(
    //   config.rpc,
    //   wallet.offlineSigner,
    //   {
    //     gasPrice: GasPrice.fromString("0.01usei")
    //   }
    // );

    // let lighthouseConfig = await client.queryContractSmart(
    //   getLighthouseContract(config.network),
    //   { get_config: {} }
    // );

    //check if wallet have enough balance

    let merkleProof = null;
    let hashedAddress = null;

    if (currentPhase.merkle_root !== "" && currentPhase.merkle_root !== null) {
      const { keccak256 } = ethers;
      let leaves = currentPhase.allowlist.map((addr) => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      console.log(333, "merkleTree", merkleTree);

      hashedAddress = keccak256(address);
      console.log(333, "hashedAddress", hashedAddress);
      merkleProof = merkleTree.getHexProof(hashedAddress);
      console.log(333, "merkleProof", merkleProof);
    }

    try {
      const receipt = await fetchWOPMint([`\'${merkleProof}\'`]);

      // let tokenIds = [];

      // const logs = mintReceipt.logs;
      // for (const log of logs) {
      //   const events = log.events;
      //   for (const event of events) {
      //     if (event.type === "wasm") {
      //       // Find the attribute with the key 'collection'
      //       for (const attribute of event.attributes) {
      //         if (attribute.key === "token_id") {
      //           tokenIds.push(attribute.value);
      //           break;
      //         }
      //       }
      //     }
      //   }
      // }

      console.log(444, "receipt", receipt);

      refresh();
      refreshMyMintedNfts();

      let tokenIds = [0];
      loadNowMintedMetadata(tokenIds)
        .then((metadata) => {
          setMintedInfo({ mints: metadata });
          setShowMintedModal(true);
        })
        .catch((e) => {
          setMintedInfo({ mints: tokenIds });
          setShowMintedModal(true);
          console.log(e);
        });
    } catch (e) {
      toast.dismiss(loading);
      if (e.message.includes("Max Tokens Minted"))
        toast.error(
          "You can only mint " +
            currentPhase.max_tokens +
            " tokens per wallet for this phase"
        );
      else if (e.message !== "Transaction declined") toast.error("Mint failed");

      console.log(e);
    }
  };

  const loadNowMintedMetadata = async (mints) =>
    new Promise(async (resolve, reject) => {
      let metadata = [];
      let promises = [];

      if (!collection.hidden_metadata) {
        if (!collection.iterated_uri) {
          for (let i = 0; i < mints.length; i++) {
            promises.push(
              axios
                .get(`${collection.tokenUri}/${mints[i]}`)
                .then((response) => response.data)
            );
          }

          Promise.all(promises)
            .then((results) => {
              //merge with myMintedNfts
              mints.forEach((mint, index) => {
                metadata.push({
                  mint: mint,
                  data: results[index]
                });
              });

              resolve(metadata);
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          let tokenurimetadata = await axios
            .get(collection.tokenUri)
            .then((response) => response.data);

          for (let i = 0; i < mints.length; i++) {
            metadata.push({
              mint: mints[i],
              data: {
                ...tokenurimetadata,
                name: collection.name + " #" + mints[i]
              }
            });
          }

          resolve(metadata);
        }
      } else {
        let placeholder_metadata = await axios
          .get(collection.placeholder_token_uri)
          .then((response) => response.data);

        for (let i = 0; i < mints.length; i++) {
          metadata.push({
            mint: mints[i],
            data: {
              ...placeholder_metadata,
              name: collection.name + " #" + mints[i]
            }
          });
        }

        resolve(metadata);
      }
    });

  const loadMinted = async () => {
    setLoading(true);
    setShowMintedNfts(true);
    setMyMintedNftsData([]);

    let metadata = [];
    let promises = [];

    if (!collection.hidden_metadata) {
      if (!collection.iterated_uri) {
        for (let i = 0; i < myMintedNfts.length; i++) {
          promises.push(
            axios
              .get(`${collection.tokenUri}/${myMintedNfts[i]}.json`) // FIXME (json)
              .then((response) => response.data)
          );
        }

        Promise.all(promises)
          .then((results) => {
            //merge with myMintedNfts
            myMintedNfts.forEach((mint, index) => {
              metadata.push({
                mint: mint,
                data: results[index]
              });
            });

            setMyMintedNftsData(metadata);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        let tokenurimetadata = await axios
          .get(collection.tokenUri)
          .then((response) => response.data);

        for (let i = 0; i < myMintedNfts.length; i++) {
          metadata.push({
            mint: myMintedNfts[i],
            data: {
              ...tokenurimetadata,
              name: collection.name + " #" + myMintedNfts[i]
            }
          });
        }

        setMyMintedNftsData(metadata);
        setLoading(false);
      }
    } else {
      let placeholder_metadata = await axios
        .get(collection.placeholder_token_uri)
        .then((response) => response.data);

      for (let i = 0; i < myMintedNfts.length; i++) {
        metadata.push({
          mint: myMintedNfts[i],
          data: {
            ...placeholder_metadata,
            name: collection.name + " #" + myMintedNfts[i]
          }
        });
      }

      setMyMintedNftsData(metadata);
      setLoading(false);
    }
  };

  /** Cat */
  const onClickCatChecker = () => {
    if (isValidChecker) {
      openCheckerPopup();
    } else {
      openConfirmPopup();
    }
  };

  /** Popups */
  const closePopup = () => {
    closeCheckerPopup();
  };
  const {
    popupComponent: CheckerPopup,
    openModal: openCheckerPopup,
    closeModal: closeCheckerPopup
  } = useSigmaAlert({
    defaultInfo: {
      title: "Role Check",
      subTitle: `Check your role`
    },
    children: <CatChecker closePopup={closePopup} phases={phases} />
    // closeOnDocumentClick: false
  });

  const {
    popupComponent: ConfirmPopup,
    openModal: openConfirmPopup,
    closeModal: closeConfirmPopup
  } = useSigmaAlert({
    defaultInfo: {
      title: "Role Check",
      subTitle: `Check your role`
    },
    children: (
      <div className="mt-[20px] font-semibold text-[24px]">
        Connect your wallet first
      </div>
    )
    // closeOnDocumentClick: false
  });

  /** Validations */

  const isValidChecker = useMemo(() => {
    return phases.length > 0 && address !== undefined;
  }, [phases, address]);

  return (
    <C.Home>
      {CheckerPopup}
      {ConfirmPopup}
      <C.Bg>
        <img
          className="w-full h-full object-cover"
          src="images/wen-mintbg.jpeg"
          alt="bg"
        />
        {/* <Bg /> */}
      </C.Bg>
      <C.Container>
        <C.Header>
          <div className="flex items-center">
            <img className="w-[153px]" src="/images/logo.png" alt="logo" />
            {/* <p className="mx-[10px] text-2xl">X</p>
            <C.Logo src="/images/logo.png" /> */}
          </div>

          <div className="flex items-center">
            <div
              className={`${
                isValidChecker
                  ? "cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              } mr-[10px] sm:text-[18px] text-[14px] sm:px-[30px] px-[10px] h-[43px] w-fit flex justify-center items-center bg-[#1A2B37] text-white  transition-all hover:scale-105  rounded-md`}
              onClick={onClickCatChecker}
            >
              <p>Role Check</p>
            </div>

            {wallet === null && (
              <C.WalletConnect
                onClick={() => {
                  connectWallet();
                }}
              >
                Connect Wallet
              </C.WalletConnect>
            )}
            {wallet !== null && (
              <Wallet balance={displayETHBalance + " ETH"} address={address}>
                <DropdownItem
                  onClick={() => navigator.clipboard.writeText(address)}
                >
                  Copy Address
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    disconnectWallet();
                    connectWallet();
                  }}
                >
                  Change Wallet
                </DropdownItem>
                <DropdownItem onClick={disconnectWallet}>
                  Disconnect
                </DropdownItem>
              </Wallet>
            )}
          </div>
        </C.Header>
        <C.Launch showMintedNfts={showMintedNfts ? "true" : "false"}>
          {loading && <DanyLoadingLayout />}

          {!loading && (
            <>
              <C.LaunchBg></C.LaunchBg>
              {!showMintedNfts && (
                <>
                  <C.LaunchInfo>
                    <C.Title>{config.name}</C.Title>
                    <C.TotalMinted>
                      <C.TotalMintedInfo>
                        <C.TotalMintedTitle>TOTAL MINTED</C.TotalMintedTitle>
                        <C.TotalMintedValue>
                          {Math.floor(
                            (collection.mintedSupply / collection.supply) *
                              100 *
                              100
                          ) / 100}
                          %{" "}
                          <span>
                            {collection.mintedSupply}/{collection.supply}
                          </span>
                        </C.TotalMintedValue>
                      </C.TotalMintedInfo>
                      <C.TotalMintedProgress
                        value={
                          Math.floor(
                            (collection.mintedSupply / collection.supply) *
                              100 *
                              100
                          ) / 100
                        }
                      ></C.TotalMintedProgress>
                    </C.TotalMinted>

                    <C.Description>{config.description}</C.Description>

                    {(config.website || config.twitter || config.discord) && (
                      <C.Links>
                        {config.website && (
                          <C.Link
                            href={config.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FontAwesomeIcon icon={faGlobe} />
                          </C.Link>
                        )}
                        {config.twitter && (
                          <C.Link
                            href={config.twitter}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FontAwesomeIcon icon={faTwitter} />
                          </C.Link>
                        )}
                        {config.discord && (
                          <C.Link
                            href={config.discord}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FontAwesomeIcon icon={faDiscord} />
                          </C.Link>
                        )}
                      </C.Links>
                    )}

                    <C.Phases>
                      {phases.map((phase, index) => (
                        <C.Phase
                          key={index}
                          active={
                            currentPhase.name === phase.name ? "true" : "false"
                          }
                          switch={
                            !(
                              !phase.noend &&
                              new Date(phase.end_time) < new Date()
                            )
                              ? "true"
                              : "false"
                          }
                          onClick={() => switchPhase(phase)}
                        >
                          <C.PhaseTop>
                            <C.PhaseTitle>{phase.name}</C.PhaseTitle>
                            {!phase.noend && (
                              <>
                                {new Date(phase.start_time) < new Date() &&
                                  new Date(phase.end_time) > new Date() && (
                                    <C.PhaseDate>
                                      <span>Ends In</span>{" "}
                                      <Timer date={phase.end_time} />
                                    </C.PhaseDate>
                                  )}
                              </>
                            )}
                            {new Date(phase.start_time) > new Date() && (
                              <C.PhaseDate>
                                <span>Starts In</span>{" "}
                                <Timer date={phase.start_time} />
                              </C.PhaseDate>
                            )}
                          </C.PhaseTop>
                          <C.PhaseBottom>
                            {phase.max_tokens > 0
                              ? phase.max_tokens + " Per Wallet •"
                              : ""}{" "}
                            {new BigNumber(phase.unit_price)
                              .div(1e6)
                              .toString()}{" "}
                            ETH
                          </C.PhaseBottom>
                          {!phase.noend &&
                            new Date(phase.end_time) < new Date() && (
                              <C.PhaseBadge>Ended</C.PhaseBadge>
                            )}
                        </C.Phase>
                      ))}
                    </C.Phases>
                  </C.LaunchInfo>
                  <C.Mid></C.Mid>
                  <C.LaunchMint>
                    <C.TitleMobile>{config.name}</C.TitleMobile>
                    <C.Image>
                      <img src="/images/launch.gif" alt="launch" />
                    </C.Image>
                    <C.MintInfo>
                      <C.Price>
                        Price:{" "}
                        <span>
                          {new BigNumber(currentPhase.unit_price)
                            .div(1e6)
                            .times(amount)
                            .toString()}{" "}
                          ETH
                        </span>
                      </C.Price>
                      {/* <C.Amount>
                        <C.AmountButton onClick={decrementAmount}>
                          &minus;
                        </C.AmountButton>
                        <C.AmountValue
                          ref={amountInput}
                          type="number"
                          step="1"
                          min={1}
                          defaultValue={1}
                          onChange={onAmountChange}
                        />
                        <C.AmountButton onClick={incrementAmount}>
                          &#43;
                        </C.AmountButton>
                      </C.Amount> */}
                    </C.MintInfo>
                    <C.MintButton
                      onClick={mint}
                      disabled={
                        walletWhitelisted === false ||
                        collection.supply - collection.mintedSupply <= 0
                      }
                    >
                      {collection.supply - collection.mintedSupply <= 0 ? (
                        <>Sold Out!</>
                      ) : (
                        <>
                          {walletWhitelisted === true
                            ? "Mint"
                            : "Not Whitelisted"}
                        </>
                      )}
                    </C.MintButton>
                    {myMintedNfts.length > 0 && (
                      <C.MintedBalance onClick={() => loadMinted()}>
                        You have minted <span>{myMintedNfts.length}</span>{" "}
                        {myMintedNfts.length === 1 ? "NFT" : "NFTs"}
                      </C.MintedBalance>
                    )}
                  </C.LaunchMint>
                </>
              )}

              {showMintedNfts && (
                <C.MintedNfts>
                  <C.MintedNftsHeader>
                    <C.GoBack onClick={() => setShowMintedNfts(false)}>
                      Back
                    </C.GoBack>
                  </C.MintedNftsHeader>
                  <C.MintedNftsBody>
                    {myMintedNftsData.map((mint, i) => (
                      <C.Nft key={i}>
                        <C.NftImage src={`${mint.data.image}`}></C.NftImage>
                        <C.NftTitle>
                          {config.nft_name_type === "token_id"
                            ? config.name + " #" + mint.mint
                            : mint.data.name}
                        </C.NftTitle>
                      </C.Nft>
                    ))}
                  </C.MintedNftsBody>
                </C.MintedNfts>
              )}
            </>
          )}
        </C.Launch>
      </C.Container>

      {showMintedModal && (
        <MintedModal
          close={() => setShowMintedModal(false)}
          name={collection.name}
          mints={mintedInfo.mints}
          tokenUri={collection.tokenUri}
        />
      )}
    </C.Home>
  );
};

export default Home;
