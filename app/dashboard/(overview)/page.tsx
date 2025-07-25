import Search from '@/app/ui/search';
import ScoreTable from '@/app/ui/dashboard/table';
import { Suspense } from 'react';
import { fetchFilteredGameResults, fetchFilteredPlayers } from '@/app/lib/data';
import { Metadata } from 'next';
import { CreatePlayer, RegisterGame } from '@/app/ui/dashboard/buttons';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: '成績表',
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
  var title = cookies().get('userName')?.value;
  var players = await fetchFilteredPlayers(query, currentPage);
  const gameResults = (await fetchFilteredGameResults(
    query,
    currentPage,
  )) as any;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">{title} 成績表</h1>
        <div className="flex items-center gap-2">
          <CreatePlayer />
          <RegisterGame players={players} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Suspense key={query + currentPage}>
          <ScoreTable players={players} gameResults={gameResults} />
        </Suspense>
      </div>
    </div>
  );
}
