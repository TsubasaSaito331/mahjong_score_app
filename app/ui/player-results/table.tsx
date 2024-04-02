'use client';

import { useState } from 'react';
import { LuArrowDownUp } from 'react-icons/lu';
import { GameResult, Player, Result } from '@/app/lib/definitions';
import { DeletePGameResult, UpdateGameResult } from './buttons';

export default function GameResultTable({
  gameResults,
  players,
}: {
  gameResults: GameResult[];
  players: Player[];
}) {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })}(${weekdays[date.getDay()]})`;
  };

  const playerName = (id: number): string | undefined => {
    return players.find((player) => player.id === id)?.name;
  };

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedGameResults, setSortedGameResults] =
    useState<GameResult[]>(gameResults);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (columnName: string) => {
    switch (columnName) {
      case 'date':
        if (sortOrder === 'desc') {
          sortedGameResults.sort((a, b) => a.date.getTime() - b.date.getTime());
        } else {
          sortedGameResults.sort((a, b) => b.date.getTime() - a.date.getTime());
        }
      case 'eastplayerscore':
        if (sortOrder === 'desc') {
          sortedGameResults.sort(
            (a, b) => a.eastplayerscore - b.eastplayerscore,
          );
        } else {
          sortedGameResults.sort(
            (a, b) => b.eastplayerscore - a.eastplayerscore,
          );
        }
        break;
      case 'southplayerscore':
        if (sortOrder === 'desc') {
          sortedGameResults.sort(
            (a, b) => a.southplayerscore - b.southplayerscore,
          );
        } else {
          sortedGameResults.sort(
            (a, b) => b.southplayerscore - a.southplayerscore,
          );
        }
        break;
      case 'westplayerscore':
        if (sortOrder === 'desc') {
          sortedGameResults.sort(
            (a, b) => a.westplayerscore - b.westplayerscore,
          );
        } else {
          sortedGameResults.sort(
            (a, b) => b.westplayerscore - a.westplayerscore,
          );
        }
        break;
      case 'northplayerscore':
        if (sortOrder === 'desc') {
          sortedGameResults.sort(
            (a, b) => a.northplayerscore - b.northplayerscore,
          );
        } else {
          sortedGameResults.sort(
            (a, b) => b.northplayerscore - a.northplayerscore,
          );
        }
        break;

      default:
        break;
    }
    toggleSortOrder();
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="md:hidden">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  日付
                  <button onClick={() => handleSort('date')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  東家
                  <button onClick={() => handleSort('eastplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  南家
                  <button onClick={() => handleSort('southplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  西家
                  <button onClick={() => handleSort('westplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  北家
                  <button onClick={() => handleSort('northplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedGameResults?.map((gameResult) => (
                <tr
                  key={gameResult.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDate(gameResult.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.eastplayer)}
                    <br />
                    {gameResult.eastplayerscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.southplayer)}
                    <br />
                    {gameResult.southplayerscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.westplayer)}
                    <br />
                    {gameResult.westplayerscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.northplayer)}
                    <br />
                    {gameResult.northplayerscore}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateGameResult
                        gameResult={gameResult}
                        players={players}
                      />
                      <DeletePGameResult gameResult={gameResult} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  日付
                  <button onClick={() => handleSort('date')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  東家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                  <button onClick={() => handleSort('eastplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  南家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                  <button onClick={() => handleSort('southplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  西家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                  <button onClick={() => handleSort('westplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  北家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                  <button onClick={() => handleSort('northplayerscore')}>
                    <LuArrowDownUp />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedGameResults?.map((gameResult) => (
                <tr
                  key={gameResult.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDate(gameResult.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.eastplayer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {gameResult.eastplayerscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.southplayer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {gameResult.southplayerscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.westplayer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {gameResult.westplayerscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.northplayer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {gameResult.northplayerscore}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateGameResult
                        gameResult={gameResult}
                        players={players}
                      />
                      <DeletePGameResult gameResult={gameResult} />
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
