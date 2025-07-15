'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PlayerScore {
  name: string;
  score: number;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export default function ScoreDisplayPage() {
  const [players, setPlayers] = useState<PlayerScore[]>([
    { name: '上', score: 25000, position: 'bottom' },
    { name: '左', score: 25000, position: 'right' },
    { name: '下', score: 25000, position: 'top' },
    { name: '右', score: 25000, position: 'left' },
  ]);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(
    null,
  );

  const updateScore = (playerIndex: number, amount: number) => {
    setPlayers((prev) =>
      prev.map((player, index) =>
        index === playerIndex
          ? { ...player, score: player.score + amount }
          : player,
      ),
    );
  };

  const totalScore = players.reduce((sum, player) => sum + player.score, 0);

  const TriangleButton = ({
    direction,
    onClick,
    disabled = false,
  }: {
    direction: 'up' | 'down';
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-6 w-6 items-center justify-center ${
        disabled ? 'opacity-30' : 'opacity-100'
      }`}
    >
      {direction === 'up' ? (
        <div className="h-0 w-0 border-b-[20px] border-l-[14px] border-r-[14px] border-b-white border-l-transparent border-r-transparent"></div>
      ) : (
        <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"></div>
      )}
    </button>
  );

  const PlayerScoreDisplay = ({
    player,
    index,
  }: {
    player: PlayerScore;
    index: number;
  }) => {
    const handleScoreClick = () => {
      setSelectedPlayerIndex(selectedPlayerIndex === index ? null : index);
    };

    const getDifferenceDisplay = () => {
      if (selectedPlayerIndex === null) return player.score;

      const baseScore = players[selectedPlayerIndex].score;
      const difference = player.score - baseScore;

      if (index === selectedPlayerIndex) {
        return 'BASE';
      }

      return difference >= 0 ? `+${difference}` : `${difference}`;
    };

    const isShowingDifference = selectedPlayerIndex !== null;
    const getPositionClasses = (position: string) => {
      switch (position) {
        case 'top':
          return 'absolute top-12 left-1/2 transform -translate-x-1/2';
        case 'right':
          return 'absolute top-1/2 -right-10 transform -translate-y-1/2';
        case 'bottom':
          return 'absolute bottom-12 left-1/2 transform -translate-x-1/2';
        case 'left':
          return 'absolute top-1/2 -left-10 transform -translate-y-1/2';
        default:
          return '';
      }
    };

    const getRotationClasses = (position: string) => {
      switch (position) {
        case 'top':
          return 'rotate-180';
        case 'right':
          return 'rotate-90';
        case 'bottom':
          return '';
        case 'left':
          return '-rotate-90';
        default:
          return '';
      }
    };

    const getScoreRotationClasses = (position: string) => {
      switch (position) {
        case 'top':
          return '';
        case 'right':
          return 'rotate-180';
        case 'bottom':
          return '';
        case 'left':
          return 'rotate-180';
        default:
          return '';
      }
    };

    // 左（right）と右（left）の場合、スコアが180度回転されているため、ボタンの順番を逆にする
    const isScoreRotated =
      player.position === 'right' || player.position === 'left';

    return (
      <>
        <div
          className={`${getPositionClasses(
            player.position,
          )} ${getRotationClasses(player.position)}`}
        >
          <div className="flex flex-col items-center space-y-2">
            {!isShowingDifference && (
              <>
                {isScoreRotated ? (
                  // 左・右の場合：百、千、万の順番
                  <div className="ml-24 flex space-x-7">
                    <>
                      <TriangleButton
                        direction="up"
                        onClick={() => updateScore(index, -100)}
                      />
                      <TriangleButton
                        direction="up"
                        onClick={() => updateScore(index, -1000)}
                      />
                      <TriangleButton
                        direction="up"
                        onClick={() => updateScore(index, -10000)}
                      />
                    </>
                  </div>
                ) : (
                  // 上・下の場合：万、千、百の順番
                  <div className="mr-24 flex space-x-7">
                    <>
                      <TriangleButton
                        direction="up"
                        onClick={() => updateScore(index, 10000)}
                      />
                      <TriangleButton
                        direction="up"
                        onClick={() => updateScore(index, 1000)}
                      />
                      <TriangleButton
                        direction="up"
                        onClick={() => updateScore(index, 100)}
                      />
                    </>
                  </div>
                )}
              </>
            )}

            <div
              className={`cursor-pointer text-8xl font-bold text-white ${getScoreRotationClasses(
                player.position,
              )} ${
                isShowingDifference
                  ? 'rounded-lg px-10 py-10 hover:bg-white hover:bg-opacity-20'
                  : ''
              }`}
              onClick={handleScoreClick}
            >
              {getDifferenceDisplay()}
            </div>

            {!isShowingDifference && (
              <>
                {isScoreRotated ? (
                  // 左・右の場合：百、千、万の順番
                  <div className="ml-24 flex space-x-7">
                    <>
                      <TriangleButton
                        direction="down"
                        onClick={() => updateScore(index, +100)}
                      />
                      <TriangleButton
                        direction="down"
                        onClick={() => updateScore(index, +1000)}
                      />
                      <TriangleButton
                        direction="down"
                        onClick={() => updateScore(index, +10000)}
                      />
                    </>
                  </div>
                ) : (
                  // 上・下の場合：万、千、百の順番
                  <div className="mr-24 flex space-x-7">
                    <>
                      <TriangleButton
                        direction="down"
                        onClick={() => updateScore(index, -10000)}
                      />
                      <TriangleButton
                        direction="down"
                        onClick={() => updateScore(index, -1000)}
                      />
                      <TriangleButton
                        direction="down"
                        onClick={() => updateScore(index, -100)}
                      />
                    </>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-900">
      {/* ヘッダー */}
      <div className="flex flex-shrink-0 items-center justify-between bg-gray-800 p-4">
        <button
          onClick={() =>
            setPlayers((prev) =>
              prev.map((player) => ({ ...player, score: 25000 })),
            )
          }
          className="rounded-md bg-red-600 px-4 py-2 text-xl text-white transition-colors hover:bg-red-700"
        >
          RESET
        </button>
        <Link
          href="/dashboard"
          className="rounded-md bg-blue-600 px-4 py-2 text-lg text-white transition-colors hover:bg-blue-700"
        >
          成績表へ
        </Link>
      </div>

      {/* メインゲームエリア */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative aspect-square h-full max-h-none w-full max-w-none overflow-hidden bg-black">
          {players.map((player, index) => (
            <PlayerScoreDisplay key={index} player={player} index={index} />
          ))}
        </div>
      </div>

      {/* フッター */}
      <div className="flex-shrink-0 bg-gray-800 p-4 text-center">
        <div className="text-4xl font-bold text-white">TOTAL: {totalScore}</div>
      </div>
    </div>
  );
}
