import Queue from 'bull';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function policyReminderWorker() {
  const queue = new Queue('policy-reminders', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  });

  queue.process('renewal-reminder', async (job) => {
    const { policyId } = job.data;

    console.log(`Processing renewal reminder for policy: ${policyId}`);

    try {
      const policy = await prisma.policy.findUnique({
        where: { id: policyId },
        include: {
          insuredEntity: true,
          tenant: true,
        },
      });

      if (!policy) {
        throw new Error(`Policy not found: ${policyId}`);
      }

      if (policy.status !== 'active') {
        console.log(`Policy ${policyId} is not active, skipping reminder`);
        return { policyId, skipped: true };
      }

      // ここで実際には通知を送信する処理を実装
      // 例: メール送信、Slack通知、SMSなど
      console.log(`📧 Sending renewal reminder for policy ${policy.policyNumber}`);
      console.log(`  Tenant: ${policy.tenant.name}`);
      console.log(`  Insured: ${policy.insuredEntity.name}`);
      console.log(`  Expiry Date: ${policy.endDate.toISOString()}`);

      // 監査ログに記録
      await prisma.auditLog.create({
        data: {
          tenantId: policy.tenantId,
          action: 'RENEWAL_REMINDER_SENT',
          entityType: 'Policy',
          entityId: policyId,
          changes: {
            policyNumber: policy.policyNumber,
            endDate: policy.endDate,
          },
        },
      });

      return { policyId, sent: true };
    } catch (error) {
      console.error(`Failed to process renewal reminder for ${policyId}:`, error);
      throw error;
    }
  });

  // 定期的に期限が近い契約をチェックするジョブ
  queue.process('check-expiring-policies', async (job) => {
    console.log('Checking for expiring policies...');

    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const expiringPolicies = await prisma.policy.findMany({
        where: {
          status: 'active',
          endDate: {
            lte: futureDate,
            gte: new Date(),
          },
        },
      });

      console.log(`Found ${expiringPolicies.length} expiring policies`);

      // 各契約にリマインダージョブを追加
      for (const policy of expiringPolicies) {
        await queue.add('renewal-reminder', { policyId: policy.id });
      }

      return { checked: expiringPolicies.length };
    } catch (error) {
      console.error('Failed to check expiring policies:', error);
      throw error;
    }
  });

  // 毎日午前9時に期限が近い契約をチェック
  queue.add(
    'check-expiring-policies',
    {},
    {
      repeat: { cron: '0 9 * * *' },
    },
  );

  queue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed:`, result);
  });

  queue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);
  });

  return queue;
}
