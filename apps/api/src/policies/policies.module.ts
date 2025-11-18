import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'policy-reminders',
    }),
  ],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
