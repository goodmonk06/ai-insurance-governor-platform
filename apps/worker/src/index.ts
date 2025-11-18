import * as dotenv from 'dotenv';
import { riskCalculationWorker } from './workers/risk-calculation.worker';
import { policyReminderWorker } from './workers/policy-reminder.worker';

dotenv.config();

async function bootstrap() {
  console.log('🔄 Starting workers...');

  // リスク計算ワーカー起動
  await riskCalculationWorker();
  console.log('✅ Risk calculation worker started');

  // 契約リマインダーワーカー起動
  await policyReminderWorker();
  console.log('✅ Policy reminder worker started');

  console.log('🚀 All workers are running');
}

bootstrap().catch((error) => {
  console.error('Failed to start workers:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing workers');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing workers');
  process.exit(0);
});
