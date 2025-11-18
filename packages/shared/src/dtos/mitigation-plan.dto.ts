import { MitigationPriority, MitigationStatus } from '../types/enums';

export interface CreateMitigationPlanDto {
  insuredEntityId: string;
  riskAssessmentId: string;
  title: string;
  description: string;
  priority: MitigationPriority;
  recommendations: string[];
  actionItems?: Record<string, any>[];
  estimatedCost?: number;
  startDate?: Date;
  responsibleParty?: string;
}

export interface UpdateMitigationPlanDto {
  title?: string;
  description?: string;
  priority?: MitigationPriority;
  status?: MitigationStatus;
  recommendations?: string[];
  actionItems?: Record<string, any>[];
  estimatedCost?: number;
  actualCost?: number;
  startDate?: Date;
  completionDate?: Date;
  responsibleParty?: string;
  effectiveness?: number;
  notes?: string;
}

export interface MitigationPlanQueryDto {
  insuredEntityId?: string;
  riskAssessmentId?: string;
  status?: MitigationStatus;
  priority?: MitigationPriority;
  page?: number;
  limit?: number;
}
