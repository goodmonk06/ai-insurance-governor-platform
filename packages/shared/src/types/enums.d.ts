export declare enum UserRole {
    ADMIN = "admin",
    UNDERWRITER = "underwriter",
    SALES = "sales"
}
export declare enum PolicyStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum QuoteStatus {
    PENDING = "pending",
    QUOTED = "quoted",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare enum InsuredEntityType {
    FACILITY = "facility",
    CORPORATION = "corporation",
    INDIVIDUAL = "individual"
}
export declare enum RiskRank {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum ScenarioType {
    NURSING_HOME_FIRE = "nursing_home_fire",
    MEDICAL_MALPRACTICE = "medical_malpractice",
    EMPLOYEE_INJURY = "employee_injury",
    EQUIPMENT_FAILURE = "equipment_failure",
    INFECTION_OUTBREAK = "infection_outbreak",
    NATURAL_DISASTER = "natural_disaster"
}
export declare enum ClaimType {
    PROPERTY_DAMAGE = "property_damage",
    LIABILITY = "liability",
    MEDICAL_MALPRACTICE = "medical_malpractice",
    BUSINESS_INTERRUPTION = "business_interruption"
}
export declare enum ClaimStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    DENIED = "denied",
    PAID = "paid",
    CLOSED = "closed"
}
export declare enum DocumentType {
    PDF = "pdf",
    IMAGE = "image",
    EXCEL = "excel",
    WORD = "word"
}
export declare enum DocumentEntityType {
    POLICY = "policy",
    CLAIM = "claim",
    INSPECTION = "inspection",
    COMPLIANCE = "compliance",
    CERTIFICATE = "certificate"
}
export declare enum NotificationChannel {
    EMAIL = "email",
    SMS = "sms",
    IN_APP = "in_app",
    WEBHOOK = "webhook"
}
export declare enum NotificationType {
    POLICY_RENEWAL = "policy_renewal",
    CLAIM_UPDATE = "claim_update",
    HIGH_RISK_ALERT = "high_risk_alert",
    PAYMENT_DUE = "payment_due"
}
export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered",
    FAILED = "failed",
    BOUNCED = "bounced"
}
export declare enum MitigationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum MitigationStatus {
    PROPOSED = "proposed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum TagCategory {
    FACILITY = "facility",
    RISK = "risk",
    POLICY = "policy",
    GENERAL = "general"
}
//# sourceMappingURL=enums.d.ts.map