import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AppLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center font-bold leading-none  text-white`}
    >
      <Image
        style={{ filter: 'invert(100%)' }}
        src="/mahjong-icon.png"
        alt="麻雀アイコン"
        width={40}
        height={40}
      />
      <p className="px-3 text-[24px]">麻雀成績管理アプリ</p>
    </div>
  );
}
