'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import { FaFilter } from 'react-icons/fa';

export default function Filter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') || '',
  );
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [customGames, setCustomGames] = useState('');
  const [customMinGames, setCustomMinGames] = useState('');
  const [activePeriod, setActivePeriod] = useState('');

  useEffect(() => {
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');

    const sDate = searchParams.get('startDate');
    const eDate = searchParams.get('endDate');
    let period = '';

    if (sDate && eDate) {
      const today = new Date();
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const thisMonthEnd = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      )
        .toISOString()
        .split('T')[0];
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      )
        .toISOString()
        .split('T')[0];
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        .toISOString()
        .split('T')[0];

      if (sDate === thisMonthStart && eDate === thisMonthEnd) {
        period = 'this_month';
      } else if (sDate === lastMonthStart && eDate === lastMonthEnd) {
        period = 'last_month';
      }
    }
    setActivePeriod(period);
  }, [searchParams]);

  const handleMonthSelect = (year: number, month: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    params.set('startDate', start.toISOString().split('T')[0]);
    params.set('endDate', end.toISOString().split('T')[0]);
    params.delete('limit');
    replace(`${pathname}?${params.toString()}`);
    setShowMonthPicker(false);
  };

  const generateMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 24; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: `${date.getFullYear()}年${date.getMonth() + 1}月`,
      });
    }
    return months;
  };

  const handleFilter = (
    type: 'this_month' | 'last_month' | 'custom',
    sDate?: string,
    eDate?: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('limit');
    const today = new Date();

    if (type === 'this_month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      params.set('startDate', start.toISOString().split('T')[0]);
      params.set('endDate', end.toISOString().split('T')[0]);
    } else if (type === 'last_month') {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      params.set('startDate', start.toISOString().split('T')[0]);
      params.set('endDate', end.toISOString().split('T')[0]);
    } else if (type === 'custom') {
      if (sDate) {
        params.set('startDate', sDate);
      } else {
        params.delete('startDate');
      }
      if (eDate) {
        params.set('endDate', eDate);
      } else {
        params.delete('endDate');
      }
    }

    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleGameCountFilter = (count: number | string) => {
    if (!count) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(count));
    params.delete('startDate');
    params.delete('endDate');
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleMinGamesFilter = (count: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (count) {
      params.set('minGames', String(count));
    } else {
      params.delete('minGames');
    }
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    handleFilter('custom', newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    handleFilter('custom', startDate, newEndDate);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('startDate');
    params.delete('endDate');
    params.delete('limit');
    params.delete('minGames');
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const limit = searchParams.get('limit');
  const minGames = searchParams.get('minGames');
  const sDateParam = searchParams.get('startDate');
  const eDateParam = searchParams.get('endDate');

  const formatDate = (d?: string | null) =>
    d ? d.split('-').join('/') : '';

  let periodLabel = '';
  if (sDateParam && eDateParam) {
    periodLabel = `${formatDate(sDateParam)}-${formatDate(eDateParam)}`;
  } else if (sDateParam && !eDateParam) {
    periodLabel = `${formatDate(sDateParam)}以降`;
  } else if (!sDateParam && eDateParam) {
    periodLabel = `${formatDate(eDateParam)}以前`;
  }
  const activeClass = 'bg-blue-100 text-blue-700 border-blue-500';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-8 items-center rounded-lg bg-blue-600 px-2 text-xs font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <FaFilter className="h-4 w-4" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">期間</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handleFilter('this_month')}
                className={`rounded-md border px-2 py-1 hover:bg-gray-100 ${activePeriod === 'this_month' ? activeClass : ''
                  }`}
              >
                今月
              </button>
              <button
                onClick={() => handleFilter('last_month')}
                className={`rounded-md border px-2 py-1 hover:bg-gray-100 ${activePeriod === 'last_month' ? activeClass : ''
                  }`}
              >
                先月
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="rounded-md border px-2 py-1 hover:bg-gray-100"
                >
                  月指定
                </button>
                {showMonthPicker && (
                  <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-48 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <ul className="py-1">
                      {generateMonths().map(({ year, month, label }) => (
                        <li key={label}>
                          <button
                            onClick={() => handleMonthSelect(year, month)}
                            className="block w-full px-4 py-1 text-left text-gray-700 hover:bg-gray-100"
                          >
                            {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <div>
                <label htmlFor="startDate" className="block text-xs">
                  開始日
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-1 shadow-sm sm:text-sm"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="endDate" className="block text-xs">
                  終了日
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-1 shadow-sm sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="font-medium text-gray-700">直近の試合数</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handleGameCountFilter(50)}
                className={`rounded-md border px-2 py-1  hover:bg-gray-100 ${limit === '50' ? activeClass : ''
                  }`}
              >
                50戦
              </button>
              <button
                onClick={() => handleGameCountFilter(100)}
                className={`rounded-md border px-2 py-1  hover:bg-gray-100 ${limit === '100' ? activeClass : ''
                  }`}
              >
                100戦
              </button>
              <button
                onClick={() => handleGameCountFilter(200)}
                className={`rounded-md border px-2 py-1  hover:bg-gray-100 ${limit === '200' ? activeClass : ''
                  }`}
              >
                200戦
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                value={customGames}
                onChange={(e) => setCustomGames(e.target.value)}
                placeholder="指定"
                className="block w-24 rounded-md border-gray-300 py-1 shadow-sm sm:text-sm"
              />
              <button
                onClick={() => handleGameCountFilter(Number(customGames))}
                className="rounded-md border px-2 py-1  hover:bg-gray-100"
              >
                適用
              </button>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="font-medium text-gray-700">最低試合数</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handleMinGamesFilter(5)}
                className={`rounded-md border px-2 py-1  hover:bg-gray-100 ${minGames === '5' ? activeClass : ''
                  }`}
              >
                5戦
              </button>
              <button
                onClick={() => handleMinGamesFilter(10)}
                className={`rounded-md border px-2 py-1  hover:bg-gray-100 ${minGames === '10' ? activeClass : ''
                  }`}
              >
                10戦
              </button>
              <button
                onClick={() => handleMinGamesFilter(20)}
                className={`rounded-md border px-2 py-1  hover:bg-gray-100 ${minGames === '20' ? activeClass : ''
                  }`}
              >
                20戦
              </button>
              <button
                onClick={() => handleMinGamesFilter(30)}
                className={`rounded-md border px-2 py-1  hover:bg-gray-100 ${minGames === '30' ? activeClass : ''
                  }`}
              >
                30戦
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                value={customMinGames}
                onChange={(e) => setCustomMinGames(e.target.value)}
                placeholder="指定"
                className="block w-24 rounded-md border-gray-300 py-1 shadow-sm sm:text-sm"
              />
              <button
                onClick={() => handleMinGamesFilter(customMinGames)}
                className="rounded-md border px-2 py-1  hover:bg-gray-100"
              >
                適用
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={clearFilter}
              className="rounded-md border bg-gray-100 px-4 py-1 font-medium text-gray-700 hover:bg-gray-200"
            >
              クリア
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border bg-white px-4 py-1 font-medium text-gray-700 hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
