# AI Insurance Governor Platform

介護・医療系保険リスク管理SaaSプラットフォーム

## 概要

このプラットフォームは、介護施設や医療機関向けの保険リスク管理を支援するSaaSソリューションです。AIベースのリスクシミュレーションエンジンと統合し、包括的なリスク評価、見積もり管理、契約管理機能を提供します。

## アーキテクチャ

### システム構成

```
┌─────────────────────────────────────────────────────────────┐
│                     Turborepo Monorepo                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   apps/web   │  │   apps/api   │  │ apps/worker  │      │
│  │              │  │              │  │              │      │
│  │  Next.js 15  │  │  NestJS 10   │  │   BullMQ     │      │
│  │  React 19    │  │  Prisma ORM  │  │   Workers    │      │
│  │  Tailwind    │  │  PostgreSQL  │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │              │
│         └─────────────────┴─────────────────┘              │
│                           │                                │
│                  ┌────────▼────────┐                        │
│                  │ packages/shared │                        │
│                  │                 │                        │
│                  │  DTOs, Types,   │                        │
│                  │  Utilities      │                        │
│                  └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│  • insurance-risk-simulator-core (外部AIリスクエンジン)        │
│  • PostgreSQL Database                                      │
│  • Redis (BullMQ用)                                          │
└─────────────────────────────────────────────────────────────┘
```

### 技術スタック

#### フロントエンド (apps/web)
- **Next.js 15** - App Router使用
- **React 19** - UIフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Lucide React** - アイコン
- **Recharts** - データ可視化

#### バックエンド (apps/api)
- **NestJS 10** - エンタープライズNode.jsフレームワーク
- **Prisma ORM** - データベースORM
- **PostgreSQL** - メインデータベース
- **Passport JWT** - 認証・認可
- **BullMQ** - ジョブキュー統合

#### ワーカー (apps/worker)
- **BullMQ** - バックグラウンドジョブ処理
- **Prisma Client** - データベースアクセス

#### 共通パッケージ (packages/shared)
- **Zod** - スキーマバリデーション
- **Axios** - HTTP クライアント
- **TypeScript** - 型定義

### データモデル

```
Tenant (テナント: 代理店・組織)
  ↓
  ├── User (ユーザー: admin/underwriter/sales)
  ├── InsuredEntity (被保険者: 施設/法人/個人)
  │     ├── Policy (保険契約)
  │     ├── RiskAssessment (リスク評価)
  │     └── QuoteRequest (見積もりリクエスト)
  └── AuditLog (監査ログ)
```

### 主要機能

1. **マルチテナント管理**
   - テナント分離によるデータセキュリティ
   - RBAC（ロールベースアクセス制御）

2. **被保険者管理**
   - 施設、法人、個人の一元管理
   - メタデータによる柔軟な属性管理

3. **リスク評価**
   - AIシミュレーターとの統合
   - 複数シナリオでの評価
   - リスクランク自動判定（低/中/高/危険）

4. **見積もり管理**
   - オンライン見積もりリクエスト
   - 査定ワークフロー
   - 自動有効期限管理

5. **契約管理**
   - 契約ライフサイクル管理
   - 更新期限通知
   - 契約書類管理

6. **バックグラウンドジョブ**
   - 大量リスク再計算
   - 契約更新リマインダー
   - 定期レポート生成

## セットアップ

### 前提条件

- Node.js 20.x 以上
- pnpm 9.x 以上
- PostgreSQL 14 以上
- Redis 6 以上

### インストール

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd ai-insurance-governor-platform
```

2. **依存関係のインストール**
```bash
pnpm install
```

3. **環境変数の設定**

apps/api/.env:
```bash
cp apps/api/.env.example apps/api/.env
```

apps/api/.envを編集:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/insurance_platform?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
RISK_SIMULATOR_URL="http://localhost:3001/api"
RISK_SIMULATOR_USE_MOCK=true
```

apps/worker/.env:
```bash
cp apps/worker/.env.example apps/worker/.env
# 同様の環境変数を設定
```

apps/web/.env.local:
```bash
cp apps/web/.env.example apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. **データベースのセットアップ**

PostgreSQLデータベースを作成:
```bash
createdb insurance_platform
```

Prismaスキーマを適用:
```bash
pnpm db:push
```

5. **シードデータの投入**
```bash
pnpm db:seed
```

これにより以下のサンプルデータが作成されます:
- テナント: 東京介護保険代理店、全国医療保険サービス
- ユーザー: admin@example.com, underwriter@example.com, sales@example.com (全てパスワード: password123)
- 被保険者: さくら介護ホーム、ひまわりデイサービスセンター、あおぞら訪問看護ステーション
- リスク評価: 各施設の複数シナリオ評価
- 保険契約: アクティブ契約2件、下書き1件

6. **開発サーバーの起動**

全サービスを一括起動:
```bash
pnpm dev
```

個別起動:
```bash
# API (Port 3000)
cd apps/api && pnpm dev

