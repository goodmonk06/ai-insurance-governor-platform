import { Module } from '@nestjs/common';
import { InsuredService } from './insured.service';
import { InsuredController } from './insured.controller';

@Module({
  controllers: [InsuredController],
  providers: [InsuredService],
  exports: [InsuredService],
})
export class InsuredModule {}
