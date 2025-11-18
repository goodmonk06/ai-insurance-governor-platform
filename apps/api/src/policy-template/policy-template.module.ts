import { Module } from '@nestjs/common';
import { PolicyTemplateController } from './policy-template.controller';
import { PolicyTemplateService } from './policy-template.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PolicyTemplateController],
  providers: [PolicyTemplateService],
  exports: [PolicyTemplateService],
})
export class PolicyTemplateModule {}
