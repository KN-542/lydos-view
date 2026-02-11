# Lydos View

Lydosのフロントエンドアプリケーションです。

## 技術スタック

### フロントエンド
- **React 19.2** - UIフレームワーク
- **TypeScript 5.9** - 型安全な開発
- **Rolldown Vite 7.2** - 次世代高速ビルドツール
- **TailwindCSS 3.4** - ユーティリティファーストCSS
- **Babel React Compiler** - 自動最適化コンパイラ

### ルーティング・状態管理
- **TanStack Router 1.157** - 型安全なファイルベースルーティング
- **TanStack Query 5.90** - サーバー状態管理・データフェッチング

### 認証・API連携
- **Clerk 5.60** - 認証・ユーザー管理（日本語対応）
- **openapi-fetch 0.15** - 型安全なAPIクライアント
- **openapi-typescript 7.10** - OpenAPIスキーマから型定義自動生成

### UI・フォーム
- **React Hook Form 7.71** - パフォーマンス重視のフォーム管理
- **lucide-react 0.563** - アイコンライブラリ

### 開発ツール
- **Biome 2.3** - 高速Linter/Formatter
- **Bun** - パッケージマネージャー・ランタイム

## ディレクトリ構成

```
lydos-view/
├── src/
│   ├── components/          # 再利用可能なコンポーネント
│   │   └── AuthProvider.tsx # 認証トークン管理
│   ├── hook/                # カスタムフック
│   │   └── useRequireAuth.ts # 認証チェック・リダイレクト
│   ├── lib/                 # ユーティリティ・API関連
│   │   ├── api.ts           # APIクライアント設定
│   │   ├── api-types.ts     # 自動生成されたOpenAPI型定義
│   │   ├── openapi.json     # OpenAPIスキーマ定義
│   │   └── utils.ts         # ユーティリティ関数
│   └── routes/              # ページコンポーネント（TanStack Router）
│       ├── __root.tsx       # ルートレイアウト
│       ├── index.tsx        # ログイン画面
│       ├── sign-up.tsx      # 登録画面
│       └── _authenticated/  # 認証保護されたページ
│           └── home/
│               ├── index.tsx # チャットページ
│               └── setting/ # 設定ページ
│                   ├── plan/    # プラン選択
│                   └── payment/ # 支払い方法設定
├── public/                  # 公開アセット
├── vite.config.ts           # Vite設定
├── tailwind.config.js       # Tailwind設定
├── biome.json               # Biome設定
└── package.json             # パッケージ定義
```

## セットアップ

```bash
bun install
cp .env.example .env
bun run dev
```

## 開発

```bash
bun run dev           # 開発サーバー起動
bun run generate:api  # API型定義更新（API変更時）
bun run lint          # コードチェック＆自動修正
bun run format        # コード整形
bun run typecheck     # TypeScript型チェック
bun run build         # プロダクションビルド
```
