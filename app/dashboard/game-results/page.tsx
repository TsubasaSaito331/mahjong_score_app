import { Suspense } from 'react';
import {
  fetchAllPlayers,
  fetchFilteredGameResults,
  fetchGameResultsPages,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { RegisterGame, CreatePlayer } from '@/app/ui/dashboard/buttons';
import GameResultTable from '@/app/ui/game-results/table';
import GameResultFilter from '@/app/ui/game-results/filter';
import Pagination from '@/app/ui/game-results/pagination';

export const metadata: Metadata = {
  title: '試合結果',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
    players?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const startDate = searchParams?.startDate;
  const endDate = searchParams?.endDate;
  const playerIds = searchParams?.players?.split(',').filter(Boolean);

  const players = await fetchAllPlayers();
  const gameResults = (await fetchFilteredGameResults(
    query,
    currentPage,
    startDate,
    endDate,
    playerIds,
  )) as any;
  const totalPages = await fetchGameResultsPages(
    query,
    startDate,
    endDate,
    playerIds,
  );

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">試合結果</h1>
      </div>
      <div className="mt-4">
        <GameResultFilter players={players} />
      </div>
      <Suspense
        key={
          query +
          currentPage +
          startDate +
          endDate +
          (playerIds?.join(',') || '')
        }
      >
        <GameResultTable gameResults={gameResults} players={players} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
