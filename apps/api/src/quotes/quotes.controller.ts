import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CreateQuoteDto, UpdateQuoteStatusDto } from '@insurance-platform/shared';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('quotes')
@UseGuards(JwtAuthGuard, TenantGuard)
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Get('tenant/:tenantId')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.quotesService.findByTenant(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() data: CreateQuoteDto) {
    return this.quotesService.create(user.tenantId, user.id, data);
  }

  @Put(':id')
  updateStatus(@Param('id') id: string, @Body() data: UpdateQuoteStatusDto) {
    return this.quotesService.updateStatus(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.quotesService.delete(id);
  }
}
