'use client';
import { IoPersonAdd } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import Modal from '@/app/components/Modal';
import { useState } from 'react';
import {
  createPlayer,
  deletePlayer,
  registerGame,
  updatePlayer,
} from '@/app/lib/actions';
import { Player, Result } from '@/app/lib/definitions';

export function CreatePlayer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: any) => {
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
          <h2 className="mb-2 text-lg font-semibold">プレイヤーを登録</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="playerName"
                className="block text-sm font-medium text-gray-700"
              >
                名前
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="名前を入力"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export function UpdatePlayer({
  id,
  name,
  totalScore: initialTotalScore,
  rawScore: initialRawScore,
  games: initialGames,
  firstNum: initialFirstNum,
  secondNum: initialSecondNum,
  thirdNum: initialThirdNum,
  fourthNum: initialFourthNum,
  maxScore: initialMaxScore,
  deposition: initialDeposition,
}: {
  id: any;
  name: any;
  totalScore: number;
  rawScore: number;
  games: number;
  firstNum: number;
  secondNum: number;
  thirdNum: number;
  fourthNum: number;
  maxScore: number;
  deposition: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState(name);
  const [totalScore, setTotalScore] = useState<number>(
    parseFloat(initialTotalScore.toFixed(1)),
  );
  const [rawScore, setRawScore] = useState<number>(
    parseFloat(initialRawScore.toFixed(1)),
  );
  const [games, setGames] = useState<number>(initialGames);
  const [firstNum, setFirstNum] = useState<number>(initialFirstNum);
  const [secondNum, setSecondNum] = useState<number>(initialSecondNum);
  const [thirdNum, setThirdNum] = useState<number>(initialThirdNum);
  const [fourthNum, setFourthNum] = useState<number>(initialFourthNum);
  const [maxScore, setMaxScore] = useState<number>(initialMaxScore);
  const [deposition, setDeposition] = useState<number>(initialDeposition);

  const resetFields = () => {
    setPlayerName('');
    setTotalScore(0);
    setRawScore(0);
    setGames(0);
    setFirstNum(0);
    setSecondNum(0);
    setThirdNum(0);
    setFourthNum(0);
    setMaxScore(-100000);
    setDeposition(0);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // プレイヤーを更新
    const formData = new FormData();
    formData.append('id', id);
    formData.append('playerName', playerName);
    formData.append('totalScore', totalScore.toString());
    formData.append('rawScore', rawScore.toString());
    formData.append('games', games.toString());
    formData.append('firstNum', firstNum.toString());
    formData.append('secondNum', secondNum.toString());
    formData.append('thirdNum', thirdNum.toString());
    formData.append('fourthNum', fourthNum.toString());
    formData.append('maxScore', maxScore.toString());
    formData.append('deposition', deposition.toString());
    updatePlayer(formData);

    setIsOpen(false);
    resetFields();
    window.location.reload();
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg px-2 font-medium text-blue-500 transition-colors"
        style={{ fontSize: '1.2rem' }}
      >
        <FaPen />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetFields();
        }}
      >
        <div className="p-4">
          <h2 className="mb-2 text-lg font-semibold">成績を編集</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="playerName"
                className="block text-sm font-medium text-gray-700"
              >
                名前
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="名前を入力"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="totalScore"
                className="block text-sm font-medium text-gray-700"
              >
                スコア
              </label>
              <input
                type="number"
                id="totalScore"
                name="totalScore"
                value={totalScore}
                onChange={(e) => setTotalScore(parseFloat(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="スコアを入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="rawScore"
                className="block text-sm font-medium text-gray-700"
              >
                素点
              </label>
              <input
                type="number"
                id="rawScore"
                name="rawScore"
                value={rawScore}
                onChange={(e) => setRawScore(parseFloat(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="素点を入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="games"
                className="block text-sm font-medium text-gray-700"
              >
                ゲーム数
              </label>
              <input
                type="number"
                id="games"
                name="games"
                value={games}
                onChange={(e) => setGames(parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="ゲーム数を入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="firstNum"
                className="block text-sm font-medium text-gray-700"
              >
                1位回数
              </label>
              <input
                type="number"
                id="firstNum"
                name="firstNum"
                value={firstNum}
                onChange={(e) => setFirstNum(parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="1位の回数を入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="secondNum"
                className="block text-sm font-medium text-gray-700"
              >
                2位回数
              </label>
              <input
                type="number"
                id="secondNum"
                name="secondNum"
                value={secondNum}
                onChange={(e) => setSecondNum(parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="2位の回数を入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="thirdNum"
                className="block text-sm font-medium text-gray-700"
              >
                3位回数
              </label>
              <input
                type="number"
                id="thirdNum"
                name="thirdNum"
                value={thirdNum}
                onChange={(e) => setThirdNum(parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="3位の回数を入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="fourthNum"
                className="block text-sm font-medium text-gray-700"
              >
                4位回数
              </label>
              <input
                type="number"
                id="fourthNum"
                name="fourthNum"
                value={fourthNum}
                onChange={(e) => setFourthNum(parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="4位の回数を入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="maxScore"
                className="block text-sm font-medium text-gray-700"
              >
                最高スコア
              </label>
              <input
                type="number"
                id="maxScore"
                name="maxScore"
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="最高スコアを入力"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="deposition"
                className="block text-sm font-medium text-gray-700"
              >
                供託
              </label>
              <input
                type="number"
                id="deposition"
                name="deposition"
                value={deposition}
                onChange={(e) => setDeposition(parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border p-2"
                placeholder="供託を入力"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export function DeletePlayer({ id, name }: { id: any; name: any }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    deletePlayer(id);

    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg px-2 font-medium text-red-500 transition-colors"
        style={{ fontSize: '1.2rem' }}
      >
        <FaTrash />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <h2 className="mb-2 text-lg font-semibold">
            {name} を削除しますか？
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                削除
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export function RegisterGame({ players }: { players: Player[] }) {
  const initialResults: Result[] = [
    { id: 0, score: 0 },
    { id: 0, score: 0 },
    { id: 0, score: 0 },
    { id: 0, score: 0 },
  ];

  const labels: string[] = [
    '東家プレイヤー',
    '南家プレイヤー',
    '西家プレイヤー',
    '北家プレイヤー',
  ];

  const [totalScore, setTotalScore] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function setResult(value: any, index: number, option: string) {
    if (option == 'id') {
      results[index].id = value;
    }
    if (option == 'score') {
      results[index].score = value;
    }
    getTotalScore();
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await registerGame(results);
      if (response && response.message === 'Game registered successfully.') {
        handleClose();
        window.location.reload();
      } else {
        setErrorMessage('An unexpected error occurred.'); // 予期せぬエラー時のメッセージ
      }
    } catch (error) {
      console.error('Error registering game:', error);
      setErrorMessage('Failed to register game.'); // registerGame でエラーが発生した場合のメッセージ
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTotalScore(0);
    setResults(initialResults);
    setErrorMessage(null);
    setIsLoading(false);
  };

  function getTotalScore() {
    var totalscore = 0;
    results.map((result) => (totalscore += result.score * 100));
    setTotalScore(totalscore);
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{ fontSize: '1.2rem' }}
      >
        <MdOutlinePlaylistAdd />
      </button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-4">
          <h2 className="mb-2 text-lg font-semibold">結果を登録</h2>
          {results.map((result, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {labels[index]}
              </label>
              <select
                onChange={(e) => setResult(e.target.value, index, 'id')}
                className="mt-1 w-full rounded-md border p-2"
              >
                <option value="">名前を選択</option>
                {players.map((player, i) => (
                  <option key={i} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center">
                <input
                  type="text"
                  onChange={(e) =>
                    setResult(parseInt(e.target.value), index, 'score')
                  }
                  className="mt-1 w-full rounded-md border p-2"
                  placeholder="素点を入力"
                />
                <span className="ml-4 text-md">00</span>
              </div>
            </div>
          ))}
          <div className={totalScore !== 100000 ? 'text-red-500' : ''}>
            残：{100000 - totalScore}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`rounded-md px-4 py-2 text-white  ${totalScore === 100000 && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'cursor-not-allowed bg-gray-300'
                }`}
              onClick={(e) => handleSubmit(e)}
              disabled={totalScore !== 100000 || isLoading}
            >
              {isLoading ? '登録中' : '登録'}
            </button>
          </div>
        </div>
      </Modal>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}
