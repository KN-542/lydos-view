# Lydos View

Lydosのフロントエンドアプリケーションです。
簡易AIチャットアプリになりました。

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
- **Playwright 1.58** - E2Eテストフレームワーク

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

## E2Eテスト

[Playwright](https://playwright.dev/) を使ったエンドツーエンドテスト。

### 前提

- lydos-setup の Docker コンテナが起動済み
- lydos-api の開発サーバーが起動済み（port 3001）
- lydos-view の開発サーバーが起動済み（port 5173）

### セットアップ

```bash
# ブラウザのインストール（初回のみ）
bunx playwright install

# テスト用環境変数を確認（.env.test に認証情報が記載済み）
cat .env.test
```

### 実行

```bash
# テスト実行
bun run test:e2e

# ブラウザUIで対話的に実行
bun run test:e2e:ui

# テスト結果をブラウザで確認
bun run test:e2e:report
# または
bunx playwright show-report
```

### 補足

- 認証には Clerk の `sign_in_token` API を使用し、メール OTP などの二段階認証をバイパス
- テスト用アカウント情報は `.env.test` に記載（`.gitignore` 対象）
- テスト計画・観点の詳細は [`.claude/e2e-test-plan.md`](.claude/e2e-test-plan.md) を参照