# Web (Port 3001)
cd apps/web && pnpm dev

# Worker
cd apps/worker && pnpm dev
```

7. **アクセス**
- Web Dashboard: http://localhost:3001
- API: http://localhost:3000/api
- Prisma Studio: `pnpm db:studio`

### ログイン情報

- 管理者: `admin@example.com` / `password123`
- 査定担当: `underwriter@example.com` / `password123`
- 営業担当: `sales@example.com` / `password123`

## 典型的なユースケース

### ユースケース: 新規施設のリスク診断 → 見積もり → 契約

#### 1. 新規施設の登録

**操作**: 被保険者ページで「新規登録」をクリック

```json
{
  "type": "facility",
  "name": "すみれ介護センター",
  "taxId": "1234567890",
  "address": "東京都新宿区西新宿1-1-1",
  "phoneNumber": "03-1234-5678",
  "email": "info@sumire-care.jp",
  "metadata": {
    "facilityType": "nursing_home",
    "bedCount": 60,
    "employeeCount": 30,
    "yearsInOperation": 3,
    "hasFireSafety": true,
    "hasEmergencyPlan": false,
    "annualRevenue": 180000000
  }
}
```

API呼び出し:
```bash
POST /api/insured
```

#### 2. リスク評価の実施

**操作**: リスク評価ページで施設を選択し、複数シナリオで評価実行

```json
{
  "insuredEntityId": "<施設ID>",
  "scenarioType": "nursing_home_fire",
  "parameters": {
    "facilityType": "nursing_home",
    "bedCount": 60,
    "employeeCount": 30,
    "yearsInOperation": 3,
    "hasFireSafety": true,
    "hasEmergencyPlan": false
  }
}
```

API呼び出し:
```bash
POST /api/risk/assess
```

**評価結果**:
- スコア: 52.5
- ランク: 中リスク
- 期待損失額: ¥9,450,000
- 推奨事項:
  - 緊急時対応マニュアルの整備が必要です
  - 定期的な避難訓練の実施を推奨します
  - 運営実績が浅いため、経験豊富な管理者の配置を推奨します

#### 3. 見積もりリクエスト作成

**操作**: 見積もりページで「新規見積もり作成」

```json
{
  "insuredEntityId": "<施設ID>",
  "answersJson": {
    "facilityType": "nursing_home",
    "bedCount": 60,
    "employeeCount": 30,
    "requestedCoverage": {
      "火災保険": "3億円",
      "賠償責任": "2億円",
      "施設管理者賠償": "1億円"
    },
    "specialRequirements": "感染症対策特約を希望"
  }
}
```

API呼び出し:
```bash
POST /api/quotes
```

#### 4. 査定・見積もり回答

**操作**: 査定担当者が見積もりを査定

```json
{
  "status": "quoted",
  "quotedPremium": 850000,
  "quotedCoverage": {
    "火災保険": "最大3億円",
    "賠償責任": "最大2億円",
    "施設管理者賠償": "最大1億円",
    "感染症対策特約": "最大5000万円"
  }
}
```

API呼び出し:
```bash
PUT /api/quotes/<見積もりID>
```

#### 5. 契約の作成・有効化

**操作**: 契約管理ページで見積もりから契約を作成

```json
{
  "insuredEntityId": "<施設ID>",
  "policyNumber": "POL-2024-004",
  "productName": "介護施設総合保険プラン スタンダード",
  "premium": 850000,
  "coverageJson": {
    "火災保険": "最大3億円",
    "賠償責任": "最大2億円",
    "施設管理者賠償": "最大1億円",
    "感染症対策特約": "最大5000万円"
  },
  "startDate": "2024-12-01T00:00:00Z",
  "endDate": "2025-11-30T23:59:59Z"
}
```

API呼び出し:
```bash
POST /api/policies
PUT /api/policies/<契約ID>/activate
```

#### 6. 継続的なリスク監視

**バックグラウンドジョブ**: ワーカーが定期的に実行

- 30日以内に更新期限が来る契約をチェック
- リマインダー通知を送信
- リスク再評価をスケジュール

```bash
# 手動での一括リスク再評価
POST /api/risk/tenant/<テナントID>/bulk-recalculate
```

## プロジェクト構造

```
ai-insurance-governor-platform/
├── apps/
│   ├── api/                    # NestJS APIサーバー
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # データベーススキーマ
│   │   │   └── seed.ts         # シードデータ
│   │   └── src/
│   │       ├── auth/           # 認証モジュール
│   │       ├── common/         # 共通ガード・デコレーター
│   │       ├── insured/        # 被保険者モジュール
│   │       ├── policies/       # 契約モジュール
│   │       ├── quotes/         # 見積もりモジュール
│   │       ├── risk/           # リスク評価モジュール
│   │       ├── tenants/        # テナントモジュール
│   │       ├── users/          # ユーザーモジュール
│   │       └── prisma/         # Prismaサービス
│   │
│   ├── web/                    # Next.js Webアプリ
│   │   └── src/
│   │       ├── app/
│   │       │   └── (dashboard)/
│   │       │       ├── dashboard/  # ダッシュボード
│   │       │       ├── insured/    # 被保険者管理
│   │       │       ├── quotes/     # 見積もり管理
│   │       │       ├── policies/   # 契約管理
│   │       │       └── risk/       # リスク評価
│   │       ├── components/     # UIコンポーネント
│   │       └── lib/            # ユーティリティ
│   │
│   └── worker/                 # BullMQワーカー
│       └── src/
│           └── workers/
│               ├── risk-calculation.worker.ts
│               └── policy-reminder.worker.ts
│
├── packages/
│   └── shared/                 # 共通パッケージ
│       └── src/
│           ├── types/          # 型定義
│           ├── dtos/           # DTOスキーマ
│           └── clients/        # APIクライアント
│               └── risk-simulator.client.ts
│
├── package.json                # ルートpackage.json
├── pnpm-workspace.yaml         # pnpmワークスペース設定
├── turbo.json                  # Turboビルド設定
└── README.md                   # このファイル
```

## 開発ガイド

### ビルド

```bash
# 全アプリケーションをビルド
pnpm build

