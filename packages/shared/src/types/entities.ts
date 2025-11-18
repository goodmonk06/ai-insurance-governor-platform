import { UserRole, PolicyStatus, QuoteStatus, InsuredEntityType, RiskRank, ScenarioType } from './enums';

export interface Tenant {
  id: string;
  name: string;
  type: 'agency' | 'corporate';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsuredEntity {
  id: string;
  tenantId: string;
  type: InsuredEntityType;
  name: string;
  taxId?: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Policy {
  id: string;
  tenantId: string;
  insuredEntityId: string;
  policyNumber: string;
  status: PolicyStatus;
  productName: string;
  premium: number;
  coverageJson: Record<string, any>;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskAssessment {
  id: string;
  insuredEntityId: string;
  scenarioType: ScenarioType;
  score: number;
  rank: RiskRank;
  detailJson: Record<string, any>;
  assessedAt: Date;
  createdAt: Date;
}

export interface QuoteRequest {
  id: string;
  tenantId: string;
  insuredEntityId: string;
  requestedById: string;
  status: QuoteStatus;
  answersJson: Record<string, any>;
  quotedPremium?: number;
  quotedCoverage?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}
