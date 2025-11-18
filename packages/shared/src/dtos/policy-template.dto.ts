export interface CreatePolicyTemplateDto {
  name: string;
  description?: string;
  facilityTypes: string[];
  coverageConfig: Record<string, any>;
  premiumFormula: Record<string, any>;
  underwritingRules: Record<string, any>;
  isPublic?: boolean;
}

export interface UpdatePolicyTemplateDto {
  name?: string;
  description?: string;
  facilityTypes?: string[];
  coverageConfig?: Record<string, any>;
  premiumFormula?: Record<string, any>;
  underwritingRules?: Record<string, any>;
  isActive?: boolean;
  isPublic?: boolean;
}

export interface PolicyTemplateQueryDto {
  facilityType?: string;
  isActive?: boolean;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
