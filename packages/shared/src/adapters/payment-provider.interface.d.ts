export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'direct_debit' | 'wallet';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
export type Currency = 'JPY' | 'USD' | 'EUR';
export interface PaymentMethodDetails {
    type: PaymentMethod;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    bankName?: string;
    accountNumber?: string;
}
export interface PaymentRequest {
    amount: number;
    currency: Currency;
    paymentMethodId: string;
    description?: string;
    metadata?: Record<string, any>;
    customerId?: string;
    idempotencyKey?: string;
}
export interface PaymentResult {
    paymentId: string;
    status: PaymentStatus;
    amount: number;
    currency: Currency;
    paidAt?: Date;
    failureReason?: string;
    receiptUrl?: string;
    metadata?: Record<string, any>;
}
export interface RefundRequest {
    paymentId: string;
    amount?: number;
    reason?: string;
    metadata?: Record<string, any>;
}
export interface RefundResult {
    refundId: string;
    paymentId: string;
    amount: number;
    status: 'pending' | 'succeeded' | 'failed';
    createdAt: Date;
}
export interface Customer {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    metadata?: Record<string, any>;
}
/**
 * Adapter interface for payment processing.
 * Implementations can use Stripe, PayPal, Square, GMO Payment, etc.
 */
export interface IPaymentProvider {
    /**
     * Process a payment
     */
    processPayment(request: PaymentRequest): Promise<PaymentResult>;
    /**
     * Refund a payment (full or partial)
     */
    refundPayment(request: RefundRequest): Promise<RefundResult>;
    /**
     * Get payment status
     */
    getPaymentStatus(paymentId: string): Promise<PaymentResult>;
    /**
     * Create a customer in the payment system
     */
    createCustomer(customer: Customer): Promise<Customer & {
        customerId: string;
    }>;
    /**
     * Add a payment method to a customer
     */
    addPaymentMethod(customerId: string, paymentMethodDetails: PaymentMethodDetails): Promise<{
        paymentMethodId: string;
    }>;
    /**
     * List payment methods for a customer
     */
    listPaymentMethods(customerId: string): Promise<Array<PaymentMethodDetails & {
        id: string;
    }>>;
    /**
     * Remove a payment method
     */
    removePaymentMethod(paymentMethodId: string): Promise<void>;
    /**
     * Create a recurring payment subscription
     */
    createSubscription(customerId: string, paymentMethodId: string, amount: number, currency: Currency, interval: 'monthly' | 'quarterly' | 'yearly'): Promise<{
        subscriptionId: string;
        status: 'active' | 'inactive';
        nextPaymentDate: Date;
    }>;
    /**
     * Cancel a subscription
     */
    cancelSubscription(subscriptionId: string): Promise<void>;
    /**
     * Get supported payment methods
     */
    getSupportedMethods(): PaymentMethod[];
    /**
     * Get provider name
     */
    getProviderName(): string;
}
//# sourceMappingURL=payment-provider.interface.d.ts.map