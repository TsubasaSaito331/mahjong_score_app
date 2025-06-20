'use client';

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate?: string;
  endDate?: string;
  onDateRangeSelect: (startDate: string, endDate: string) => void;
}

export default function CalendarModal({
  isOpen,
  onClose,
  startDate,
  endDate,
  onDateRangeSelect,
}: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    startDate ? new Date(startDate) : null,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    endDate ? new Date(endDate) : null,
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  useEffect(() => {
    if (startDate) setSelectedStartDate(new Date(startDate));
    if (endDate) setSelectedEndDate(new Date(endDate));
  }, [startDate, endDate]);

  if (!isOpen) return null;

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 月の最初の日と最後の日を取得
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // カレンダーの開始日（月曜始まり）
  const startOfCalendar = new Date(firstDayOfMonth);
  startOfCalendar.setDate(
    startOfCalendar.getDate() - ((startOfCalendar.getDay() + 6) % 7),
  );

  // カレンダーの終了日
  const endOfCalendar = new Date(lastDayOfMonth);
  endOfCalendar.setDate(
    endOfCalendar.getDate() + (6 - ((lastDayOfMonth.getDay() + 6) % 7)),
  );

  const calendarDays = [];
  const currentDate = new Date(startOfCalendar);

  while (currentDate <= endOfCalendar) {
    calendarDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // 新しい選択開始
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      // 終了日選択
      if (date < selectedStartDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(date);
      }
    }
  };

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      const start = formatDate(selectedStartDate);
      const end = formatDate(selectedEndDate);
      onDateRangeSelect(start, end);
    } else if (selectedStartDate) {
      const start = formatDate(selectedStartDate);
      onDateRangeSelect(start, start);
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onDateRangeSelect('', '');
    onClose();
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isDateInRange = (date: Date): boolean => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate && !hoveredDate) return false;

    const rangeEnd = selectedEndDate || hoveredDate;
    if (!rangeEnd) return false;

    const start = selectedStartDate < rangeEnd ? selectedStartDate : rangeEnd;
    const end = selectedStartDate < rangeEnd ? rangeEnd : selectedStartDate;

    return date >= start && date <= end;
  };

  const isDateSelected = (date: Date): boolean => {
    return Boolean(
      (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
        (selectedEndDate && date.getTime() === selectedEndDate.getTime()),
    );
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div
          className="relative w-full max-w-md rounded-lg bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">期間を選択</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* カレンダーヘッダー */}
          <div className="flex items-center justify-between border-b p-4">
            <button
              onClick={previousMonth}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-medium">
              {year}年{month + 1}月
            </h4>
            <button
              onClick={nextMonth}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* カレンダーグリッド */}
          <div className="p-4">
            {/* 曜日ヘッダー */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日付グリッド */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === month;
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = isDateSelected(date);
                const isInRange = isDateInRange(date);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    className={`
                      relative rounded-md p-2 text-sm transition-colors
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                      ${isToday ? 'font-bold' : ''}
                      ${isSelected ? 'bg-blue-600 text-white' : ''}
                      ${isInRange && !isSelected ? 'bg-blue-100' : ''}
                      ${
                        !isSelected && isCurrentMonth ? 'hover:bg-gray-100' : ''
                      }
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 選択済み期間表示 */}
          {(selectedStartDate || selectedEndDate) && (
            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
              {selectedStartDate && (
                <span>
                  開始: {selectedStartDate.toLocaleDateString('ja-JP')}
                </span>
              )}
              {selectedStartDate && selectedEndDate && (
                <span className="mx-2">-</span>
              )}
              {selectedEndDate && (
                <span>終了: {selectedEndDate.toLocaleDateString('ja-JP')}</span>
              )}
            </div>
          )}

          {/* フッター */}
          <div className="flex justify-end space-x-2 border-t p-4">
            <button
              onClick={handleClear}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              クリア
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedStartDate}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              適用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
