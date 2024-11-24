import React, { useState, useEffect } from "react";
import "./App.css";
import Hamster from "./icons/Hamster";
import {
  binanceLogo,
  dailyCipher,
  dailyReward,
  dollarCoin,
  hamsterCoin,
  mainCharacter,
} from "./images";
import Info from "./icons/Info";
import Settings from "./icons/Settings";
import Mine from "./icons/Mine";
import Friends from "./icons/Friends";
import Coins from "./icons/Coins";

interface ClickAnimation {
  id: number;
  x: number;
  y: number;
}

interface RankConfig {
  name: string;
  threshold: number;
}

const GameInterface: React.FC = () => {
  // Rank configuration
  const rankTiers: RankConfig[] = [
    { name: "Bronze", threshold: 0 },
    { name: "Silver", threshold: 5000 },
    { name: "Gold", threshold: 25000 },
    { name: "Platinum", threshold: 100000 },
    { name: "Diamond", threshold: 1000000 },
    { name: "Epic", threshold: 2000000 },
    { name: "Legendary", threshold: 10000000 },
    { name: "Master", threshold: 50000000 },
    { name: "GrandMaster", threshold: 100000000 },
    { name: "Lord", threshold: 1000000000 },
  ];

  // State management
  const [currentRank, setCurrentRank] = useState(6);
  const [totalScore, setTotalScore] = useState(22749365);
  const [clickEffects, setClickEffects] = useState<ClickAnimation[]>([]);

  // Game constants
  const POINTS_INCREMENT = 11;
  const HOURLY_YIELD = 126420;

  // Timer states
  const [bonusTimer, setBonusTimer] = useState("");
  const [challengeTimer, setChallengeTimer] = useState("");
  const [comboTimer, setComboTimer] = useState("");

  const computeTimeRemaining = (resetHour: number): string => {
    const currentTime = new Date();
    const resetTime = new Date(currentTime);
    resetTime.setUTCHours(resetHour, 0, 0, 0);

    if (currentTime.getUTCHours() >= resetHour) {
      resetTime.setUTCDate(resetTime.getUTCDate() + 1);
    }

    const timeDiff = resetTime.getTime() - currentTime.getTime();
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateTimers = () => {
      setBonusTimer(computeTimeRemaining(0));
      setChallengeTimer(computeTimeRemaining(19));
      setComboTimer(computeTimeRemaining(12));
    };

    updateTimers();
    const timerInterval = setInterval(updateTimers, 60000);
    return () => clearInterval(timerInterval);
  }, []);

  const handlePlayerInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const bounds = element.getBoundingClientRect();
    const xOffset = e.clientX - bounds.left - bounds.width / 2;
    const yOffset = e.clientY - bounds.top - bounds.height / 2;

    element.style.transform = `perspective(1000px) rotateX(${
      -yOffset / 10
    }deg) rotateY(${xOffset / 10}deg)`;

    setTimeout(() => {
      element.style.transform = "";
    }, 100);

    setTotalScore((prev) => prev + POINTS_INCREMENT);
    setClickEffects((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: e.pageX,
        y: e.pageY,
      },
    ]);
  };

  const removeClickEffect = (id: number) => {
    setClickEffects((prev) => prev.filter((effect) => effect.id !== id));
  };

  const calculateRankProgress = (): number => {
    if (currentRank >= rankTiers.length - 1) return 100;

    const currentThreshold = rankTiers[currentRank].threshold;
    const nextThreshold = rankTiers[currentRank + 1].threshold;
    const progress =
      ((totalScore - currentThreshold) / (nextThreshold - currentThreshold)) *
      100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentThreshold = rankTiers[currentRank].threshold;
    const nextThreshold = rankTiers[currentRank + 1]?.threshold;

    if (totalScore >= nextThreshold && currentRank < rankTiers.length - 1) {
      setCurrentRank((prev) => prev + 1);
    } else if (totalScore < currentThreshold && currentRank > 0) {
      setCurrentRank((prev) => prev - 1);
    }
  }, [totalScore, currentRank]);

  const formatYield = (amount: number): string => {
    const units = [
      { value: 1e9, symbol: "B" },
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "K" },
    ];

    for (const { value, symbol } of units) {
      if (amount >= value) {
        return `+${(amount / value).toFixed(2)}${symbol}`;
      }
    }
    return `+${amount}`;
  };

  useEffect(() => {
    const yieldPerSecond = Math.floor(HOURLY_YIELD / 3600);
    const yieldInterval = setInterval(() => {
      setTotalScore((prev) => prev + yieldPerSecond);
    }, 1000);
    return () => clearInterval(yieldInterval);
  }, []);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        {/* Header Section */}
        <header className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
              <p className="text-sm">Nikandr (CEO)</p>
            </div>
          </div>

          {/* Progress and Stats Bar */}
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">{rankTiers[currentRank].name}</p>
                  <p className="text-sm">
                    {currentRank + 1}{" "}
                    <span className="text-[#95908a]">/ {rankTiers.length}</span>
                  </p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div
                      className="progress-gradient h-2 rounded-full"
                      style={{ width: `${calculateRankProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Yield Display */}
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2" />
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">
                  Profit per hour
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <img
                    src={dollarCoin}
                    alt="Dollar Coin"
                    className="w-[18px] h-[18px]"
                  />
                  <p className="text-sm">{formatYield(HOURLY_YIELD)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2" />
              <Settings className="text-white" />
            </div>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            {/* Daily Challenges Section */}
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot" />
                <img
                  src={dailyReward}
                  alt="Daily Reward"
                  className="mx-auto w-12 h-12"
                />
                <p className="text-[10px] text-center text-white mt-1">
                  Daily reward
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {bonusTimer}
                </p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot" />
                <img
                  src={dailyCipher}
                  alt="Daily Cipher"
                  className="mx-auto w-12 h-12"
                />
                <p className="text-[10px] text-center text-white mt-1">
                  Daily cipher
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {challengeTimer}
                </p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot" />
                <img
                  src={dailyReward}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
                <p className="text-[10px] text-center text-white mt-1">
                  Daily combo
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {comboTimer}
                </p>
              </div>
            </div>

            {/* Score Display */}
            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">
                  {totalScore.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Player Avatar */}
            <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-80 h-80 p-4 rounded-full circle-outer"
                onClick={handlePlayerInteraction}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img
                    src={mainCharacter}
                    alt="Main Character"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Exchange</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Mine className="w-8 h-8 mx-auto" />
          <p className="mt-1">Mine</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Friends</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </div>
      </nav>

      {/* Click Effects */}
      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${effect.y - 42}px`,
            left: `${effect.x - 28}px`,
            animation: "float 1s ease-out",
          }}
          onAnimationEnd={() => removeClickEffect(effect.id)}
        >
          {POINTS_INCREMENT}
        </div>
      ))}
    </div>
  );
};

export default GameInterface;
