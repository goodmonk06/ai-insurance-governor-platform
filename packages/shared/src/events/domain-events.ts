/**
 * Base interface for all domain events
 */
export interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  tenantId: string;
  occurredAt: Date;
  version: number;
  metadata?: Record<string, any>;
}

/**
 * Policy Events
 */
export interface PolicyCreatedEvent extends DomainEvent {
  eventType: 'policy.created';
  aggregateType: 'policy';
  data: {
    policyId: string;
    policyNumber: string;
    insuredEntityId: string;
    productName: string;
    premium: number;
    startDate: Date;
    endDate: Date;
  };
}

export interface PolicyActivatedEvent extends DomainEvent {
  eventType: 'policy.activated';
  aggregateType: 'policy';
  data: {
    policyId: string;
    policyNumber: string;
    activatedAt: Date;
  };
}

export interface PolicyCancelledEvent extends DomainEvent {
  eventType: 'policy.cancelled';
  aggregateType: 'policy';
  data: {
    policyId: string;
    policyNumber: string;
    cancelledAt: Date;
    reason?: string;
  };
}

export interface PolicyRenewedEvent extends DomainEvent {
  eventType: 'policy.renewed';
  aggregateType: 'policy';
  data: {
    oldPolicyId: string;
    newPolicyId: string;
    newPolicyNumber: string;
    renewedAt: Date;
  };
}

/**
 * Claim Events
 */
export interface ClaimSubmittedEvent extends DomainEvent {
  eventType: 'claim.submitted';
  aggregateType: 'claim';
  data: {
    claimId: string;
    claimNumber: string;
    policyId: string;
    insuredEntityId: string;
    claimType: string;
    claimedAmount: number;
    incidentDate: Date;
  };
}

export interface ClaimApprovedEvent extends DomainEvent {
  eventType: 'claim.approved';
  aggregateType: 'claim';
  data: {
    claimId: string;
    claimNumber: string;
    approvedAmount: number;
    approvedAt: Date;
    reviewedBy: string;
  };
}

export interface ClaimDeniedEvent extends DomainEvent {
  eventType: 'claim.denied';
  aggregateType: 'claim';
  data: {
    claimId: string;
    claimNumber: string;
    denialReason: string;
    deniedAt: Date;
    reviewedBy: string;
  };
}

export interface ClaimPaidEvent extends DomainEvent {
  eventType: 'claim.paid';
  aggregateType: 'claim';
  data: {
    claimId: string;
    claimNumber: string;
    paidAmount: number;
    paidAt: Date;
  };
}

/**
 * Risk Assessment Events
 */
export interface RiskAssessmentCompletedEvent extends DomainEvent {
  eventType: 'risk.assessment.completed';
  aggregateType: 'risk_assessment';
  data: {
    assessmentId: string;
    insuredEntityId: string;
    scenarioType: string;
    score: number;
    rank: string;
    assessedAt: Date;
  };
}

export interface HighRiskDetectedEvent extends DomainEvent {
  eventType: 'risk.high_risk_detected';
  aggregateType: 'risk_assessment';
  data: {
    assessmentId: string;
    insuredEntityId: string;
    insuredEntityName: string;
    scenarioType: string;
    score: number;
    rank: string;
    recommendations: string[];
  };
}

/**
 * Quote Events
 */
export interface QuoteRequestedEvent extends DomainEvent {
  eventType: 'quote.requested';
  aggregateType: 'quote';
  data: {
    quoteId: string;
    insuredEntityId: string;
    requestedBy: string;
    requestedAt: Date;
  };
}

export interface QuoteGeneratedEvent extends DomainEvent {
  eventType: 'quote.generated';
  aggregateType: 'quote';
  data: {
    quoteId: string;
    quotedPremium: number;
    expiresAt: Date;
  };
}

export interface QuoteAcceptedEvent extends DomainEvent {
  eventType: 'quote.accepted';
  aggregateType: 'quote';
  data: {
    quoteId: string;
    policyId: string;
    acceptedAt: Date;
  };
}

/**
 * Notification Events
 */
export interface NotificationSentEvent extends DomainEvent {
  eventType: 'notification.sent';
  aggregateType: 'notification';
  data: {
    notificationId: string;
    channel: string;
    type: string;
    recipient: string;
    sentAt: Date;
  };
}

export interface NotificationFailedEvent extends DomainEvent {
  eventType: 'notification.failed';
  aggregateType: 'notification';
  data: {
    notificationId: string;
    channel: string;
    type: string;
    recipient: string;
    failureReason: string;
    failedAt: Date;
  };
}

/**
 * Union type of all domain events
 */
export type AllDomainEvents =
  | PolicyCreatedEvent
  | PolicyActivatedEvent
  | PolicyCancelledEvent
  | PolicyRenewedEvent
  | ClaimSubmittedEvent
  | ClaimApprovedEvent
  | ClaimDeniedEvent
  | ClaimPaidEvent
  | RiskAssessmentCompletedEvent
  | HighRiskDetectedEvent
  | QuoteRequestedEvent
  | QuoteGeneratedEvent
  | QuoteAcceptedEvent
  | NotificationSentEvent
  | NotificationFailedEvent;

/**
 * Event handler function type
 */
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

/**
 * Event bus interface for publishing and subscribing to domain events
 */
export interface IEventBus {
  /**
   * Publish an event to the bus
   */
  publish<T extends DomainEvent>(event: T): Promise<void>;

  /**
   * Publish multiple events in a batch
   */
  publishBatch(events: DomainEvent[]): Promise<void>;

  /**
   * Subscribe to events of a specific type
   */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>,
    options?: {
      subscriberId?: string;
      priority?: number;
    },
  ): void;

  /**
   * Unsubscribe from events
   */
  unsubscribe(eventType: string, subscriberId: string): void;

  /**
   * Get all registered event types
   */
  getRegisteredEventTypes(): string[];
}
