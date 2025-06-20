'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Player } from '@/app/lib/definitions';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import CalendarModal from './calendar-modal';

interface FilterProps {
  players: Player[];
}

export default function GameResultFilter({ players }: FilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') || '',
  );
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(
    searchParams.get('players')?.split(',').filter(Boolean) || [],
  );
  const [isPlayerDropdownOpen, setIsPlayerDropdownOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPlayerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (startDate) {
      params.set('startDate', startDate);
    } else {
      params.delete('startDate');
    }

    if (endDate) {
      params.set('endDate', endDate);
    } else {
      params.delete('endDate');
    }

    if (selectedPlayers.length > 0) {
      params.set('players', selectedPlayers.join(','));
    } else {
      params.delete('players');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    handleFilterChange();
  }, [startDate, endDate, selectedPlayers]);

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name || '';
  };

  const handleDateRangeSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <button
            type="button"
            onClick={() => setIsCalendarModalOpen(true)}
            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
          >
            <span className="flex-1">
              {startDate || endDate ? (
                <span>
                  {startDate && formatDateForDisplay(startDate)}
                  {startDate && endDate && ' - '}
                  {endDate && formatDateForDisplay(endDate)}
                </span>
              ) : (
                <span className="text-gray-500">期間を選択</span>
              )}
            </span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsPlayerDropdownOpen(!isPlayerDropdownOpen)}
              className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <span className="block truncate">
                {selectedPlayers.length === 0
                  ? 'プレイヤーを選択'
                  : `${selectedPlayers.length}人選択済み`}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>

            {isPlayerDropdownOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {players
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((player) => (
                    <div
                      key={player.id}
                      className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-50"
                      onClick={() => handlePlayerToggle(player.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPlayers.includes(player.id)}
                          onChange={() => handlePlayerToggle(player.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 block truncate font-normal">
                          {player.name}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPlayers.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {selectedPlayers.map((playerId) => (
              <span
                key={playerId}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {getPlayerName(playerId)}
                <button
                  type="button"
                  onClick={() => handlePlayerToggle(playerId)}
                  className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-200 focus:text-blue-500 focus:outline-none"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        onDateRangeSelect={handleDateRangeSelect}
      />
    </div>
  );
}
