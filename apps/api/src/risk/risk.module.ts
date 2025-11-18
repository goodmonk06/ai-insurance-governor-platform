import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'risk-calculation',
    }),
  ],
  controllers: [RiskController],
  providers: [RiskService],
  exports: [RiskService],
})
export class RiskModule {}
