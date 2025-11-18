import { IEventBus, DomainEvent, EventHandler } from './domain-events';

interface Subscription {
  subscriberId: string;
  handler: EventHandler;
  priority: number;
}

/**
 * Simple in-memory event bus implementation for development and testing.
 * For production, consider using Redis, RabbitMQ, AWS EventBridge, etc.
 */
export class InMemoryEventBus implements IEventBus {
  private subscriptions: Map<string, Subscription[]> = new Map();
  private eventHistory: DomainEvent[] = [];
  private maxHistorySize: number;

  constructor(options?: { maxHistorySize?: number }) {
    this.maxHistorySize = options?.maxHistorySize || 1000;
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Get subscribers for this event type
    const subscribers = this.subscriptions.get(event.eventType) || [];

    // Sort by priority (higher priority first)
    const sortedSubscribers = [...subscribers].sort((a, b) => b.priority - a.priority);

    // Execute handlers sequentially
    for (const subscription of sortedSubscribers) {
      try {
        await subscription.handler(event);
      } catch (error) {
        console.error(
          `Error handling event ${event.eventType} in subscriber ${subscription.subscriberId}:`,
          error,
        );
        // Continue with other handlers even if one fails
      }
    }
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>,
    options?: {
      subscriberId?: string;
      priority?: number;
    },
  ): void {
    const subscriberId = options?.subscriberId || `subscriber-${Date.now()}-${Math.random()}`;
    const priority = options?.priority || 0;

    const subscription: Subscription = {
      subscriberId,
      handler: handler as EventHandler,
      priority,
    };

    const existing = this.subscriptions.get(eventType) || [];
    existing.push(subscription);
    this.subscriptions.set(eventType, existing);
  }

  unsubscribe(eventType: string, subscriberId: string): void {
    const existing = this.subscriptions.get(eventType);
    if (!existing) {
      return;
    }

    const filtered = existing.filter((s) => s.subscriberId !== subscriberId);
    if (filtered.length === 0) {
      this.subscriptions.delete(eventType);
    } else {
      this.subscriptions.set(eventType, filtered);
    }
  }

  getRegisteredEventTypes(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Get event history (useful for testing and debugging)
   */
  getEventHistory(): DomainEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Clear all subscriptions
   */
  clearSubscriptions(): void {
    this.subscriptions.clear();
  }

  /**
   * Get subscriber count for an event type
   */
  getSubscriberCount(eventType: string): number {
    return (this.subscriptions.get(eventType) || []).length;
  }
}
