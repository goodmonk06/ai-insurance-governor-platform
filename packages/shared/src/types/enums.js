"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagCategory = exports.MitigationStatus = exports.MitigationPriority = exports.NotificationStatus = exports.NotificationType = exports.NotificationChannel = exports.DocumentEntityType = exports.DocumentType = exports.ClaimStatus = exports.ClaimType = exports.ScenarioType = exports.RiskRank = exports.InsuredEntityType = exports.QuoteStatus = exports.PolicyStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["UNDERWRITER"] = "underwriter";
    UserRole["SALES"] = "sales";
})(UserRole || (exports.UserRole = UserRole = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "draft";
    PolicyStatus["ACTIVE"] = "active";
    PolicyStatus["CANCELLED"] = "cancelled";
    PolicyStatus["EXPIRED"] = "expired";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["PENDING"] = "pending";
    QuoteStatus["QUOTED"] = "quoted";
    QuoteStatus["ACCEPTED"] = "accepted";
    QuoteStatus["REJECTED"] = "rejected";
    QuoteStatus["EXPIRED"] = "expired";
})(QuoteStatus || (exports.QuoteStatus = QuoteStatus = {}));
var InsuredEntityType;
(function (InsuredEntityType) {
    InsuredEntityType["FACILITY"] = "facility";
    InsuredEntityType["CORPORATION"] = "corporation";
    InsuredEntityType["INDIVIDUAL"] = "individual";
})(InsuredEntityType || (exports.InsuredEntityType = InsuredEntityType = {}));
var RiskRank;
(function (RiskRank) {
    RiskRank["LOW"] = "low";
    RiskRank["MEDIUM"] = "medium";
    RiskRank["HIGH"] = "high";
    RiskRank["CRITICAL"] = "critical";
})(RiskRank || (exports.RiskRank = RiskRank = {}));
var ScenarioType;
(function (ScenarioType) {
    ScenarioType["NURSING_HOME_FIRE"] = "nursing_home_fire";
    ScenarioType["MEDICAL_MALPRACTICE"] = "medical_malpractice";
    ScenarioType["EMPLOYEE_INJURY"] = "employee_injury";
    ScenarioType["EQUIPMENT_FAILURE"] = "equipment_failure";
    ScenarioType["INFECTION_OUTBREAK"] = "infection_outbreak";
    ScenarioType["NATURAL_DISASTER"] = "natural_disaster";
})(ScenarioType || (exports.ScenarioType = ScenarioType = {}));
var ClaimType;
(function (ClaimType) {
    ClaimType["PROPERTY_DAMAGE"] = "property_damage";
    ClaimType["LIABILITY"] = "liability";
    ClaimType["MEDICAL_MALPRACTICE"] = "medical_malpractice";
    ClaimType["BUSINESS_INTERRUPTION"] = "business_interruption";
})(ClaimType || (exports.ClaimType = ClaimType = {}));
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["SUBMITTED"] = "submitted";
    ClaimStatus["UNDER_REVIEW"] = "under_review";
    ClaimStatus["APPROVED"] = "approved";
    ClaimStatus["DENIED"] = "denied";
    ClaimStatus["PAID"] = "paid";
    ClaimStatus["CLOSED"] = "closed";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["PDF"] = "pdf";
    DocumentType["IMAGE"] = "image";
    DocumentType["EXCEL"] = "excel";
    DocumentType["WORD"] = "word";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentEntityType;
(function (DocumentEntityType) {
    DocumentEntityType["POLICY"] = "policy";
    DocumentEntityType["CLAIM"] = "claim";
    DocumentEntityType["INSPECTION"] = "inspection";
    DocumentEntityType["COMPLIANCE"] = "compliance";
    DocumentEntityType["CERTIFICATE"] = "certificate";
})(DocumentEntityType || (exports.DocumentEntityType = DocumentEntityType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["WEBHOOK"] = "webhook";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["POLICY_RENEWAL"] = "policy_renewal";
    NotificationType["CLAIM_UPDATE"] = "claim_update";
    NotificationType["HIGH_RISK_ALERT"] = "high_risk_alert";
    NotificationType["PAYMENT_DUE"] = "payment_due";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "pending";
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["DELIVERED"] = "delivered";
    NotificationStatus["FAILED"] = "failed";
    NotificationStatus["BOUNCED"] = "bounced";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var MitigationPriority;
(function (MitigationPriority) {
    MitigationPriority["LOW"] = "low";
    MitigationPriority["MEDIUM"] = "medium";
    MitigationPriority["HIGH"] = "high";
    MitigationPriority["CRITICAL"] = "critical";
})(MitigationPriority || (exports.MitigationPriority = MitigationPriority = {}));
var MitigationStatus;
(function (MitigationStatus) {
    MitigationStatus["PROPOSED"] = "proposed";
    MitigationStatus["IN_PROGRESS"] = "in_progress";
    MitigationStatus["COMPLETED"] = "completed";
    MitigationStatus["CANCELLED"] = "cancelled";
})(MitigationStatus || (exports.MitigationStatus = MitigationStatus = {}));
var TagCategory;
(function (TagCategory) {
    TagCategory["FACILITY"] = "facility";
    TagCategory["RISK"] = "risk";
    TagCategory["POLICY"] = "policy";
    TagCategory["GENERAL"] = "general";
})(TagCategory || (exports.TagCategory = TagCategory = {}));
//# sourceMappingURL=enums.js.map