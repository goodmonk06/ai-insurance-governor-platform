import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CreatePolicyDto, UpdatePolicyDto } from '@insurance-platform/shared';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('policies')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  @Get('tenant/:tenantId')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.policiesService.findByTenant(tenantId);
  }

  @Get('tenant/:tenantId/expiring')
  getExpiringPolicies(
    @Param('tenantId') tenantId: string,
    @Query('days') days?: string,
  ) {
    return this.policiesService.getExpiringPolicies(tenantId, days ? parseInt(days) : 30);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() data: CreatePolicyDto) {
    return this.policiesService.create(user.tenantId, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePolicyDto) {
    return this.policiesService.update(id, data);
  }

  @Put(':id/activate')
  activate(@Param('id') id: string) {
    return this.policiesService.activate(id);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.policiesService.cancel(id);
  }
}
