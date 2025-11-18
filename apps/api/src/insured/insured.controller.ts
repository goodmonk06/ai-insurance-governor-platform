import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InsuredService } from './insured.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CreateInsuredDto, UpdateInsuredDto } from '@insurance-platform/shared';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('insured')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InsuredController {
  constructor(private insuredService: InsuredService) {}

  @Get('tenant/:tenantId')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.insuredService.findByTenant(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insuredService.findOne(id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() data: CreateInsuredDto) {
    return this.insuredService.create(user.tenantId, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateInsuredDto) {
    return this.insuredService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.insuredService.delete(id);
  }
}