# 個別ビルド
pnpm --filter @insurance-platform/api build
pnpm --filter @insurance-platform/web build
pnpm --filter @insurance-platform/worker build
```

### テスト

```bash
# テスト実行
pnpm test
```

### Prismaコマンド

```bash
# スキーマ変更後にマイグレーション
pnpm db:push

# Prisma Clientの再生成
pnpm db:generate

# Prisma Studio起動
pnpm db:studio

# シードデータ再投入
pnpm db:seed
```

### コード品質

```bash
# Lint
pnpm lint

# フォーマット
pnpm format
```

## API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン

### テナント
- `GET /api/tenants` - テナント一覧
- `GET /api/tenants/:id` - テナント詳細
- `POST /api/tenants` - テナント作成
- `PUT /api/tenants/:id` - テナント更新

### 被保険者
- `GET /api/insured/tenant/:tenantId` - テナントの被保険者一覧
- `GET /api/insured/:id` - 被保険者詳細
- `POST /api/insured` - 被保険者作成
- `PUT /api/insured/:id` - 被保険者更新
- `DELETE /api/insured/:id` - 被保険者削除

### 契約
- `GET /api/policies/tenant/:tenantId` - テナントの契約一覧
- `GET /api/policies/tenant/:tenantId/expiring` - 更新期限が近い契約
- `GET /api/policies/:id` - 契約詳細
- `POST /api/policies` - 契約作成
- `PUT /api/policies/:id` - 契約更新
- `PUT /api/policies/:id/activate` - 契約有効化
- `PUT /api/policies/:id/cancel` - 契約解約

### 見積もり
- `GET /api/quotes/tenant/:tenantId` - テナントの見積もり一覧
- `GET /api/quotes/:id` - 見積もり詳細
- `POST /api/quotes` - 見積もり作成
- `PUT /api/quotes/:id` - 見積もり更新
- `DELETE /api/quotes/:id` - 見積もり削除

### リスク評価
- `POST /api/risk/assess` - リスク評価実行
- `GET /api/risk/insured/:insuredEntityId` - 被保険者のリスク評価履歴
- `GET /api/risk/insured/:insuredEntityId/latest` - 最新のリスク評価
- `POST /api/risk/tenant/:tenantId/bulk-recalculate` - 一括リスク再評価
- `GET /api/risk/tenant/:tenantId/portfolio-summary` - ポートフォリオリスク概要

## ライセンス

MIT

## サポート

問題や質問がある場合は、GitHubのIssuesで報告してください。
