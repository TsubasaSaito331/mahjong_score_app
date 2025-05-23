import AppLogo from '@/app/ui/app-logo';
import LoginForm from '@/app/ui/login-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-120 md:w-120 text-white">
            <AppLogo />
          </div>
        </div>
        <LoginForm />
        <Link
          href="/create-account"
          className="flex justify-end font-medium text-blue-500  hover:text-blue-400"
        >
          成績表を新規作成
        </Link>
      </div>
    </main>
  );
}
