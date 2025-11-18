# AI Insurance Governor Platform

**Phase 2** - 介護・医療系保険リスク管理SaaSプラットフォーム

Production-ready insurance risk management SaaS platform for healthcare and nursing care facilities with complete end-to-end functionality.

## Overview

このプラットフォームは、介護施設や医療機関向けの保険リスク管理を支援するSaaSソリューションです。AIベースのリスクシミュレーションエンジンと統合し、包括的なリスク評価、見積もり管理、契約管理機能を提供します。

### Phase 2 Highlights

- ✅ **Complete Vertical Slice**: InsuredEntity CRUD fully functional end-to-end
- ✅ **Authentication Flow**: Login page, JWT handling, auth guards
- ✅ **Production Docker Setup**: Multi-stage builds, health checks, docker-compose
- ✅ **Error Handling**: Global exception filters and response transformation
- ✅ **Unit Tests**: Core domain logic tested with Vitest and Jest
- ✅ **Standardized Scripts**: Consistent dev/build/test commands across all packages

## Tech Stack

### Frontend
- **Next.js 15** - App Router, Server Components
- **React 19** - Modern React with hooks
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors

### Backend
- **NestJS 10** - Enterprise Node.js framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Main database
- **Redis** - Job queue and caching
- **BullMQ** - Background job processing

### Infrastructure
- **Docker** - Containerization
- **Turborepo** - Monorepo build system
- **pnpm** - Fast package manager

## Domain Model

```
Tenant (保険代理店/組織)
  ├── User (ユーザー: admin/underwriter/sales)
  ├── InsuredEntity (被保険者: 施設/法人/個人)
  │     ├── RiskAssessment (リスク評価)
  │     ├── Policy (保険契約)
  │     └── QuoteRequest (見積もりリクエスト)
  └── AuditLog (監査ログ)
```

### Key Entities

- **Tenant**: Multi-tenant isolation, agency or corporate type
- **User**: Role-based access control (RBAC)
- **InsuredEntity**: Facilities, corporations, or individuals with metadata
- **RiskAssessment**: AI-powered risk scoring with recommendations
- **Policy**: Complete policy lifecycle management
- **QuoteRequest**: Quote workflow with approval process

## Getting Started

### Requirements

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Docker**: >= 24.0 (optional, recommended)
- **PostgreSQL**: >= 14 (or via Docker)
- **Redis**: >= 6 (or via Docker)

### Quick Start (Docker - Recommended)

1. **Clone and setup environment**
```bash
git clone <repository-url>
cd ai-insurance-governor-platform

# Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

2. **Start services with Docker**
```bash
# Start database services only
docker compose up -d postgres redis

# Install dependencies
pnpm install

# Setup database
pnpm db:push
pnpm db:seed

# Start development servers
pnpm dev
```

**Access the application:**
- Web Dashboard: http://localhost:3001
- API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

### Production Deployment

```bash
# Build and run everything with Docker
docker compose up -d

# View logs
docker compose logs -f api
docker compose logs -f web

# Stop services
docker compose down
```

### Manual Setup (Without Docker)

```bash
# Install dependencies
pnpm install

# Setup PostgreSQL and Redis manually
# Update .env files with connection strings

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed database
pnpm db:seed

# Start development servers
pnpm dev
```

## Scripts Reference

### Root Level
```bash
pnpm dev          # Start all services in dev mode
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm clean        # Clean build artifacts

pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed database with sample data
pnpm db:studio    # Open Prisma Studio
```

### Package-Specific
```bash
# API
cd apps/api
pnpm dev          # Start API server (port 3000)
pnpm build        # Build API
pnpm test         # Run API tests
pnpm test:watch   # Run tests in watch mode

# Web
cd apps/web
pnpm dev          # Start web server (port 3001)
pnpm build        # Build for production
pnpm start        # Start production server

# Shared
cd packages/shared
pnpm build        # Build shared package
pnpm test         # Run unit tests
pnpm test:watch   # Run tests in watch mode
```

## Complete Vertical Slice Example

### End-to-End Flow: InsuredEntity Management

This platform includes a fully functional vertical slice demonstrating complete CRUD operations for insured entities (facilities, corporations, individuals).

**1. Authentication**
```
Navigate to: http://localhost:3001/login
Demo credentials:
- Admin: admin@example.com / password123
- Underwriter: underwriter@example.com / password123
- Sales: sales@example.com / password123
```

**2. Create Insured Entity**
```
Dashboard → 被保険者 → 新規登録

Fill in the form:
- Type: 施設 (Facility)
- Name: すみれ介護センター
- Address: 東京都新宿区西新宿1-1-1
- Facility Details:
  - Facility Type: nursing_home
  - Bed Count: 60
  - Employee Count: 30
  - Years in Operation: 3
  - Safety measures: Check applicable boxes

API: POST /api/insured
```

**3. View Insured Entities**
```
Dashboard → 被保険者

View list with:
- Risk scores and rankings
- Active policies count
- Contact information

API: GET /api/insured/tenant/:tenantId
```

**4. View Entity Details**
```
Click on any entity card

See comprehensive information:
- Basic info (address, contact)
- Facility details (beds, employees, revenue)
- Risk assessments with recommendations
- Active policies

API: GET /api/insured/:id
```

**5. Risk Assessment**
```
API: POST /api/risk/assess
Body: {
  "insuredEntityId": "<id>",
  "scenarioType": "nursing_home_fire",
  "parameters": { ... }
}

