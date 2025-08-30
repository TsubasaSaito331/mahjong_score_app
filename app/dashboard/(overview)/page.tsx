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
}: {
  query: string;
  currentPage: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
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

  return <ScoreTable players={players} gameResults={gameResults} />;
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
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const startDate = searchParams?.startDate;
  const endDate = searchParams?.endDate;
  const limit = Number(searchParams?.limit) || undefined;
  const title = cookies().get('userName')?.value;
  const allPlayers = await fetchAllPlayers();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">{title} 成績表</h1>
        <div className="flex items-center gap-2">
          <CreatePlayer />
          <RegisterGame players={allPlayers} />
          <Filter />
        </div>
      </div>
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
          />
        </Suspense>
      </div>
    </div>
  );
}
