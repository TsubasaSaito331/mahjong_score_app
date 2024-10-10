'use client';

import {
  IdentificationIcon,
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { createAccount } from '@/app/lib/actions';

export default function CreateAccountForm() {
  const [message, dispatch] = useFormState(createAccount, undefined);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6">
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
              htmlFor="email"
            >
              メールアドレス
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="メールアドレスを入力"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <CreateAccountButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {message === 'success' ? (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-500">Account created!</p>
            </>
          ) : message ? (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{message}</p>
            </>
          ) : null}
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
