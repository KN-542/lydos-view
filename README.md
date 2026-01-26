# Lydos View

Lydosのフロントエンドアプリケーション

## 技術スタック

- React 19
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- TypeScript
- Biome

## セットアップ

```bash
bun install
cp .env.example .env
bun run dev
```

開発サーバー: `https://local.lydos`

## スクリプト

```bash
bun run dev          # 開発サーバー起動
bun run build        # ビルド
bun run lint         # Lint & Format
bun run typecheck    # 型チェック
bun run generate:api # API型定義生成
```

## API型定義生成

```bash
bun run generate:api
```

OpenAPI仕様から`src/lib/api-types.ts`を自動生成します。
