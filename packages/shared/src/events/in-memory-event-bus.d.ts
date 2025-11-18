import { IEventBus, DomainEvent, EventHandler } from './domain-events';
/**
 * Simple in-memory event bus implementation for development and testing.
 * For production, consider using Redis, RabbitMQ, AWS EventBridge, etc.
 */
export declare class InMemoryEventBus implements IEventBus {
    private subscriptions;
    private eventHistory;
    private maxHistorySize;
    constructor(options?: {
        maxHistorySize?: number;
    });
    publish<T extends DomainEvent>(event: T): Promise<void>;
    publishBatch(events: DomainEvent[]): Promise<void>;
    subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>, options?: {
        subscriberId?: string;
        priority?: number;
    }): void;
    unsubscribe(eventType: string, subscriberId: string): void;
    getRegisteredEventTypes(): string[];
    /**
     * Get event history (useful for testing and debugging)
     */
    getEventHistory(): DomainEvent[];
    /**
     * Clear event history
     */
    clearHistory(): void;
    /**
     * Clear all subscriptions
     */
    clearSubscriptions(): void;
    /**
     * Get subscriber count for an event type
     */
    getSubscriberCount(eventType: string): number;
}
//# sourceMappingURL=in-memory-event-bus.d.ts.map