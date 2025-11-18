import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { InsuredModule } from './insured/insured.module';
import { PoliciesModule } from './policies/policies.module';
import { QuotesModule } from './quotes/quotes.module';
import { RiskModule } from './risk/risk.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    PrismaModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    InsuredModule,
    PoliciesModule,
    QuotesModule,
    RiskModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
