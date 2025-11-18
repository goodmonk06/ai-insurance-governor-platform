import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PolicyTemplateService } from './policy-template.service';
import {
  CreatePolicyTemplateDto,
  UpdatePolicyTemplateDto,
  PolicyTemplateQueryDto,
} from '@insurance-platform/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('policy-templates')
@UseGuards(JwtAuthGuard)
export class PolicyTemplateController {
  constructor(private readonly policyTemplateService: PolicyTemplateService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreatePolicyTemplateDto) {
    return this.policyTemplateService.create(
      req.user.tenantId,
      req.user.userId,
      createDto,
    );
  }

  @Get()
  findAll(@Request() req, @Query() query: PolicyTemplateQueryDto) {
    return this.policyTemplateService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.policyTemplateService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdatePolicyTemplateDto,
  ) {
    return this.policyTemplateService.update(id, req.user.tenantId, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.policyTemplateService.remove(id, req.user.tenantId);
  }

  @Post(':id/duplicate')
  duplicate(@Request() req, @Param('id') id: string) {
    return this.policyTemplateService.duplicate(
      id,
      req.user.tenantId,
      req.user.userId,
    );
  }

  @Post(':id/version')
  createVersion(@Request() req, @Param('id') id: string) {
    return this.policyTemplateService.createVersion(
      id,
      req.user.tenantId,
      req.user.userId,
    );
  }
}
