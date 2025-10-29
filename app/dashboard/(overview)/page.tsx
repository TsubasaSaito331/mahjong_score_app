import Search from '@/app/ui/search';
import ScoreTable from '@/app/ui/dashboard/table';
import { Suspense } from 'react';
import {
  fetchFilteredGameResults,
  fetchFilteredPlayers,
  fetchAllPlayers,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { CreatePlayer, RegisterGame } from '@/app/ui/dashboard/buttons';
import { cookies } from 'next/headers';
import Filter from '@/app/ui/dashboard/filter';
import { ScoreTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: '成績表',
};

async function ScoreData({
  query,
  currentPage,
  startDate,
  endDate,
  limit,
  bonusPoints,
  rankingPoints,
  startPoints,
}: {
  query: string;
  currentPage: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  bonusPoints: number;
  rankingPoints: number;
  startPoints: number;
}) {
  const players = await fetchFilteredPlayers(query, currentPage);
  const gameResults = (await fetchFilteredGameResults(
    query,
    currentPage,
    startDate,
    endDate,
    undefined,
    limit,
  )) as any;

  return (
    <ScoreTable
      players={players}
      gameResults={gameResults}
      bonusPoints={bonusPoints}
      rankingPoints={rankingPoints}
      startPoints={startPoints}
    />
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
    limit?: string;
    minGames?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const startDate = searchParams?.startDate;
  const endDate = searchParams?.endDate;
  const limit = Number(searchParams?.limit) || undefined;
  const minGamesParam = searchParams?.minGames;
  const title = cookies().get('userName')?.value;
  const bonusPoints = parseInt(cookies().get('BOUNUS_POINTS')?.value || '5000');
  const rankingPoints = parseInt(
    cookies().get('RANKING_POINTS')?.value || '20000',
  );
  const startPoints = parseInt(cookies().get('START_POINTS')?.value || '25000');
  const allPlayers = await fetchAllPlayers();

  const formatDate = (d?: string) => (d ? d.split('-').join('/') : '');
  let periodLabel = '';
  if (startDate && endDate) {
    periodLabel = `${formatDate(startDate)}-${formatDate(endDate)}`;
  } else if (startDate && !endDate) {
    periodLabel = `${formatDate(startDate)}以降`;
  } else if (!startDate && endDate) {
    periodLabel = `${formatDate(endDate)}以前`;
  }
  const limitLabel = searchParams?.limit ? `直近${searchParams?.limit}試合` : '';
  const minGamesLabel = minGamesParam ? `${minGamesParam}試合以上参加` : '';
  const activeLabels = [periodLabel, limitLabel, minGamesLabel].filter(Boolean) as string[];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">{title} 成績表</h1>
      </div>
      <div className="flex items-center justify-end gap-2">
        <CreatePlayer />
        <RegisterGame players={allPlayers} startPoints={startPoints} />
        <Filter />
      </div>
      {activeLabels.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
          {activeLabels.map((label) => (
            <span
              key={label}
              className="rounded-md border bg-gray-50 px-2 py-1"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <Suspense
          key={query + currentPage + startDate + endDate + limit}
          fallback={<ScoreTableSkeleton />}
        >
          <ScoreData
            query={query}
            currentPage={currentPage}
            startDate={startDate}
            endDate={endDate}
            limit={limit}
            bonusPoints={bonusPoints}
            rankingPoints={rankingPoints}
            startPoints={startPoints}
          />
        </Suspense>
      </div>
    </div>
  );
}
