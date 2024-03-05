import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices, fetchFilteredPlayers } from '@/app/lib/data';
import { PlayersTable } from '@/app/lib/definitions';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const players = await fetchFilteredPlayers(query, currentPage);

  function getAvgRank(player: any) {
    if (player.games == 0) {
      return null;
    }
    const avarageRank = (player.firstnum + player.secondnum * 2 + player.thirdnum * 3 + player.fourthnum * 4) / player.games;
    return avarageRank;
  }

  function getTopRatio(player: any) {
    if (player.games == 0) {
      return null;
    }
    const topRatio = (player.firstnum / player.games * 100).toFixed(1);
    return topRatio;
  }

  function getWinRatio(player: any) {
    if (player.games == 0) {
      return null;
    }
    const winRatio = ((player.firstnum + player.secondnum)/ player.games * 100).toFixed(1);
    return winRatio;
  }

  function getFourthAvoidanceRatio(player: any) {
    if (player.games == 0) {
      return null;
    }
    const fourthAvoidanceRatio = ((1 - player.fourthnum / player.games) * 100).toFixed(1);
    return fourthAvoidanceRatio;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {players?.map((player) => (
              <div
                key={player.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{player.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{player.totalScore}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <UpdateInvoice id={palyer.id} />
                    <DeleteInvoice id={palyer.id} /> */}

                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  プレイヤー
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  素点
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  試合数
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  平均着順
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  1着
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  2着
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  3着
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  4着
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  トップ率
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  連帯率
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  4着回避率
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  最高スコア
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {players?.map((player) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.totalscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.rawscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.games}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {getAvgRank(player)}
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
                    {getTopRatio(player)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {getWinRatio(player)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {getFourthAvoidanceRatio(player)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.maxscore}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <UpdatePlayer id={player.id} />
                      <DeletePlayer id={player.id} /> */}
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
