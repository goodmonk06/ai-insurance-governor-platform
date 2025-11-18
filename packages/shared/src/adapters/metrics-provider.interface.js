"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_METRICS = void 0;
/**
 * Common business metrics for the insurance platform
 */
exports.PLATFORM_METRICS = {
    // Policy metrics
    POLICIES_CREATED: 'policies.created',
    POLICIES_ACTIVE: 'policies.active',
    POLICIES_EXPIRED: 'policies.expired',
    POLICIES_CANCELLED: 'policies.cancelled',
    PREMIUM_COLLECTED: 'premium.collected',
    // Claims metrics
    CLAIMS_SUBMITTED: 'claims.submitted',
    CLAIMS_APPROVED: 'claims.approved',
    CLAIMS_DENIED: 'claims.denied',
    CLAIMS_PAID: 'claims.paid',
    CLAIM_AMOUNT_PAID: 'claim.amount.paid',
    CLAIM_PROCESSING_TIME: 'claim.processing_time',
    // Risk assessment metrics
    RISK_ASSESSMENTS_PERFORMED: 'risk.assessments.performed',
    HIGH_RISK_ENTITIES: 'risk.high_risk_entities',
    RISK_SCORE_AVG: 'risk.score.avg',
    // Quote metrics
    QUOTES_REQUESTED: 'quotes.requested',
    QUOTES_ACCEPTED: 'quotes.accepted',
    QUOTE_CONVERSION_RATE: 'quotes.conversion_rate',
    // System metrics
    API_REQUESTS: 'api.requests',
    API_ERRORS: 'api.errors',
    API_LATENCY: 'api.latency',
    DB_QUERY_TIME: 'db.query_time',
    // Business metrics
    MONTHLY_RECURRING_REVENUE: 'business.mrr',
    CUSTOMER_LIFETIME_VALUE: 'business.ltv',
    CHURN_RATE: 'business.churn_rate',
};
//# sourceMappingURL=metrics-provider.interface.js.map