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
export const PLATFORM_METRICS = {
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
} as const;
