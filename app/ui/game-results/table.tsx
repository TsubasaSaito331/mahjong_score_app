'use client';

import { GameResult, Player } from '@/app/lib/definitions';
import { DeleteGameResult } from './buttons';
import { RegisterGame } from '@/app/ui/dashboard/buttons';

export default function GameResultTable({
  gameResults,
  players,
}: {
  gameResults: GameResult[];
  players: Player[];
}) {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const formatDate = (date: Date) => {
    const dateString = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    });
    const timeString = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
    return `${dateString}(${weekdays[date.getDay() - 1]}) ${timeString}`;
  };

  const playerName = (id: string): string | undefined => {
    return players.find((player) => player.id === id)?.name;
  };

  const BONUS_POINTS = 5000;
  const RANKING_POINTS = [30000 + BONUS_POINTS * 4, 10000, -10000, -30000];

  const calcGamePoint = (gameResult: GameResult, index: number): string => {
    const scores: number[] = [
      gameResult.eastplayerscore,
      gameResult.southplayerscore,
      gameResult.westplayerscore,
      gameResult.northplayerscore,
    ];
    const sortedScores = scores.slice().sort((a, b) => b - a);
    const rank = scores.map((score) => {
      const index = sortedScores.indexOf(score) + 1;
      const count = sortedScores.filter((s) => s === score).length;
      return count > 1 ? index + 0.5 * (count - 1) : index;
    });

    const calculatedScore =
      (scores[index] -
        25000 -
        BONUS_POINTS +
        (rank[index] === 1
          ? RANKING_POINTS[0]
          : rank[index] === 1.5
          ? (RANKING_POINTS[0] + RANKING_POINTS[1]) / 2
          : rank[index] === 2
          ? RANKING_POINTS[1]
          : rank[index] === 2.5
          ? (RANKING_POINTS[1] + RANKING_POINTS[2]) / 2
          : rank[index] === 3
          ? RANKING_POINTS[2]
          : rank[index] === 3.5
          ? (RANKING_POINTS[2] + RANKING_POINTS[3]) / 2
          : rank[index] === 4
          ? RANKING_POINTS[3]
          : 0)) /
      1000;

    return calculatedScore > 0
      ? `+${calculatedScore}pt`
      : `${calculatedScore}pt`;
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="w-full md:hidden">
            <thead className="rounded-lg text-center text-sm font-normal">
              <tr>
                <th scope="col" className="font-small px-3 py-3 sm:pl-6">
                  東家
                </th>
                <th scope="col" className="font-small px-3 py-3 sm:pl-6">
                  南家
                </th>
                <th scope="col" className="font-small px-3 py-3 sm:pl-6">
                  西家
                </th>
                <th scope="col" className="font-small px-3 py-3 sm:pl-6">
                  北家
                </th>
              </tr>
            </thead>
            {gameResults?.map((gameResult) => (
              <tbody className="border-b bg-white" key={gameResult.id}>
                <tr className="w-full py-3 text-xs last-of-type:border-none">
                  <td colSpan={4} className="whitespace-nowrap px-3 py-1">
                    <div className="flex items-center">
                      {formatDate(gameResult.date)}
                      <div className="ml-auto flex">
                        <RegisterGame
                          players={players}
                          gameResult={gameResult}
                        />
                        <DeleteGameResult gameResultId={gameResult.id} />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="w-full py-3 text-center text-xs last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap px-1 py-1">
                    {playerName(gameResult.eastplayer)}
                    <br />
                    {gameResult.eastplayerscore}
                    <br />
                    {calcGamePoint(gameResult, 0)}
                  </td>
                  <td className="whitespace-nowrap px-1 py-1">
                    {playerName(gameResult.southplayer)}
                    <br />
                    {gameResult.southplayerscore}
                    <br />
                    {calcGamePoint(gameResult, 1)}
                  </td>
                  <td className="whitespace-nowrap px-1 py-1">
                    {playerName(gameResult.westplayer)}
                    <br />
                    {gameResult.westplayerscore}
                    <br />
                    {calcGamePoint(gameResult, 2)}
                  </td>
                  <td className="whitespace-nowrap px-1 py-1">
                    {playerName(gameResult.northplayer)}
                    <br />
                    {gameResult.northplayerscore}
                    <br />
                    {calcGamePoint(gameResult, 3)}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  日付
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  東家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  南家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  西家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  北家
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {gameResults?.map((gameResult) => (
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
                    <br />
                    {calcGamePoint(gameResult, 0)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.southplayer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {gameResult.southplayerscore}
                    <br />
                    {calcGamePoint(gameResult, 1)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.westplayer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {gameResult.westplayerscore}
                    <br />
                    {calcGamePoint(gameResult, 2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {playerName(gameResult.northplayer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {gameResult.northplayerscore}
                    <br />
                    {calcGamePoint(gameResult, 3)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <RegisterGame players={players} gameResult={gameResult} />
                      <DeleteGameResult gameResultId={gameResult.id} />
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
