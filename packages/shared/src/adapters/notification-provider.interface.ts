import { NotificationChannel, NotificationType } from '../types/enums';

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  type: NotificationType;
  subject?: string;
  bodyTemplate: string;
  variables: string[];
}

export interface NotificationRequest {
  channel: NotificationChannel;
  type: NotificationType;
  recipient: string;
  subject?: string;
  body: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  provider?: string;
  sentAt?: Date;
  error?: string;
}

/**
 * Adapter interface for sending notifications through various channels.
 * Implementations can use services like SendGrid, Twilio, AWS SNS, etc.
 */
export interface INotificationProvider {
  /**
   * Send a notification through the specified channel
   */
  send(request: NotificationRequest): Promise<NotificationResult>;

  /**
   * Send a notification using a pre-defined template
   */
  sendWithTemplate(
    templateId: string,
    recipient: string,
    variables: Record<string, any>,
  ): Promise<NotificationResult>;

  /**
   * Verify if a recipient is valid for the channel (e.g., email format, phone number)
   */
  validateRecipient(channel: NotificationChannel, recipient: string): Promise<boolean>;

  /**
   * Get delivery status for a sent notification
   */
  getStatus(messageId: string): Promise<{
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    error?: string;
  }>;

  /**
   * Get supported channels for this provider
   */
  getSupportedChannels(): NotificationChannel[];
}
