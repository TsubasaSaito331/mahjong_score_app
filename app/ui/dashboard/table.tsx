'use client';

import { useState } from 'react';
import { DeletePlayer, UpdatePlayer } from './buttons';
import { LuArrowDownUp } from 'react-icons/lu';
import { Player } from '@/app/lib/definitions';

export default function Table({ players }: { players: Player[] }) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>(players);

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

  return (
    <div className="mt-6 flow-root max-w-full">
      <div className="inline-block align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="md:hidden">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('rank')}>
                    順位
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="font-smaill px-1 py-3 sm:pl-6">
                  プレイヤー
                </th>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('totalscore')}>
                    スコア
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('games')}>
                    試合数
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('firstnum')}>
                    1着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('secondnum')}>
                    2着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('thirdnum')}>
                    3着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('fourthnum')}>
                    4着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="font-small px-1 py-3">
                  <button onClick={() => handleSort('avgRank')}>
                    平均着順
                    <LuArrowDownUp />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedPlayers?.map((player) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-1 py-3">{player.rank}</td>
                  <td className="whitespace-nowrap px-1 py-3">{player.name}</td>
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
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('rank')}>
                    順位
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  プレイヤー
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('totalscore')}>
                    スコア
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('rawscore')}>
                    素点
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('games')}>
                    試合数
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('avgRank')}>
                    平均着順
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('firstnum')}>
                    1着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('secondnum')}>
                    2着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('thirdnum')}>
                    3着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('fourthnum')}>
                    4着
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('topRatio')}>
                    トップ率
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('winRatio')}>
                    連帯率
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('fourthAvoidanceRatio')}>
                    4着回避率
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <button onClick={() => handleSort('maxscore')}>
                    最高スコア
                    <LuArrowDownUp />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedPlayers?.map((player) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">{player.rank}</td>
                  <td className="whitespace-nowrap px-3 py-3">{player.name}</td>
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
                    {player.maxscore}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePlayer id={player.id} name={player.name} />
                      <DeletePlayer id={player.id} name={player.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
