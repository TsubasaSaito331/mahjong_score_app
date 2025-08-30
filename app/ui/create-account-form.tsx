'use client';

import {
  IdentificationIcon,
  UserIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  BanknotesIcon,
  TrophyIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { createAccount } from '@/app/lib/actions';
import { useState, useEffect } from 'react';

export default function CreateAccountForm() {
  const [message, dispatch] = useFormState(createAccount, undefined);
  const [rankingPoints, setRankingPoints] = useState(20000);
  const [bonusPoints, setBonusPoints] = useState(5000);
  const [startPoints, setStartPoints] = useState(25000);
  const [activeTemplate, setActiveTemplate] = useState('Mリーグ');
  const [showDetails, setShowDetails] = useState(false);

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
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-2">
        <div className="w-full">
          <h2 className="text-2xl  font-bold">成績表を新規作成</h2>

          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              成績表名
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                name="name"
                placeholder="成績表名を入力"
                required
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="userId"
            >
              ユーザID
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="userId"
                type="text"
                name="userId"
                placeholder="ユーザIDを入力"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              パスワード
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="パスワードを入力"
                required
                minLength={4}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <details
            className="group mt-4"
            onToggle={(e) =>
              setShowDetails((e.target as HTMLDetailsElement).open)
            }
          >
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-md bg-gray-100 p-2 hover:bg-gray-200">
              <span className="text-sm font-medium">ルール設定</span>
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform ${
                  showDetails ? 'rotate-180' : ''
                }`}
              />
            </summary>
            <div className="mt-4">
              <div className="mb-4 mt-5 flex rounded-lg bg-gray-200 p-1">
                {(Object.keys(templates) as (keyof typeof templates)[]).map(
                  (name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleTemplateClick(name)}
                      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="start_points"
                >
                  持ち点
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="start_points"
                    type="number"
                    name="start_points"
                    placeholder="持ち点を入力"
                    value={startPoints}
                    onChange={(e) => setStartPoints(Number(e.target.value))}
                    required
                  />
                  <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="ranking_points"
                >
                  順位点
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="ranking_points"
                    type="number"
                    name="ranking_points"
                    placeholder="順位点を入力"
                    value={rankingPoints}
                    onChange={(e) => setRankingPoints(Number(e.target.value))}
                    required
                  />
                  <TrophyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="bonus_points"
                >
                  オカ
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="bonus_points"
                    type="number"
                    name="bonus_points"
                    placeholder="オカを入力"
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
          </details>
        </div>
        <CreateAccountButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function CreateAccountButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      登録
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
