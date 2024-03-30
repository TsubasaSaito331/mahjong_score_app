import Search from '@/app/ui/search';
import Table from '@/app/ui/dashboard/table';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchFilteredPlayers, fetchPlayersPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { CreatePlayer, RegisterGame } from '@/app/ui/dashboard/buttons';

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

  var players = await fetchFilteredPlayers(query, currentPage);
  const playerNames: string[] = players.map((player) => player.name);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl font-bold`}>
          競技麻雀部 成績表
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="プレイヤーを検索..." />
        <CreatePlayer />
        <RegisterGame players={playerNames} />
      </div>
      <Suspense key={query + currentPage}>
        <Table players={players} />
      </Suspense>
    </div>
  );
}
