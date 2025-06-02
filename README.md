# 麻雀成績管理アプリ

これは、Next.js App Routerコースのスターターテンプレートを基に構築された麻雀の成績管理アプリケーションです。プレイヤーの成績や対局結果を記録・管理し、個人やグループの麻雀成績を可視化できます。

## 機能

- ユーザー管理:
  - ユーザーアカウントの新規作成機能。
  - 登録済みユーザーのログイン機能。
  - ログアウト機能。
- プレイヤー管理:
  - プレイヤーの登録。
  - プレイヤー情報の編集（名前、スコア、試合数、各種順位回数、最高スコア、供託など）。
  - プレイヤーの削除 。
- 試合結果管理:
  - 対局結果の登録（東家、南家、西家、北家のプレイヤーとスコア）。合計点が100000点になる必要があり、検証機能があります 。
  - 登録済み試合結果の編集。
  - 試合結果の削除.
- 成績表示:
  - プレイヤー一覧での成績表示（順位、総合スコア、素点、試合数、平均着順、1-4着回数）.
  - プレイヤー別の成績詳細表示（順位分布円グラフ、成績推移折れ線グラフ）。
  - 登録された試合結果の一覧表示。
- 検索・ソート:
  - プレイヤー名や試合結果に対する検索機能。
  - プレイヤー一覧の各項目（順位、スコア、試合数など）でのソート機能.
- レスポンシブデザイン: デスクトップおよびモバイルデバイスでの表示に対応.

## 使用技術

このプロジェクトは以下の技術スタックを使用して構築されています。

- フレームワーク: Next.js (App Router), React, TypeScript
- スタイリング: Tailwind CSS (@tailwindcss/forms プラグインも使用), Sass
- UIライブラリ: Headless UI (モーダル表示に使用), Heroicons, React Icons
- 認証: Next-Auth, bcrypt (パスワードハッシュ化に使用)
- データベース: Vercel Postgres, Prisma (ORM、スキーマ定義に使用)
- データ処理: zod (データ検証に使用), uuid (ID生成に使用)
- グラフ表示: Chart.js (chartjs-plugin-datalabels プラグインも使用)
- その他: use-debounce (検索入力のデバウンスに使用)

## プロジェクト構成のハイライト

プロジェクトの主なディレクトリ構成は以下の通りです:

```
├── app/                   # Next.js App Router のルート
│   ├── components/        # 再利用可能なReactコンポーネント (Modalなど)
│   ├── create-account/    # アカウント作成ページ
│   ├── dashboard/         # ダッシュボード関連ページ・コンポーネント
│   │   ├── (overview)/    # 成績一覧ページ
│   │   ├── configPage/    # 設定ページ
│   │   ├── game-results/  # 試合結果ページ
│   │   └── layout.tsx     # ダッシュボード共通レイアウト
│   ├── lib/               # サーバーアクション、データ取得関数、型定義など
│   │   ├── actions.ts     # データベース操作を行うサーバーアクション
│   │   ├── data.ts        # データベースからデータを取得する関数
│   │   └── definitions.ts # TypeScriptの型定義
│   ├── login/             # ログインページ
│   ├── ui/                # UIコンポーネント (ボタン、テーブル、フォームなど)
│   ├── layout.tsx         # アプリケーション全体のルートレイアウト
│   └── page.tsx           # ランディングページ
├── prisma/                # Prisma関連ファイル
│   ├── games.sql          # gamesテーブル作成用SQL
│   ├── players.sql        # playersテーブル作成用SQL
│   └── schema.prisma      # Prismaスキーマ定義
├── public/                # 静的ファイル (画像、faviconなど)
├── scripts/               # データベースseedスクリプト
├── auth.config.ts         # Next-Auth 設定
├── auth.ts                # Next-Auth 初期化
├── middleware.ts          # Next.js ミドルウェア (認証ルートガードなど)
├── package.json           # プロジェクト依存関係とスクリプト
└── tsconfig.json          # TypeScript 設定
```

## セットアップと実行

1.  リポジトリをクローンします。
2.  依存関係をインストールします (`npm install` または `yarn install`).
3.  `.env` ファイルを作成し、データベース接続情報などを設定します (ソースコード中の `DATABASE_URL`、seed スクリプト中の `@vercel/postgres` クライアントの使用 から Vercel Postgres が想定されます)。
4.  データベーススキーマを適用し、必要に応じて初期データを投入します (`npm run seed` スクリプトがあるようです)。
5.  開発サーバーを起動します (`npm run dev`).
6.  アプリケーションをビルドします (`npm run build`).
7.  ビルドしたアプリケーションを起動します (`npm run start`).

## ライブデモ

デプロイされたアプリケーションは [mahjong-score-app.vercel.app](https://mahjong-score-app.vercel.app/) で確認できます。
