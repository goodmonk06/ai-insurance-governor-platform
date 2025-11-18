export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export interface MetricLabels {
    [key: string]: string | number;
}
export interface MetricValue {
    value: number;
    timestamp?: Date;
    labels?: MetricLabels;
}
export interface MetricQuery {
    name: string;
    labels?: MetricLabels;
    startTime?: Date;
    endTime?: Date;
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
export interface MetricResult {
    name: string;
    type: MetricType;
    values: MetricValue[];
}
/**
 * Adapter interface for metrics and monitoring.
 * Implementations can use Prometheus, DataDog, CloudWatch, New Relic, etc.
 */
export interface IMetricsProvider {
    /**
     * Record a counter metric (monotonically increasing)
     */
    incrementCounter(name: string, value?: number, labels?: MetricLabels): Promise<void>;
    /**
     * Set a gauge metric (can go up or down)
     */
    setGauge(name: string, value: number, labels?: MetricLabels): Promise<void>;
    /**
     * Record a histogram value (for distributions)
     */
    recordHistogram(name: string, value: number, labels?: MetricLabels): Promise<void>;
    /**
     * Record a summary value (for percentiles)
     */
    recordSummary(name: string, value: number, labels?: MetricLabels): Promise<void>;
    /**
     * Query metrics data
     */
    query(query: MetricQuery): Promise<MetricResult>;
    /**
     * Record multiple metrics at once
     */
    recordBatch(metrics: Array<{
        name: string;
        type: MetricType;
        value: number;
        labels?: MetricLabels;
    }>): Promise<void>;
    /**
     * Create a timer that records duration when stopped
     */
    startTimer(name: string, labels?: MetricLabels): {
        stop: () => Promise<void>;
    };
    /**
     * Get provider name
     */
    getProviderName(): string;
}
/**
 * Common business metrics for the insurance platform
 */
export declare const PLATFORM_METRICS: {
    readonly POLICIES_CREATED: "policies.created";
    readonly POLICIES_ACTIVE: "policies.active";
    readonly POLICIES_EXPIRED: "policies.expired";
    readonly POLICIES_CANCELLED: "policies.cancelled";
    readonly PREMIUM_COLLECTED: "premium.collected";
    readonly CLAIMS_SUBMITTED: "claims.submitted";
    readonly CLAIMS_APPROVED: "claims.approved";
    readonly CLAIMS_DENIED: "claims.denied";
    readonly CLAIMS_PAID: "claims.paid";
    readonly CLAIM_AMOUNT_PAID: "claim.amount.paid";
    readonly CLAIM_PROCESSING_TIME: "claim.processing_time";
    readonly RISK_ASSESSMENTS_PERFORMED: "risk.assessments.performed";
    readonly HIGH_RISK_ENTITIES: "risk.high_risk_entities";
    readonly RISK_SCORE_AVG: "risk.score.avg";
    readonly QUOTES_REQUESTED: "quotes.requested";
    readonly QUOTES_ACCEPTED: "quotes.accepted";
    readonly QUOTE_CONVERSION_RATE: "quotes.conversion_rate";
    readonly API_REQUESTS: "api.requests";
    readonly API_ERRORS: "api.errors";
    readonly API_LATENCY: "api.latency";
    readonly DB_QUERY_TIME: "db.query_time";
    readonly MONTHLY_RECURRING_REVENUE: "business.mrr";
    readonly CUSTOMER_LIFETIME_VALUE: "business.ltv";
    readonly CHURN_RATE: "business.churn_rate";
};
//# sourceMappingURL=metrics-provider.interface.d.ts.map