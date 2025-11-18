import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RiskService } from './risk.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AssessRiskDto } from '@insurance-platform/shared';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('risk')
@UseGuards(JwtAuthGuard, TenantGuard)
export class RiskController {
  constructor(private riskService: RiskService) {}

  @Post('assess')
  assessRisk(@Body() data: AssessRiskDto) {
    return this.riskService.assessRisk(data);
  }

  @Get('insured/:insuredEntityId')
  getAssessments(@Param('insuredEntityId') insuredEntityId: string) {
    return this.riskService.getAssessments(insuredEntityId);
  }

  @Get('insured/:insuredEntityId/latest')
  getLatestAssessment(
    @Param('insuredEntityId') insuredEntityId: string,
    @Query('scenarioType') scenarioType?: string,
  ) {
    return this.riskService.getLatestAssessment(insuredEntityId, scenarioType);
  }

  @Post('tenant/:tenantId/bulk-recalculate')
  bulkRecalculate(@Param('tenantId') tenantId: string) {
    return this.riskService.bulkRecalculate(tenantId);
  }

  @Get('tenant/:tenantId/portfolio-summary')
  getPortfolioSummary(@Param('tenantId') tenantId: string) {
    return this.riskService.getPortfolioRiskSummary(tenantId);
  }
}
