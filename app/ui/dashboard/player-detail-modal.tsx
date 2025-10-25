'use client';

import Modal from '@/app/components/Modal';
import { Player, GameResult, HeadToHeadResult } from '@/app/lib/definitions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Line, Pie } from 'react-chartjs-2';
import { LuArrowDownUp } from 'react-icons/lu';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.jsの必要なコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

type PlayerDetailModalProps = {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  gameResults: GameResult[];
  allPlayers?: Player[];
  bonusPoints: number;
  rankingPoints: number;
  startPoints: number;
};

export default function PlayerDetailModal({
  player,
  isOpen,
  onClose,
  gameResults,
  allPlayers = [],
  bonusPoints,
  rankingPoints,
  startPoints,
}: PlayerDetailModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stats' | 'headToHead'>('stats');
  const [scoreHistory, setScoreHistory] = useState<{
    dates: string[];
    scores: number[];
  }>({ dates: [], scores: [] });
  const [headToHeadResults, setHeadToHeadResults] = useState<
    HeadToHeadResult[]
  >([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedHeadToHead, setSortedHeadToHead] = useState<HeadToHeadResult[]>(
    [],
  );

  const calculateGamePoints = (
    gamePlayers: { id: string; score: number }[],
  ) => {
    const sortedGamePlayers = [...gamePlayers].sort(
      (a, b) => b.score - a.score,
    );

    const RANKING_POINTS = [
      rankingPoints * 1.5 + bonusPoints * 4,
      rankingPoints * 0.5,
      rankingPoints * -0.5,
      rankingPoints * -1.5,
    ];

    const playersWithPoints: any[] = sortedGamePlayers.map((p) => ({
      ...p,
    }));

    if (playersWithPoints.length === 0) {
      return [];
    }

    let rank = 1;
    playersWithPoints[0].rank = rank;
    playersWithPoints[0].point =
      (playersWithPoints[0].score +
        RANKING_POINTS[0] -
        bonusPoints -
        startPoints) /
      1000;

    for (let i = 1; i < playersWithPoints.length; i++) {
      if (playersWithPoints[i].score === playersWithPoints[i - 1].score) {
        playersWithPoints[i].rank = rank;
        const averageRankingPoint =
          (RANKING_POINTS[rank - 1] + RANKING_POINTS[rank]) / 2;

        playersWithPoints[i].point =
          (playersWithPoints[i].score +
            averageRankingPoint -
            bonusPoints -
            startPoints) /
          1000;
        playersWithPoints[i - 1].point =
          (playersWithPoints[i - 1].score +
            averageRankingPoint -
            bonusPoints -
            startPoints) /
          1000;
        rank++;
      } else {
        rank++;
        playersWithPoints[i].rank = rank;
        playersWithPoints[i].point =
          (playersWithPoints[i].score +
            RANKING_POINTS[rank - 1] -
            bonusPoints -
            startPoints) /
          1000;
      }
    }
    return playersWithPoints;
  };

  // 平均順位を計算
  const calculateAverageRank = () => {
    if (player.games === 0) return 0;

    const totalRank =
      player.firstnum * 1 +
      player.secondnum * 2 +
      player.thirdnum * 3 +
      player.fourthnum * 4;

    return totalRank / player.games;
  };

  const averageRank = calculateAverageRank();

  // 直対成績結果を計算する関数
  const calculateHeadToHeadResults = () => {
    const opponentStats = new Map<
      string,
      {
        opponentId: string;
        opponentName: string;
        games: {
          playerRank: number;
          opponentRank: number;
          playerPoint: number;
          opponentPoint: number;
        }[];
      }
    >();

    // 該当プレイヤーが参加した試合を抽出
    const playerGames = gameResults.filter(
      (game) =>
        game.eastplayer === player.id ||
        game.southplayer === player.id ||
        game.westplayer === player.id ||
        game.northplayer === player.id,
    );

    playerGames.forEach((game) => {
      const players = [
        { id: game.eastplayer, score: game.eastplayerscore },
        { id: game.southplayer, score: game.southplayerscore },
        { id: game.westplayer, score: game.westplayerscore },
        { id: game.northplayer, score: game.northplayerscore },
      ];

      // 該当プレイヤーの情報を取得
      const playerInfo = players.find((p) => p.id === player.id);
      if (!playerInfo) return;

      const playersWithPoints = calculateGamePoints(players);
      const playerResult = playersWithPoints.find((p) => p.id === player.id);

      if (!playerResult) return;

      // 他のプレイヤーとの対戦結果を記録
      playersWithPoints.forEach((opponentResult) => {
        if (opponentResult.id === player.id) return;

        const opponentName =
          allPlayers.find((p) => p.id === opponentResult.id)?.name || '不明';

        if (!opponentStats.has(opponentResult.id)) {
          opponentStats.set(opponentResult.id, {
            opponentId: opponentResult.id,
            opponentName,
            games: [],
          });
        }

        opponentStats.get(opponentResult.id)!.games.push({
          playerRank: playerResult.rank,
          opponentRank: opponentResult.rank,
          playerPoint: playerResult.point,
          opponentPoint: opponentResult.point,
        });
      });
    });

    // 統計を計算
    const results: HeadToHeadResult[] = Array.from(opponentStats.values()).map(
      ({ opponentId, opponentName, games }) => {
        const totalGames = games.length;
        let wins = 0;
        let losses = 0;
        let draws = 0;
        let totalPointDiff = 0;

        games.forEach(
          ({ playerRank, opponentRank, playerPoint, opponentPoint }) => {
            if (playerRank < opponentRank) {
              wins++;
            } else if (playerRank > opponentRank) {
              losses++;
            } else {
              draws++;
            }
            totalPointDiff += playerPoint - opponentPoint;
          },
        );

        const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
        const pointDifference = totalPointDiff; // 既に1000で割った値なのでそのまま使用

        return {
          opponentId,
          opponentName,
          totalGames,
          wins,
          losses,
          draws,
          winRate,
          pointDifference,
        };
      },
    );

    // ポイント差でソート（差分が大きい順）
    results.sort((a, b) => b.pointDifference - a.pointDifference);

    setHeadToHeadResults(results);
    setSortedHeadToHead(results);
  };

  // ソート機能
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleOpponentClick = (opponentId: string) => {
    // 現在のプレイヤーとクリックしたプレイヤーの両方を選択してgame-resultページに移行
    const playerIds = [player.id, opponentId].join(',');
    router.push(`/dashboard/game-results?players=${playerIds}`);
  };

  const handleHeadToHeadSort = (columnName: string) => {
    const sorted = [...sortedHeadToHead];

    switch (columnName) {
      case 'totalGames':
        sorted.sort((a, b) =>
          sortOrder === 'asc'
            ? a.totalGames - b.totalGames
            : b.totalGames - a.totalGames,
        );
        break;
      case 'wins':
        sorted.sort((a, b) =>
          sortOrder === 'asc' ? a.wins - b.wins : b.wins - a.wins,
        );
        break;
      case 'losses':
        sorted.sort((a, b) =>
          sortOrder === 'asc' ? a.losses - b.losses : b.losses - a.losses,
        );
        break;
      case 'winRate':
        sorted.sort((a, b) =>
          sortOrder === 'asc' ? a.winRate - b.winRate : b.winRate - a.winRate,
        );
        break;
      case 'pointDifference':
        sorted.sort((a, b) =>
          sortOrder === 'asc'
            ? a.pointDifference - b.pointDifference
            : b.pointDifference - a.pointDifference,
        );
        break;
      default:
        break;
    }

    setSortedHeadToHead(sorted);
    toggleSortOrder();
  };

  useEffect(() => {
    // プレイヤーに関連する試合結果を日付順に並べ替え
    const playerGames = gameResults
      .filter(
        (game) =>
          game.eastplayer === player.id ||
          game.southplayer === player.id ||
          game.westplayer === player.id ||
          game.northplayer === player.id,
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // 各試合での得点を計算
    const dates: string[] = [];
    const scores: number[] = [];
    let cumulativeScore = 0;

    // 最初のゲームがある場合は、初期値として0と最初の日付を追加
    if (playerGames.length > 0) {
      const firstGame = playerGames[0];
      const formattedFirstDate = new Date(firstGame.date).toLocaleDateString(
        'ja-JP',
        {
          month: 'short',
          day: 'numeric',
        },
      );
      dates.push(formattedFirstDate);
      scores.push(0);
    }

    playerGames.forEach((game) => {
      const players = [
        { id: game.eastplayer, score: game.eastplayerscore },
        { id: game.southplayer, score: game.southplayerscore },
        { id: game.westplayer, score: game.westplayerscore },
        { id: game.northplayer, score: game.northplayerscore },
      ];

      const playersWithPoints = calculateGamePoints(players);
      const playerResult = playersWithPoints.find((p) => p.id === player.id);

      if (playerResult) {
        cumulativeScore += playerResult.point;
      }

      // 日付をフォーマット
      const formattedDate = new Date(game.date).toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
      });

      dates.push(formattedDate);
      scores.push(cumulativeScore);
    });

    setScoreHistory({ dates, scores });
  }, [player.id, gameResults]);

  // 直対成績結果を計算
  useEffect(() => {
    if (allPlayers.length > 0) {
      calculateHeadToHeadResults();
    }
  }, [player.id, gameResults, allPlayers]);

  // 順位分布の円グラフデータ
  const rankDistributionData = {
    labels: ['1位', '2位', '3位', '4位'],
    datasets: [
      {
        data: [
          player.firstnum,
          player.secondnum,
          player.thirdnum,
          player.fourthnum,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 1)', // 1位: 緑系
          'rgba(54, 162, 235, 1)', // 2位: 青系
          'rgba(255, 206, 86, 1)', // 3位: 黄系
          'rgba(255, 99, 132, 1)', // 4位: 赤系
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 円グラフのオプション
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        display: false, // 凡例を非表示に
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage =
              player.games > 0
                ? (((value as number) / player.games) * 100).toFixed(1)
                : 0;
            return `${label}: ${value}回 (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14, // フォントサイズを大きく
        },
        formatter: (value: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          const percentage =
            player.games > 0 ? ((value / player.games) * 100).toFixed(1) : 0;
          return `${label}\n${value}回\n(${percentage}%)`;
        },
        textAlign: 'center',
      },
    },
  };

  const chartData = {
    labels: scoreHistory.dates,
    datasets: [
      {
        label: '累計ポイント',
        data: scoreHistory.scores,
        borderColor: 'rgb(25, 118, 210)',
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
        borderWidth: 2,
        pointRadius: 0, // 点を非表示
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        font: {
          size: 14,
          weight: 'bold',
        },
        padding: {
          top: 5,
          bottom: 10,
        },
        color: '#333',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 11,
        },
        padding: 8,
        cornerRadius: 4,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}pt`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: false,
        },
        grid: {
          color: function (context) {
            if (context.tick.value === 0) {
              return 'rgba(0, 0, 0, 0.2)'; // 0の線を強調
            }
            return 'rgba(0, 0, 0, 0.05)';
          },
        },
        ticks: {
          font: {
            size: 10,
          },
          padding: 5,
        },
      },
      x: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 9,
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 6, // 日付の表示数を減らす
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 800,
    },
  };

  // 0を境に背景色を変更するプラグインを追加
  const backgroundColorPlugin = {
    id: 'backgroundColorPlugin',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) {
        return;
      }

      const yScale = scales.y;
      const zeroLineY = yScale.getPixelForValue(0);

      if (zeroLineY >= chartArea.top && zeroLineY <= chartArea.bottom) {
        // 0以下の領域（赤系の背景）
        ctx.fillStyle = 'rgba(255, 235, 235, 0.3)';
        ctx.fillRect(
          chartArea.left,
          zeroLineY,
          chartArea.right - chartArea.left,
          chartArea.bottom - zeroLineY,
        );

        // 0以上の領域（緑系の背景）
        ctx.fillStyle = 'rgba(235, 255, 235, 0.3)';
        ctx.fillRect(
          chartArea.left,
          chartArea.top,
          chartArea.right - chartArea.left,
          zeroLineY - chartArea.top,
        );
      }
    },
  };

  // chartOptionsにプラグインを追加（修正版）
  const plugins = [backgroundColorPlugin];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative px-0 py-2">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full p-1 text-gray-500 "
          aria-label="閉じる"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="mb-2 text-lg font-bold text-gray-800">
          {player.name}の成績詳細
        </h2>

        {/* タブ切り替えボタン */}
        <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            成績統計
          </button>
          <button
            onClick={() => setActiveTab('headToHead')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'headToHead'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            直対成績
          </button>
        </div>

        {/* 成績統計タブ */}
        {activeTab === 'stats' && (
          <>
            <div className="mb-2 rounded-lg bg-blue-50 px-0 py-2 shadow-sm">
              <h3 className="mb-1 text-sm font-semibold text-blue-800">
                基本情報
              </h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="font-medium text-gray-600">総合ポイント:</div>
                <div className="font-bold text-gray-800">
                  {player.totalscore.toFixed(1)}pt
                </div>
                <div className="font-medium text-gray-600">対局数:</div>
                <div className="font-bold text-gray-800">{player.games}回</div>
                <div className="font-medium text-gray-600">平均ポイント:</div>
                <div className="font-bold text-gray-800">
                  {player.games > 0
                    ? (player.totalscore / player.games).toFixed(1)
                    : 0}
                  pt/回
                </div>
                <div className="font-medium text-gray-600">平均順位:</div>
                <div className="font-bold text-gray-800">
                  {averageRank.toFixed(2)}位
                </div>
                {player.deposition !== 0 && (
                  <>
                    <div className="font-medium text-gray-600">供託:</div>
                    <div className="font-bold text-gray-800">
                      {player.deposition.toFixed(1)}pt
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-2 rounded-lg bg-green-50 px-0 py-2 shadow-sm">
              <h3 className="mb-1 text-sm font-semibold text-green-800">
                順位分布
              </h3>
              <div className="flex justify-center">
                <div className="h-48 w-48">
                  {player.games > 0 ? (
                    <Pie
                      data={rankDistributionData}
                      options={pieOptions as any}
                      plugins={[ChartDataLabels]}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-xs text-gray-500">
                        データがありません
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-2 rounded-lg bg-white px-0 py-2 shadow-md">
              <h3 className="mb-1 text-sm font-semibold text-gray-800">
                成績推移
              </h3>
              {scoreHistory.dates.length > 0 ? (
                <div className="h-48">
                  <Line
                    data={chartData}
                    options={chartOptions}
                    plugins={plugins}
                  />
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">
                    対局データがありません
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* 直対成績タブ */}
        {activeTab === 'headToHead' && (
          <div className="rounded-lg bg-white px-0 py-2 shadow-md">
            {sortedHeadToHead.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-1 py-2 text-left font-medium text-gray-700">
                        対戦相手
                      </th>
                      <th className="px-1 py-2 text-center font-medium text-gray-700">
                        <button
                          onClick={() => handleHeadToHeadSort('totalGames')}
                          className="flex items-center justify-center gap-0.5 hover:text-blue-600"
                        >
                          対戦数
                          <LuArrowDownUp className="inline h-2 w-2" />
                        </button>
                      </th>
                      <th className="px-1 py-2 text-center font-medium text-gray-700">
                        <button
                          onClick={() => handleHeadToHeadSort('wins')}
                          className="flex items-center justify-center gap-0.5 hover:text-blue-600"
                        >
                          勝
                          <LuArrowDownUp className="inline h-2 w-2" />
                        </button>
                      </th>
                      <th className="px-1 py-2 text-center font-medium text-gray-700">
                        <button
                          onClick={() => handleHeadToHeadSort('losses')}
                          className="flex items-center justify-center gap-0.5 hover:text-blue-600"
                        >
                          負
                          <LuArrowDownUp className="inline h-2 w-2" />
                        </button>
                      </th>
                      <th className="px-1 py-2 text-center font-medium text-gray-700">
                        <button
                          onClick={() => handleHeadToHeadSort('winRate')}
                          className="flex items-center justify-center gap-0.5 hover:text-blue-600"
                        >
                          勝率(%)
                          <LuArrowDownUp className="inline h-2 w-2" />
                        </button>
                      </th>
                      <th className="px-1 py-2 text-center font-medium text-gray-700">
                        <button
                          onClick={() =>
                            handleHeadToHeadSort('pointDifference')
                          }
                          className="flex items-center justify-center gap-0.5 hover:text-blue-600"
                        >
                          差分
                          <LuArrowDownUp className="inline h-2 w-2" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedHeadToHead.map((result) => (
                      <tr key={result.opponentId} className="hover:bg-gray-50">
                        <td className="px-1 py-2 font-medium text-gray-600">
                          <button
                            onClick={() =>
                              handleOpponentClick(result.opponentId)
                            }
                            className="rounded text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          >
                            {result.opponentName}
                          </button>
                        </td>
                        <td className="px-1 py-2 text-center">
                          {result.totalGames}
                        </td>
                        <td className="px-1 py-2 text-center text-green-600">
                          {result.wins}
                        </td>
                        <td className="px-1 py-2 text-center text-red-600">
                          {result.losses}
                        </td>
                        <td className="px-1 py-2 text-center">
                          {result.winRate.toFixed(1)}
                        </td>
                        <td
                          className={`px-1 py-2 text-center ${
                            result.pointDifference > 0
                              ? 'text-green-600'
                              : result.pointDifference < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {result.pointDifference > 0 ? '+' : ''}
                          {result.pointDifference.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">
                  直対成績データがありません
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