Response: Risk score, rank, recommendations
```

### API Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get insured entities (with token)
curl http://localhost:3000/api/insured/tenant/tenant-1 \
  -H "Authorization: Bearer <your-token>"

# Create insured entity
curl -X POST http://localhost:3000/api/insured \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "facility",
    "name": "Test Facility",
    "address": "Tokyo",
    "metadata": {
      "facilityType": "nursing_home",
      "bedCount": 50
    }
  }'
```

## Sample Data

The seed script creates:

**Tenants**
- 東京介護保険代理店 (Tokyo Insurance Agency)
- 全国医療保険サービス (National Medical Insurance Service)

**Users**
- Admin: `admin@example.com` (full access)
- Underwriter: `underwriter@example.com` (quote assessment)
- Sales: `sales@example.com` (client management)

**Insured Entities**
- さくら介護ホーム (Sakura Nursing Home) - 50 beds, 25 employees
- ひまわりデイサービスセンター (Himawari Day Service) - 30 beds, 15 employees
- あおぞら訪問看護ステーション (Aozora Visiting Nurse) - 12 employees

**Risk Assessments**
- Multiple scenarios (fire, infection, malpractice)
- Risk rankings (low/medium/high/critical)
- Detailed recommendations

**Policies**
- 2 active policies
- 1 draft policy
- Comprehensive coverage details

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm --filter @insurance-platform/shared test:watch
pnpm --filter @insurance-platform/api test:watch

# Run with coverage
cd apps/api && pnpm test:cov
```

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                   Turborepo                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ apps/web   │  │ apps/api   │  │ apps/worker  │  │
│  │ Next.js    │→→│ NestJS     │←→│ BullMQ       │  │
│  │ Port 3001  │  │ Port 3000  │  │ Background   │  │
│  └────────────┘  └──────┬─────┘  └──────────────┘  │
│                         │                          │
│              ┌──────────▼──────────┐                │
│              │ packages/shared     │                │
│              │ DTOs, Types, Utils  │                │
│              └─────────────────────┘                │
└─────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    PostgreSQL         Redis    Risk Simulator
    (Prisma ORM)    (BullMQ)      (Mock)
```

### Security Features

- **JWT Authentication**: Secure token-based auth
- **RBAC**: Role-based access control
- **Tenant Isolation**: Multi-tenant data segregation
- **Input Validation**: Zod schemas for all inputs
- **Error Handling**: Centralized exception handling
- **Audit Logging**: Track all critical operations

### Performance Features

- **Background Jobs**: Async processing with BullMQ
- **Database Indexing**: Optimized queries
- **Response Caching**: Redis integration
- **Connection Pooling**: Prisma connection management

## Project Structure

```
ai-insurance-governor-platform/
├── apps/
│   ├── api/                    # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── common/        # Guards, filters, interceptors
│   │   │   ├── insured/       # Insured entity module
│   │   │   ├── policies/      # Policy management
│   │   │   ├── quotes/        # Quote workflow
│   │   │   ├── risk/          # Risk assessment
│   │   │   ├── tenants/       # Tenant management
│   │   │   └── users/         # User management
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── seed.ts        # Seed data
│   │   ├── Dockerfile         # Production build
│   │   └── jest.config.js     # Test configuration
│   │
│   ├── web/                   # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (dashboard)/  # Protected routes
│   │   │   │   └── login/        # Auth page
│   │   │   ├── components/    # UI components
│   │   │   ├── contexts/      # React contexts
│   │   │   └── lib/           # Utilities
│   │   └── Dockerfile         # Production build
│   │
│   └── worker/                # Background jobs
│       └── src/
│           └── workers/       # Job processors
│
├── packages/
│   └── shared/                # Shared package
│       └── src/
│           ├── clients/       # API clients
│           ├── dtos/          # Data transfer objects
│           └── types/         # Type definitions
│
├── docker-compose.yml         # Full stack deployment
├── turbo.json                 # Build configuration
└── pnpm-workspace.yaml        # Workspace config
```

## Environment Variables

### API (.env)
```env
DATABASE_URL="postgresql://..."
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
RISK_SIMULATOR_USE_MOCK="true"
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

## Future Extensions

### Planned Features

1. **Advanced Analytics**
   - Portfolio risk heatmaps
   - Trend analysis and forecasting
   - Custom report generation

2. **Integration Enhancements**
   - Real external risk simulator API
   - Payment gateway integration
   - Email/SMS notifications
   - Document management system

3. **Mobile App**
   - React Native mobile client
   - Push notifications
   - Offline capability

4. **Advanced Workflows**
   - Approval workflows for quotes
   - Automated underwriting rules
   - Policy renewal automation
   - Claims management

5. **Compliance & Reporting**
   - Regulatory compliance checks
   - Automated reporting
   - Data export functionality

6. **AI Enhancements**
   - Predictive risk modeling
   - Anomaly detection
   - Recommendation engine

## Contributing

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
pnpm test
pnpm lint

# Commit and push
git commit -m "feat: your feature"
git push origin feature/your-feature
```

## License

MIT

## Support

For issues and questions:
- GitHub Issues: Create an issue in this repository
- Documentation: See inline code comments and type definitions

---

**Phase 2 Status**: ✅ Complete
- Vertical slice fully functional
- Production-ready with Docker
- Comprehensive testing
- Standardized development experience
