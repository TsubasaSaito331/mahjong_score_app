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

  useEffect(() => {
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
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
    setIsOpen(false);
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
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-8 items-center rounded-lg bg-blue-600 px-2 text-xs font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <FaFilter className="h-4 w-4" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <div>
            <p className="text-sm font-medium text-gray-700">期間で絞り込み</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handleFilter('this_month')}
                className="rounded-md border p-2 text-sm hover:bg-gray-100"
              >
                今月
              </button>
              <button
                onClick={() => handleFilter('last_month')}
                className="rounded-md border p-2 text-sm hover:bg-gray-100"
              >
                先月
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="rounded-md border p-2 text-sm hover:bg-gray-100"
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
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium"
                >
                  開始日
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="endDate" className="block text-sm font-medium">
                  終了日
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium text-gray-700">
              試合数で絞り込み
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handleGameCountFilter(50)}
                className="rounded-md border p-2 text-sm hover:bg-gray-100"
              >
                50戦
              </button>
              <button
                onClick={() => handleGameCountFilter(100)}
                className="rounded-md border p-2 text-sm hover:bg-gray-100"
              >
                100戦
              </button>
              <button
                onClick={() => handleGameCountFilter(200)}
                className="rounded-md border p-2 text-sm hover:bg-gray-100"
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
                className="block w-24 rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
              <button
                onClick={() => handleGameCountFilter(Number(customGames))}
                className="rounded-md border p-2 text-sm hover:bg-gray-100"
              >
                適用
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={clearFilter}
              className="rounded-md border bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              クリア
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
