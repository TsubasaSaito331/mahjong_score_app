"use client"
import { IoPersonAdd } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import Link from 'next/link';
import Modal from '@/app/components/Modal';
import { useState } from 'react';
import { createPlayer, deletePlayer, updatePlayer } from "@/app/lib/actions";

export function CreatePlayer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e : any) => {
    e.preventDefault();

    // プレイヤーを登録
    const formData = new FormData();
    formData.append('playerName', playerName);
    createPlayer(formData);

    setIsOpen(false);
    window.location.reload();
  };
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{ fontSize: '1.2rem' }}
      >
        <IoPersonAdd />
      </button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">プレイヤーを登録</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="名前を入力"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  )
}

export function UpdatePlayer({ id, name }: { id: any, name: any }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState(name);

  const handleSubmit = (e : any) => {
    e.preventDefault();

    // プレイヤーを登録
    const formData = new FormData();
    formData.append('id', id);
    formData.append('playerName', playerName);
    updatePlayer(formData);

    setIsOpen(false);
    setPlayerName('');
    window.location.reload();
  };
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg text-blue-500 px-2 font-medium transition-colors"
        style={{ fontSize: '1.2rem' }}
      >
        <FaPen />
      </button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">プレイヤー名を変更</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="名前を入力"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  )
}

export function DeletePlayer({ id, name }: { id: any, name: any }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = (e : any) => {
    e.preventDefault();

    deletePlayer(id);

    setIsOpen(false);
    window.location.reload();
  };
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg text-red-500 px-2 font-medium transition-colors"
        style={{ fontSize: '1.2rem' }}
      >
        <FaTrash />
      </button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{name} を削除しますか？</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                削除
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  )
}

interface Result {
  name: string;
  score: number;
}

export function RegisterGame() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Result>();

  const handleSubmit = (e : any) => {
    e.preventDefault();

    // プレイヤーを登録
    const formData = new FormData();
    formData.append('playerName', playerName);
    createPlayer(formData);

    setIsOpen(false);
    window.location.reload();
  };
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{ fontSize: '1.2rem' }}
      >
        <MdOutlinePlaylistAdd />
      </button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">プレイヤーを登録</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="名前を入力"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  )
}
