'use client';
import { FaTrash } from 'react-icons/fa';
import Modal from '@/app/components/Modal';
import { useState } from 'react';
import { deleteGame } from '@/app/lib/actions';

export function DeleteGameResult({ gameResultId }: { gameResultId: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await deleteGame(gameResultId);
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete game:', error);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg px-2 font-medium text-red-500 transition-colors"
        style={{ fontSize: '1.2rem' }}
        aria-label="ゲーム結果を削除"
      >
        <FaTrash />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className="mb-4 text-lg font-semibold">削除しますか？</h2>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setIsOpen(false)}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              削除
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
