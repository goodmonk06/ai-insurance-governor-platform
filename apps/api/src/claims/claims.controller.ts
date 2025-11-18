import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import {
  CreateClaimDto,
  UpdateClaimDto,
  ReviewClaimDto,
  ClaimQueryDto,
} from '@insurance-platform/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('claims')
@UseGuards(JwtAuthGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateClaimDto) {
    return this.claimsService.create(req.user.tenantId, createDto);
  }

  @Get()
  findAll(@Request() req, @Query() query: ClaimQueryDto) {
    return this.claimsService.findAll(req.user.tenantId, query);
  }

  @Get('statistics')
  getStatistics(
    @Request() req,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.claimsService.getStatistics(
      req.user.tenantId,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.claimsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateClaimDto,
  ) {
    return this.claimsService.update(id, req.user.tenantId, updateDto);
  }

  @Post(':id/review')
  review(
    @Request() req,
    @Param('id') id: string,
    @Body() reviewDto: ReviewClaimDto,
  ) {
    return this.claimsService.review(id, req.user.tenantId, req.user.userId, reviewDto);
  }

  @Post(':id/payment')
  processPayment(
    @Request() req,
    @Param('id') id: string,
    @Body('paidAmount') paidAmount: number,
  ) {
    return this.claimsService.processPayment(id, req.user.tenantId, paidAmount);
  }

  @Post(':id/close')
  close(@Request() req, @Param('id') id: string) {
    return this.claimsService.close(id, req.user.tenantId);
  }
}
