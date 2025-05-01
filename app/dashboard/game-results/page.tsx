import { Suspense } from 'react';
import { fetchAllPlayers, fetchFilteredGameResults } from '@/app/lib/data';
import { Metadata } from 'next';
import { RegisterGame, CreatePlayer } from '@/app/ui/dashboard/buttons';
import GameResultTable from '@/app/ui/game-results/table';
import Search from '@/app/ui/search';

export const metadata: Metadata = {
  title: '試合結果',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const players = await fetchAllPlayers();
  const gameResults = (await fetchFilteredGameResults(
    query,
    currentPage,
  )) as any;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">試合結果</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="プレイヤーを検索..." />
        <CreatePlayer />
        <RegisterGame players={players} />
      </div>
      <Suspense key={query + currentPage}>
        <GameResultTable gameResults={gameResults} players={players} />
      </Suspense>
    </div>
  );
}
