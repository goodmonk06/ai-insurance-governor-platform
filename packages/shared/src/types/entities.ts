import {
  UserRole,
  PolicyStatus,
  QuoteStatus,
  InsuredEntityType,
  RiskRank,
  ScenarioType,
  ClaimType,
  ClaimStatus,
  DocumentType,
  DocumentEntityType,
  NotificationChannel,
  NotificationType,
  NotificationStatus,
  MitigationPriority,
  MitigationStatus,
  TagCategory,
} from './enums';

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

export interface PolicyTemplate {
  id: string;
  tenantId?: string;
  name: string;
  description?: string;
  facilityTypes: string[];
  coverageConfig: Record<string, any>;
  premiumFormula: Record<string, any>;
  underwritingRules: Record<string, any>;
  isActive: boolean;
  isPublic: boolean;
  version: number;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskProfile {
  id: string;
  facilityType: string;
  industrySegment: string;
  baselineScore: number;
  riskFactors: Record<string, any>;
  benchmarkData: Record<string, any>;
  recommendations: string[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface Claim {
  id: string;
  tenantId: string;
  policyId: string;
  insuredEntityId: string;
  claimNumber: string;
  claimType: ClaimType;
  status: ClaimStatus;
  incidentDate: Date;
  reportedDate: Date;
  description: string;
  claimedAmount: number;
  approvedAmount?: number;
  paidAmount?: number;
  denialReason?: string;
  adjusterNotes: Record<string, any>[];
  reviewedById?: string;
  reviewedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  tenantId: string;
  entityType: DocumentEntityType;
  entityId: string;
  claimId?: string;
  name: string;
  description?: string;
  fileType: DocumentType;
  fileSize: number;
  storageKey: string;
  storagePath?: string;
  uploadedById: string;
  version: number;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  tenantId: string;
  userId?: string;
  channel: NotificationChannel;
  type: NotificationType;
  recipient: string;
  subject?: string;
  body: string;
  templateId?: string;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  retryCount: number;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface RiskMitigationPlan {
  id: string;
  insuredEntityId: string;
  riskAssessmentId: string;
  title: string;
  description: string;
  priority: MitigationPriority;
  status: MitigationStatus;
  recommendations: string[];
  actionItems: Record<string, any>[];
  estimatedCost?: number;
  actualCost?: number;
  startDate?: Date;
  completionDate?: Date;
  responsibleParty?: string;
  effectiveness?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  tenantId: string;
  name: string;
  category: TagCategory;
  color?: string;
  createdAt: Date;
}

export interface Metric {
  id: string;
  tenantId?: string;
  name: string;
  value: number;
  unit?: string;
  labels: Record<string, any>;
  recordedAt: Date;
}
