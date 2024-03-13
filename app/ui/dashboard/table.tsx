import { fetchFilteredPlayers } from '@/app/lib/data';
import { DeletePlayer, UpdatePlayer } from './buttons';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  var players = await fetchFilteredPlayers(query, currentPage);

  const handleSort = (columnName : string) => {
    let sortedPlayers = [...players];
  
    switch (columnName) {
      case 'プレイヤー':
        sortedPlayers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'スコア':
        sortedPlayers.sort((a, b) => a.totalscore - b.totalscore);
        break;
      case '素点':
        sortedPlayers.sort((a, b) => a.rawscore - b.rawscore);
        break;
      case '試合数':
        sortedPlayers.sort((a, b) => a.games - b.games);
        break;
      case '平均着順':
        sortedPlayers.sort((a, b) =>  {
          const ratioA = getAvgRank(a);
          const ratioB = getAvgRank(b);
          if (ratioA === null && ratioB === null) return a.name.localeCompare(b.name);
          else if (ratioA === null) return 1;
          else if (ratioB === null) return -1;
          else return ratioA - ratioB;
        });
        break;
      case '1着':
        sortedPlayers.sort((a, b) => a.firstnum - b.firstnum);
        break;
      case '2着':
        sortedPlayers.sort((a, b) => a.secondnum - b.secondnum);
        break;
      case '3着':
        sortedPlayers.sort((a, b) => a.thirdnum - b.thirdnum);
        break;
      case '4着':
        sortedPlayers.sort((a, b) => a.fourthnum - b.fourthnum);
        break;
      case 'トップ率':
        sortedPlayers.sort((a, b) =>  {
          const ratioA = getTopRatio(a);
          const ratioB = getTopRatio(b);
          if (ratioA === null && ratioB === null) return a.name.localeCompare(b.name);
          else if (ratioA === null) return 1;
          else if (ratioB === null) return -1;
          else return ratioA.localeCompare(ratioB);
        });
        break;
      case '連帯率':
        sortedPlayers.sort((a, b) =>  {
          const ratioA = getWinRatio(a);
          const ratioB = getWinRatio(b);
          if (ratioA === null && ratioB === null) return a.name.localeCompare(b.name);
          else if (ratioA === null) return 1;
          else if (ratioB === null) return -1;
          else return ratioA.localeCompare(ratioB);
        });
        break;
      case '4着回避率':
        sortedPlayers.sort((a, b) =>  {
          const ratioA = getFourthAvoidanceRatio(a);
          const ratioB = getFourthAvoidanceRatio(b);
          if (ratioA === null && ratioB === null) return a.name.localeCompare(b.name);
          else if (ratioA === null) return 1;
          else if (ratioB === null) return -1;
          else return ratioA.localeCompare(ratioB);
        });
        break;
      case '最高スコア':
        sortedPlayers.sort((a, b) => a.maxscore - b.maxscore);
        break;
      default:
        break;
    }
    players = sortedPlayers;
  }
  

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
          <table className="md:hidden">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  順位
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  プレイヤー
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  スコア
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  試合数
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
                  平均着順
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {players?.map((player, index) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.totalscore}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {player.games}
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
                    {getAvgRank(player)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePlayer id={player.id} name={player.name}/>
                      <DeletePlayer id={player.id} name={player.name}/>
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
                  順位
                </th>
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
              </tr>
            </thead>
            <tbody className="bg-white">
              {players?.map((player, index) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {index + 1}
                  </td>
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
                      <UpdatePlayer id={player.id} name={player.name}/>
                      <DeletePlayer id={player.id} name={player.name}/>
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
