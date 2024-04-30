import ScoreTable from '@/app/ui/dashboard/table';
import { Suspense } from 'react';
import { fetchAllPlayers, fetchFilteredGameResults } from '@/app/lib/data';
import { Metadata } from 'next';
import { RegisterGame } from '@/app/ui/dashboard/buttons';
import GameResultTable from '@/app/ui/game-results/table';

export const metadata: Metadata = {
  title: '個人成績',
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
        <h1 className="text-2xl font-bold">設定</h1>
      </div>
    </div>
  );
}
