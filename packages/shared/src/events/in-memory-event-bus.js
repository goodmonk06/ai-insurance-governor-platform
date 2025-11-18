"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEventBus = void 0;
/**
 * Simple in-memory event bus implementation for development and testing.
 * For production, consider using Redis, RabbitMQ, AWS EventBridge, etc.
 */
class InMemoryEventBus {
    subscriptions = new Map();
    eventHistory = [];
    maxHistorySize;
    constructor(options) {
        this.maxHistorySize = options?.maxHistorySize || 1000;
    }
    async publish(event) {
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
            }
            catch (error) {
                console.error(`Error handling event ${event.eventType} in subscriber ${subscription.subscriberId}:`, error);
                // Continue with other handlers even if one fails
            }
        }
    }
    async publishBatch(events) {
        for (const event of events) {
            await this.publish(event);
        }
    }
    subscribe(eventType, handler, options) {
        const subscriberId = options?.subscriberId || `subscriber-${Date.now()}-${Math.random()}`;
        const priority = options?.priority || 0;
        const subscription = {
            subscriberId,
            handler: handler,
            priority,
        };
        const existing = this.subscriptions.get(eventType) || [];
        existing.push(subscription);
        this.subscriptions.set(eventType, existing);
    }
    unsubscribe(eventType, subscriberId) {
        const existing = this.subscriptions.get(eventType);
        if (!existing) {
            return;
        }
        const filtered = existing.filter((s) => s.subscriberId !== subscriberId);
        if (filtered.length === 0) {
            this.subscriptions.delete(eventType);
        }
        else {
            this.subscriptions.set(eventType, filtered);
        }
    }
    getRegisteredEventTypes() {
        return Array.from(this.subscriptions.keys());
    }
    /**
     * Get event history (useful for testing and debugging)
     */
    getEventHistory() {
        return [...this.eventHistory];
    }
    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
    }
    /**
     * Clear all subscriptions
     */
    clearSubscriptions() {
        this.subscriptions.clear();
    }
    /**
     * Get subscriber count for an event type
     */
    getSubscriberCount(eventType) {
        return (this.subscriptions.get(eventType) || []).length;
    }
}
exports.InMemoryEventBus = InMemoryEventBus;
//# sourceMappingURL=in-memory-event-bus.js.map