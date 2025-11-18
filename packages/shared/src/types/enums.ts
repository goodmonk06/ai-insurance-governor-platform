export enum UserRole {
  ADMIN = 'admin',
  UNDERWRITER = 'underwriter',
  SALES = 'sales',
}

export enum PolicyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum QuoteStatus {
  PENDING = 'pending',
  QUOTED = 'quoted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum InsuredEntityType {
  FACILITY = 'facility',
  CORPORATION = 'corporation',
  INDIVIDUAL = 'individual',
}

export enum RiskRank {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ScenarioType {
  NURSING_HOME_FIRE = 'nursing_home_fire',
  MEDICAL_MALPRACTICE = 'medical_malpractice',
  EMPLOYEE_INJURY = 'employee_injury',
  EQUIPMENT_FAILURE = 'equipment_failure',
  INFECTION_OUTBREAK = 'infection_outbreak',
  NATURAL_DISASTER = 'natural_disaster',
}
