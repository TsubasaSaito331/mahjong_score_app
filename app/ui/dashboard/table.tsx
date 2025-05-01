'use client';

import { useState } from 'react';
import { DeletePlayer, UpdatePlayer } from './buttons';
import { LuArrowDownUp } from 'react-icons/lu';
import { Player, GameResult } from '@/app/lib/definitions';
import PlayerDetailModal from './player-detail-modal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Table({
  players,
  gameResults,
}: {
  players: Player[];
  gameResults: GameResult[];
}) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>(players);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (columnName: string) => {
    switch (columnName) {
      case 'rank':
        if (sortOrder === 'desc') {
          sortedPlayers.sort((a, b) => a.rank - b.rank);
        } else {
          sortedPlayers.sort((a, b) => b.rank - a.rank);
        }
        break;
      case 'totalscore':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.totalscore - b.totalscore);
        } else {
          sortedPlayers.sort((a, b) => b.totalscore - a.totalscore);
        }
        break;
      case 'rawscore':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.rawscore - b.rawscore);
        } else {
          sortedPlayers.sort((a, b) => b.rawscore - a.rawscore);
        }
        break;
      case 'games':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.games - b.games);
        } else {
          sortedPlayers.sort((a, b) => b.games - a.games);
        }
        break;
      case 'avgRank':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getAvgRank(a) : 5;
            const ratioB = b.games != 0 ? getAvgRank(b) : 5;
            return ratioA! - ratioB!;
          });
        } else {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getAvgRank(a) : 5;
            const ratioB = b.games != 0 ? getAvgRank(b) : 5;
            return ratioB! - ratioA!;
          });
        }
        break;
      case 'firstnum':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.firstnum - b.firstnum);
        } else {
          sortedPlayers.sort((a, b) => b.firstnum - a.firstnum);
        }
        break;
      case 'secondnum':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.secondnum - b.secondnum);
        } else {
          sortedPlayers.sort((a, b) => b.secondnum - a.secondnum);
        }
        break;
      case 'thirdnum':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.thirdnum - b.thirdnum);
        } else {
          sortedPlayers.sort((a, b) => b.thirdnum - a.thirdnum);
        }
        break;
      case 'fourthnum':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.fourthnum - b.fourthnum);
        } else {
          sortedPlayers.sort((a, b) => b.fourthnum - a.fourthnum);
        }
        break;
      case 'topRatio':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getTopRatio(a) : -1;
            const ratioB = b.games != 0 ? getTopRatio(b) : -1;
            return ratioA! - ratioB!;
          });
        } else {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getTopRatio(a) : -1;
            const ratioB = b.games != 0 ? getTopRatio(b) : -1;
            return ratioB! - ratioA!;
          });
        }
        break;
      case 'winRatio':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getWinRatio(a) : -1;
            const ratioB = b.games != 0 ? getWinRatio(b) : -1;
            return ratioA! - ratioB!;
          });
        } else {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getWinRatio(a) : -1;
            const ratioB = b.games != 0 ? getWinRatio(b) : -1;
            return ratioB! - ratioA!;
          });
        }
        break;
      case 'fourthAvoidanceRatio':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getFourthAvoidanceRatio(a) : -1;
            const ratioB = b.games != 0 ? getFourthAvoidanceRatio(b) : -1;
            return ratioA! - ratioB!;
          });
        } else {
          sortedPlayers.sort((a, b) => {
            const ratioA = a.games != 0 ? getFourthAvoidanceRatio(a) : -1;
            const ratioB = b.games != 0 ? getFourthAvoidanceRatio(b) : -1;
            return ratioB! - ratioA!;
          });
        }
        break;
      case 'maxscore':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.maxscore - b.maxscore);
        } else {
          sortedPlayers.sort((a, b) => b.maxscore - a.maxscore);
        }
        break;
      case 'deposition':
        if (sortOrder === 'asc') {
          sortedPlayers.sort((a, b) => a.deposition - b.deposition);
        } else {
          sortedPlayers.sort((a, b) => b.deposition - a.deposition);
        }
        break;
      default:
        break;
    }
    toggleSortOrder();
  };

  function getAvgRank(player: any): number | null {
    if (player.games == 0) {
      return null;
    }
    const avarageRank =
      (player.firstnum +
        player.secondnum * 2 +
        player.thirdnum * 3 +
        player.fourthnum * 4) /
      player.games;
    return avarageRank;
  }

  function getTopRatio(player: any): number | null {
    if (player.games == 0) {
      return null;
    }
    const topRatio = (player.firstnum / player.games) * 100;
    return topRatio;
  }

  function getWinRatio(player: any): number | null {
    if (player.games == 0) {
      return null;
    }
    const winRatio =
      ((player.firstnum + player.secondnum) / player.games) * 100;

    return winRatio;
  }

  function getFourthAvoidanceRatio(player: any): number | null {
    if (player.games == 0) {
      return null;
    }
    const fourthAvoidanceRatio = (1 - player.fourthnum / player.games) * 100;
    return fourthAvoidanceRatio;
  }

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <div className="mt-6 flow-root max-w-full">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* モバイル用テーブル */}
          <div className="overflow-x-auto md:hidden">
            <table className="min-w-full">
              <thead className="rounded-lg text-left text-xs font-normal">
                <tr>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('rank')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      順位
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                  <th scope="col" className="font-smaill px-1 py-3 sm:pl-6">
                    プレイヤー
                  </th>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('totalscore')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      スコア
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('games')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      試合数
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('firstnum')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      1着
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('secondnum')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      2着
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('thirdnum')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      3着
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('fourthnum')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      4着
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                  <th scope="col" className="font-small px-1 py-3">
                    <button
                      onClick={() => handleSort('avgRank')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      平均着順
                    </button>
                    <LuArrowDownUp className="inline" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedPlayers?.map((player) => (
                  <tr
                    key={player.id}
                    className="w-full border-b py-3 text-xs last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap px-1 py-3">
                      {player.rank}
                    </td>
                    <td
                      className="cursor-pointer whitespace-nowrap px-1 py-3 font-medium text-blue-800 hover:border-b-2 hover:border-blue-800"
                      onClick={() => handlePlayerClick(player)}
                    >
                      {player.name}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      {player.totalscore.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      {player.games}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      {player.firstnum}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      {player.secondnum}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      {player.thirdnum}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      {player.fourthnum}
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      {getAvgRank(player)?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* デスクトップ用テーブル */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg bg-gray-100 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('rank')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      順位
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    プレイヤー
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('totalscore')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      スコア
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('rawscore')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      素点
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('games')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      試合数
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('avgRank')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      平均着順
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('firstnum')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      1着
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('secondnum')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      2着
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('thirdnum')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      3着
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('fourthnum')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      4着
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('topRatio')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      トップ率
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('winRatio')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      連帯率
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('fourthAvoidanceRatio')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      4着回避率
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('maxscore')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      最高スコア
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    <button
                      onClick={() => handleSort('deposition')}
                      className="flex items-center gap-1 transition-colors hover:text-blue-600"
                    >
                      供託
                      <LuArrowDownUp className="inline" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedPlayers?.map((player) => (
                  <tr
                    key={player.id}
                    className="w-full border-b py-3 text-sm transition-colors last-of-type:border-none hover:bg-gray-50 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.rank}
                    </td>
                    <td
                      className="cursor-pointer whitespace-nowrap px-3 py-3 font-medium text-blue-800 transition-colors hover:text-blue-600 hover:underline"
                      onClick={() => handlePlayerClick(player)}
                    >
                      {player.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.totalscore.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.rawscore.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.games}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {getAvgRank(player)?.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.firstnum}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.secondnum}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.thirdnum}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.fourthnum}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {getTopRatio(player)?.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {getWinRatio(player)?.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {getFourthAvoidanceRatio(player)?.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.maxscore !== -100000 ? player.maxscore : null}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {player.deposition}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdatePlayer
                          id={player.id}
                          name={player.name}
                          totalScore={player.totalscore}
                          rawScore={player.rawscore}
                          games={player.games}
                          firstNum={player.firstnum}
                          secondNum={player.secondnum}
                          thirdNum={player.thirdnum}
                          fourthNum={player.fourthnum}
                          maxScore={player.maxscore}
                          deposition={player.deposition}
                        />
                        <DeletePlayer id={player.id} name={player.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedPlayer && (
            <PlayerDetailModal
              player={selectedPlayer}
              isOpen={isDetailModalOpen}
              onClose={closeDetailModal}
              gameResults={gameResults}
            />
          )}
        </div>
      </div>
    </div>
  );
}
