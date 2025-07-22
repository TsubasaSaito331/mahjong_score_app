'use client';

import { recalculateAllPlayersStats } from '@/app/lib/actions';
import { useState } from 'react';

export function RecalculateStats() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setMessage('再計算しています...');
    try {
      const result = await recalculateAllPlayersStats();
      if (result.message === 'All player stats recalculated successfully.') {
        setMessage('再計算が完了しました！');
      } else {
        setMessage('エラーが発生しました。');
      }
    } catch (error) {
      console.error(error);
      setMessage('エラーが発生しました。');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000); // 3秒後にメッセージを消す
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex h-10 items-center rounded-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:bg-gray-400"
      >
        {loading ? '再計算中...' : '成績再計算'}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
} 