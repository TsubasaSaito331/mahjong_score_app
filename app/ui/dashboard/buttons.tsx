'use client';
import { IoPersonAdd } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import Modal from '@/app/components/Modal';
import { useState, useEffect } from 'react';
import {
  createPlayer,
  deletePlayer,
  registerGame,
  updatePlayer,
  deleteGame,
} from '@/app/lib/actions';
import { Player, Result, GameResult } from '@/app/lib/definitions';

export function CreatePlayer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // プレイヤーを登録
      const formData = new FormData();
      formData.append('playerName', playerName);
      await createPlayer(formData);

      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating player:', error);
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className={`rounded-md ${
                  isLoading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-600'
                } px-4 py-2 text-white`}
                disabled={isLoading || !playerName.trim()}
              >
                {isLoading ? '登録中...' : '登録'}
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
    setIsOpen(false);

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

export function RegisterGame({
  players,
  gameResult,
}: {
  players: Player[];
  gameResult?: GameResult;
}) {
  const isEditMode = !!gameResult;

  // GameResultオブジェクトからResultsを作成
  const initialResults: Result[] = isEditMode
    ? [
        {
          id: gameResult!.eastplayer,
          score: gameResult!.eastplayerscore / 100,
        },
        {
          id: gameResult!.southplayer,
          score: gameResult!.southplayerscore / 100,
        },
        {
          id: gameResult!.westplayer,
          score: gameResult!.westplayerscore / 100,
        },
        {
          id: gameResult!.northplayer,
          score: gameResult!.northplayerscore / 100,
        },
      ]
    : [
        { id: '', score: NaN },
        { id: '', score: NaN },
        { id: '', score: NaN },
        { id: '', score: NaN },
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

  function calculateTotalScore(currentResults: Result[]) {
    let total = 0;
    currentResults.forEach((result) => {
      const score = Number(result.score);
      if (!isNaN(score)) {
        total += score;
      }
    });
    setTotalScore(total * 100);
  }

  useEffect(() => {
    calculateTotalScore(results);
  }, [results]);

  useEffect(() => {
    if (isOpen) {
      setResults(initialResults);
      calculateTotalScore(initialResults);
    }
  }, [isOpen]);

  function setResult(value: string, index: number, option: 'id' | 'score') {
    const newResults = [...results];
    if (option === 'id') {
      newResults[index].id = value;
    } else if (option === 'score') {
      if (value === '') {
        newResults[index].score = NaN;
      } else {
        const scoreValue = parseInt(value, 10);
        newResults[index].score = isNaN(scoreValue) ? 0 : scoreValue;
      }
    }
    setResults(newResults);
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const playerIds = results.map((r) => r.id).filter((id) => id !== '');
    if (playerIds.length !== 4) {
      setErrorMessage('プレイヤー全員を選択してください。');
      setIsLoading(false);
      return;
    }
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== 4) {
      setErrorMessage('プレイヤーが重複しています。');
      setIsLoading(false);
      return;
    }

    try {
      // 編集モードの場合、まず古いデータを削除
      if (isEditMode && gameResult) {
        await deleteGame(gameResult.id);
      }

      // 登録処理 - 編集モードの場合は元の日付を保持
      let response;
      if (isEditMode && gameResult) {
        response = await registerGame(results, gameResult.date);
      } else {
        response = await registerGame(results);
      }

      if (response && response.message === 'Game registered successfully.') {
        handleClose();
        window.location.reload();
      } else {
        setErrorMessage(response?.message || '登録に失敗しました。');
      }
    } catch (error: any) {
      console.error('Error processing game:', error);
      setErrorMessage(error.message || '登録中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setIsLoading(false);
  };

  return (
    <div>
      {isEditMode ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 items-center rounded-lg px-2 font-medium text-blue-500 transition-colors"
          style={{ fontSize: '1.2rem' }}
          aria-label="ゲーム結果を編集"
        >
          <FaPen />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          style={{ fontSize: '1.2rem' }}
        >
          <MdOutlinePlaylistAdd />
        </button>
      )}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className="mb-4 text-lg font-semibold">
            {isEditMode ? '結果を編集' : '結果を登録'}
          </h2>
          {results.map((result, index) => (
            <div key={index} className="mb-4">
              <label
                htmlFor={`player-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                {labels[index]}
              </label>
              <select
                id={`player-${index}`}
                name={`player-${index}`}
                onChange={(e) => setResult(e.target.value, index, 'id')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={result.id}
                required
              >
                <option value="">名前を選択</option>
                {players
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
              </select>
              <div className="mt-2 flex items-center">
                <label htmlFor={`score-${index}`} className="sr-only">
                  {labels[index]} スコア
                </label>
                <input
                  id={`score-${index}`}
                  name={`score-${index}`}
                  onChange={(e) => setResult(e.target.value, index, 'score')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={result.score}
                  type="number"
                  min="-100000"
                  max="100000"
                  placeholder="素点を入力"
                  required
                />
                <span className="ml-2 text-gray-500">00</span>
              </div>
            </div>
          ))}
          <div
            className={`mb-4 rounded-md p-2 text-center font-bold ${
              totalScore !== 100000
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
            role="status"
          >
            合計点: {totalScore} / 残り: {100000 - totalScore}
          </div>
          {errorMessage && (
            <div
              className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                totalScore === 100000 && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  : 'cursor-not-allowed bg-gray-400'
              }`}
              disabled={totalScore !== 100000 || isLoading}
            >
              {isLoading
                ? isEditMode
                  ? '更新中...'
                  : '登録中...'
                : isEditMode
                ? '更新'
                : '登録'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
