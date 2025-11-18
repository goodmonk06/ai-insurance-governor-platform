import { NotificationChannel, NotificationType, NotificationStatus } from '../types/enums';

export interface CreateNotificationDto {
  userId?: string;
  channel: NotificationChannel;
  type: NotificationType;
  recipient: string;
  subject?: string;
  body: string;
  templateId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationDto {
  status?: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  retryCount?: number;
}

export interface NotificationQueryDto {
  tenantId?: string;
  userId?: string;
  channel?: NotificationChannel;
  type?: NotificationType;
  status?: NotificationStatus;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}
