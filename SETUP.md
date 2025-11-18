# セットアップガイド

## クイックスタート

最も簡単な起動方法を説明します。

### 1. Dockerで依存サービスを起動

```bash
docker-compose up -d
```

これで以下が起動します:
- PostgreSQL (ポート5432)
- Redis (ポート6379)

### 2. 依存関係をインストール

```bash
pnpm install
```

### 3. 環境変数を設定

```bash
# API用
cp apps/api/.env.example apps/api/.env

# Worker用
cp apps/worker/.env.example apps/worker/.env

# Web用
cp apps/web/.env.example apps/web/.env.local
```

### 4. データベースをセットアップ

```bash
# Prismaスキーマを適用
pnpm db:push

# シードデータを投入
pnpm db:seed
```

### 5. 開発サーバーを起動

```bash
pnpm dev
```

これで以下が起動します:
- API: http://localhost:3000
- Web: http://localhost:3001
- Worker: バックグラウンド実行

### 6. アクセス

ブラウザで http://localhost:3001 にアクセスし、以下の認証情報でログイン:

```
Email: admin@example.com
Password: password123
```

## トラブルシューティング

### データベース接続エラー

PostgreSQLが起動していることを確認:
```bash
docker-compose ps
```

起動していない場合:
```bash
docker-compose up -d postgres
```

### Redis接続エラー

Redisが起動していることを確認:
```bash
docker-compose ps
```

起動していない場合:
```bash
docker-compose up -d redis
```

### ポート競合

既に使用されているポートがある場合、docker-compose.ymlでポート番号を変更してください。

### ビルドエラー

キャッシュをクリア:
```bash
pnpm clean
rm -rf node_modules
pnpm install
```

## 開発時のヒント

### Prisma Studio でデータを確認

```bash
pnpm db:studio
```

ブラウザで http://localhost:5555 が開きます。

### ログの確認

```bash
# API のログ
cd apps/api && pnpm dev

# Worker のログ
cd apps/worker && pnpm dev
```

### データベースのリセット

```bash
# データベースを削除して再作成
docker-compose down -v
docker-compose up -d
pnpm db:push
pnpm db:seed
```

## 本番環境へのデプロイ

### 環境変数の設定

本番環境では以下の環境変数を必ず変更してください:

- `JWT_SECRET`: 強力なランダム文字列に変更
- `DATABASE_URL`: 本番データベースのURL
- `REDIS_HOST`, `REDIS_PORT`: 本番Redisの接続情報
- `NODE_ENV`: `production`に設定

### ビルド

```bash
pnpm build
```

### 起動

```bash
# API
cd apps/api && pnpm start

# Web
cd apps/web && pnpm start

# Worker
cd apps/worker && pnpm start
```
