import { Metadata } from 'next';
import EditConfigForm from '@/app/ui/configPage/edit-form';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: '設定',
};

export default async function Page() {
  const userName = cookies().get('userName')?.value || '';
  const rankingPoints = cookies().get('RANKING_POINTS')?.value || '20000';
  const startPoints = cookies().get('START_POINTS')?.value || '25000';
  const bonusPoints = cookies().get('BOUNUS_POINTS')?.value || '5000';

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">設定</h1>
      </div>
      <div className="mt-4">
        <EditConfigForm
          userName={userName}
          rankingPoints={rankingPoints}
          startPoints={startPoints}
          bonusPoints={bonusPoints}
        />
      </div>
    </div>
  );
}
