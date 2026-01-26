# Lydos View

Lydosのフロントエンドアプリケーション

## 技術スタック

- **React 19** - UIライブラリ
- **Vite** - ビルドツール
- **TanStack Router** - ファイルベースルーティング
- **TypeScript** - 型安全な開発
- **Biome** - フォーマッター & リンター
- **openapi-fetch** - 型安全なAPIクライアント
- **openapi-typescript** - OpenAPI仕様から型生成

## セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev
```

開発サーバーは `https://local.lydos` でアクセス可能です。

## スクリプト

```bash
# 開発サーバー起動
bun run dev

# ビルド（型チェック + Viteビルド）
bun run build

# 型チェック
bun run typecheck

# Lint & Format
bun run lint

# Format確認のみ
bun run format:check

# APIの型定義を生成
bun run generate:api
```

## API型生成

バックエンドのOpenAPI仕様からTypeScript型定義を自動生成します：

```bash
bun run generate:api
```

これにより `src/lib/api-types.ts` が生成され、型安全なAPI通信が可能になります。

## ディレクトリ構造

```
src/
├── routes/          # TanStack Routerのルート定義
│   ├── __root.tsx   # ルートレイアウト
│   ├── index.tsx    # トップページ
│   └── test.tsx     # APIテストページ
├── lib/             # ライブラリ・ユーティリティ
│   ├── api.ts       # APIクライアント設定
│   ├── api-types.ts # 自動生成された型定義
│   └── openapi.json # OpenAPI仕様（キャッシュ）
└── main.tsx         # アプリケーションエントリーポイント
```

## 型安全なAPI通信

OpenAPI仕様から自動生成された型を使用して、完全に型安全なAPI通信を実現：

```typescript
import { client } from './lib/api'

// 型推論により、レスポンス型が自動的に決定される
const { data, error } = await client.GET('/api/message')
```

## 開発環境

- Node.js: v22.18.0
- Bun: v1.3.6
- HTTPS環境でローカル開発（mkcertによる自己署名証明書）
