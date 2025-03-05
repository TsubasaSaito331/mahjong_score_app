'use client';

import Modal from '@/app/components/Modal';
import { Player, GameResult } from '@/app/lib/definitions';
import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
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
};

export default function PlayerDetailModal({
  player,
  isOpen,
  onClose,
  gameResults,
}: PlayerDetailModalProps) {
  const [scoreHistory, setScoreHistory] = useState<{
    dates: string[];
    scores: number[];
  }>({ dates: [], scores: [] });
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
    const scores: number[] = [0];
    let cumulativeScore = 0;

    playerGames.forEach((game) => {
      let score = 0;
      let rawScore = 0;

      // プレイヤーの風と得点を特定
      if (game.eastplayer === player.id) {
        rawScore = game.eastplayerscore;
      } else if (game.southplayer === player.id) {
        rawScore = game.southplayerscore;
      } else if (game.westplayer === player.id) {
        rawScore = game.westplayerscore;
      } else if (game.northplayer === player.id) {
        rawScore = game.northplayerscore;
      }

      // 順位点を計算
      const allScores = [
        game.eastplayerscore,
        game.southplayerscore,
        game.westplayerscore,
        game.northplayerscore,
      ];
      const sortedScores = [...allScores].sort((a, b) => b - a);
      const playerRank = sortedScores.indexOf(rawScore) + 1;

      // 同点の場合の処理
      const BONUS_POINTS = 5000;
      const RANKING_POINTS = [30000 + BONUS_POINTS * 4, 10000, -10000, -30000];

      if (playerRank === 1) {
        score = (rawScore + RANKING_POINTS[0] - BONUS_POINTS - 25000) / 1000;
      } else if (playerRank === 2) {
        score = (rawScore + RANKING_POINTS[1] - BONUS_POINTS - 25000) / 1000;
      } else if (playerRank === 3) {
        score = (rawScore + RANKING_POINTS[2] - BONUS_POINTS - 25000) / 1000;
      } else {
        score = (rawScore + RANKING_POINTS[3] - BONUS_POINTS - 25000) / 1000;
      }

      cumulativeScore += score;

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
      <div className="relative p-2">
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

        <div className="mb-2 rounded-lg bg-blue-50 p-2 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-blue-800">基本情報</h3>
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
          </div>
        </div>

        <div className="mb-2 rounded-lg bg-green-50 p-2 shadow-sm">
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
                  <p className="text-xs text-gray-500">データがありません</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-2 rounded-lg bg-white p-2 shadow-md">
          <h3 className="mb-1 text-sm font-semibold text-gray-800">成績推移</h3>
          {scoreHistory.dates.length > 0 ? (
            <div className="h-48">
              <Line data={chartData} options={chartOptions} plugins={plugins} />
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">対局データがありません</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
