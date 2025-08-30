'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateSettings } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  IdentificationIcon,
  BanknotesIcon,
  TrophyIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function EditConfigForm({
  userName,
  rankingPoints: initialRankingPoints,
  startPoints: initialStartPoints,
  bonusPoints: initialBonusPoints,
}: {
  userName: string;
  rankingPoints: string;
  startPoints: string;
  bonusPoints: string;
}) {
  const [message, dispatch] = useFormState(updateSettings, undefined);
  const [rankingPoints, setRankingPoints] = useState(
    Number(initialRankingPoints),
  );
  const [bonusPoints, setBonusPoints] = useState(Number(initialBonusPoints));
  const [startPoints, setStartPoints] = useState(Number(initialStartPoints));
  const [activeTemplate, setActiveTemplate] = useState('');

  const [rankPointDisplay, setRankPointDisplay] = useState({
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
  });

  const templates = {
    Mリーグ: { start: 25000, ranking: 20000, bonus: 5000 },
    最高位戦: { start: 30000, ranking: 20000, bonus: 0 },
    WRC: { start: 30000, ranking: 10000, bonus: 0 },
    カスタム: { start: 25000, ranking: 20000, bonus: 5000 },
  };

  const handleTemplateClick = (templateName: keyof typeof templates) => {
    const template = templates[templateName];
    setStartPoints(template.start);
    setRankingPoints(template.ranking);
    setBonusPoints(template.bonus);
    setActiveTemplate(templateName);
  };

  useEffect(() => {
    const rp = Number(rankingPoints);
    const bp = Number(bonusPoints);

    if (isNaN(rp) || isNaN(bp)) {
      setRankPointDisplay({ first: 0, second: 0, third: 0, fourth: 0 });
      return;
    }

    const first = (rp * 1.5 + bp * 4) / 1000;
    const second = (rp * 0.5) / 1000;
    const third = (rp * -0.5) / 1000;
    const fourth = (rp * -1.5) / 1000;

    setRankPointDisplay({ first, second, third, fourth });
  }, [rankingPoints, bonusPoints]);

  useEffect(() => {
    const currentValues = {
      start: startPoints,
      ranking: rankingPoints,
      bonus: bonusPoints,
    };
    if (
      JSON.stringify(currentValues) === JSON.stringify(templates['Mリーグ'])
    ) {
      setActiveTemplate('Mリーグ');
    } else if (
      JSON.stringify(currentValues) === JSON.stringify(templates['最高位戦'])
    ) {
      setActiveTemplate('最高位戦');
    } else if (
      JSON.stringify(currentValues) === JSON.stringify(templates.WRC)
    ) {
      setActiveTemplate('WRC');
    } else {
      setActiveTemplate('カスタム');
    }
  }, [startPoints, rankingPoints, bonusPoints]);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-2 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="text-md mb-2 block font-medium">
            成績表名
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={userName}
              required
            />
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        <span className="text-md font-medium">ルール設定</span>
        <div className="mt-4">
          <div className="flex rounded-lg bg-gray-200 p-1">
            {(Object.keys(templates) as (keyof typeof templates)[]).map(
              (name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleTemplateClick(name)}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    activeTemplate === name
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {name}
                </button>
              ),
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="start_points"
              className="mb-2 block text-sm font-medium"
            >
              持ち点
            </label>
            <div className="relative">
              <input
                id="start_points"
                name="start_points"
                type="number"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={startPoints}
                onChange={(e) => setStartPoints(Number(e.target.value))}
                required
              />
              <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="ranking_points"
              className="mb-2 block text-sm font-medium"
            >
              順位点
            </label>
            <div className="relative">
              <input
                id="ranking_points"
                name="ranking_points"
                type="number"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={rankingPoints}
                onChange={(e) => setRankingPoints(Number(e.target.value))}
                required
              />
              <TrophyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="bonus_points"
              className="mb-2 block text-sm font-medium"
            >
              オカ
            </label>
            <div className="relative">
              <input
                id="bonus_points"
                name="bonus_points"
                type="number"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={bonusPoints}
                onChange={(e) => setBonusPoints(Number(e.target.value))}
                required
              />
              <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4 rounded-md bg-gray-100 p-3">
            <p className="text-sm font-medium text-gray-700">
              スコアシミュレーション
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">1位</p>
                <p className="font-semibold">
                  {rankPointDisplay.first.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">2位</p>
                <p className="font-semibold">
                  {rankPointDisplay.second.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">3位</p>
                <p className="font-semibold">
                  {rankPointDisplay.third.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">4位</p>
                <p className="font-semibold">
                  {rankPointDisplay.fourth.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <SaveButton />
        </div>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {message === 'success' ? (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-500">設定を保存しました。</p>
            </>
          ) : message ? (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{message}</p>
            </>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? (
        <>
          <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
          保存中...
        </>
      ) : (
        '保存'
      )}
    </Button>
  );
}
