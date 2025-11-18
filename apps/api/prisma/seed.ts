import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // テナントの作成
  const tenant1 = await prisma.tenant.upsert({
    where: { id: 'tenant-1' },
    update: {},
    create: {
      id: 'tenant-1',
      name: '東京介護保険代理店',
      type: 'agency',
      isActive: true,
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { id: 'tenant-2' },
    update: {},
    create: {
      id: 'tenant-2',
      name: '全国医療保険サービス',
      type: 'corporate',
      isActive: true,
    },
  });

  console.log('✅ Tenants created');

  // ユーザーの作成
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '管理者 太郎',
      role: 'admin',
      tenantId: tenant1.id,
      isActive: true,
    },
  });

  const underwriter = await prisma.user.upsert({
    where: { email: 'underwriter@example.com' },
    update: {},
    create: {
      email: 'underwriter@example.com',
      password: hashedPassword,
      name: '査定担当 花子',
      role: 'underwriter',
      tenantId: tenant1.id,
      isActive: true,
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'sales@example.com' },
    update: {},
    create: {
      email: 'sales@example.com',
      password: hashedPassword,
      name: '営業担当 次郎',
      role: 'sales',
      tenantId: tenant1.id,
      isActive: true,
    },
  });

  console.log('✅ Users created');

  // 被保険者（介護施設）の作成
  const facility1 = await prisma.insuredEntity.create({
    data: {
      tenantId: tenant1.id,
      type: 'facility',
      name: 'さくら介護ホーム',
      taxId: '1234567890',
      address: '東京都渋谷区桜丘町1-1-1',
      phoneNumber: '03-1234-5678',
      email: 'info@sakura-kaigo.jp',
      metadata: {
        facilityType: 'nursing_home',
        bedCount: 50,
        employeeCount: 25,
        yearsInOperation: 15,
        hasFireSafety: true,
        hasEmergencyPlan: true,
        annualRevenue: 250000000,
        certifications: ['介護保険事業所指定', '優良事業所認定'],
      },
    },
  });

  const facility2 = await prisma.insuredEntity.create({
    data: {
      tenantId: tenant1.id,
      type: 'facility',
      name: 'ひまわりデイサービスセンター',
      taxId: '0987654321',
      address: '神奈川県横浜市中区本町2-2-2',
      phoneNumber: '045-9876-5432',
      email: 'contact@himawari-day.jp',
      metadata: {
        facilityType: 'day_service',
        bedCount: 30,
        employeeCount: 15,
        yearsInOperation: 8,
        hasFireSafety: true,
        hasEmergencyPlan: false,
        annualRevenue: 120000000,
        certifications: ['介護保険事業所指定'],
      },
    },
  });

  const facility3 = await prisma.insuredEntity.create({
    data: {
      tenantId: tenant1.id,
      type: 'facility',
      name: 'あおぞら訪問看護ステーション',
      taxId: '1122334455',
      address: '千葉県千葉市美浜区中央3-3-3',
      phoneNumber: '043-1122-3344',
      email: 'info@aozora-nursing.jp',
      metadata: {
        facilityType: 'visiting_nurse',
        employeeCount: 12,
        yearsInOperation: 5,
        hasFireSafety: false,
        hasEmergencyPlan: true,
        annualRevenue: 80000000,
        certifications: ['訪問看護事業所指定'],
      },
    },
  });

  console.log('✅ Insured entities created');

  // リスク評価の作成
  await prisma.riskAssessment.createMany({
    data: [
      {
        insuredEntityId: facility1.id,
        scenarioType: 'nursing_home_fire',
        score: 25,
        rank: 'low',
        detailJson: {
          probability: 0.25,
          severity: 0.3,
          expectedLoss: 6250000,
          recommendations: [
            '定期的な避難訓練の実施を推奨します',
          ],
          factors: [
            { name: '従業員数', impact: 0.1, description: '25名の従業員が在籍' },
            { name: '収容人数', impact: 0.2, description: '50床の収容能力' },
            { name: '運営年数', impact: -0.2, description: '15年の運営実績' },
            { name: '安全対策', impact: -0.3, description: '適切な安全対策が実施されています' },
          ],
        },
        assessedAt: new Date(),
      },
      {
        insuredEntityId: facility1.id,
        scenarioType: 'infection_outbreak',
        score: 45,
        rank: 'medium',
        detailJson: {
          probability: 0.45,
          severity: 0.5,
          expectedLoss: 11250000,
          recommendations: [
            '感染症対策マニュアルの整備と定期的な見直しが必要です',
            '定期的な避難訓練の実施を推奨します',
          ],
          factors: [
            { name: '従業員数', impact: 0.1, description: '25名の従業員が在籍' },
            { name: '収容人数', impact: 0.2, description: '50床の収容能力' },
            { name: '運営年数', impact: -0.2, description: '15年の運営実績' },
            { name: '安全対策', impact: -0.3, description: '適切な安全対策が実施されています' },
          ],
        },
        assessedAt: new Date(),
      },
      {
        insuredEntityId: facility2.id,
        scenarioType: 'nursing_home_fire',
        score: 55,
        rank: 'medium',
        detailJson: {
          probability: 0.55,
          severity: 0.5,
          expectedLoss: 6600000,
          recommendations: [
            '緊急時対応マニュアルの整備が必要です',
            '定期的な避難訓練の実施を推奨します',
          ],
          factors: [
            { name: '従業員数', impact: 0.1, description: '15名の従業員が在籍' },
            { name: '収容人数', impact: 0.2, description: '30床の収容能力' },
            { name: '運営年数', impact: 0.1, description: '8年の運営実績' },
            { name: '安全対策', impact: 0.2, description: '安全対策の強化が必要です' },
          ],
        },
        assessedAt: new Date(),
      },
      {
        insuredEntityId: facility3.id,
        scenarioType: 'medical_malpractice',
        score: 48,
        rank: 'medium',
        detailJson: {
          probability: 0.48,
          severity: 0.5,
          expectedLoss: 3840000,
          recommendations: [
            '運営実績が浅いため、経験豊富な管理者の配置を推奨します',
            '医療従事者向けの定期的な研修実施を推奨します',
            '緊急時対応マニュアルの整備が必要です',
          ],
          factors: [
            { name: '従業員数', impact: 0.1, description: '12名の従業員が在籍' },
            { name: '運営年数', impact: 0.1, description: '5年の運営実績' },
            { name: '安全対策', impact: 0.2, description: '安全対策の強化が必要です' },
          ],
        },
        assessedAt: new Date(),
      },
    ],
  });

  console.log('✅ Risk assessments created');

  // 保険契約の作成
  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const policy1 = await prisma.policy.create({
    data: {
      tenantId: tenant1.id,
      insuredEntityId: facility1.id,
      policyNumber: 'POL-2024-001',
      status: 'active',
      productName: '介護施設総合保険プラン',
      premium: 1200000,
      coverageJson: {
        火災保険: '最大5億円',
        賠償責任: '最大3億円',
        施設管理者賠償: '最大1億円',
        従業員災害補償: '最大5000万円',
      },
      startDate: now,
      endDate: oneYearLater,
    },
  });

  const policy2 = await prisma.policy.create({
    data: {
      tenantId: tenant1.id,
      insuredEntityId: facility2.id,
      policyNumber: 'POL-2024-002',
      status: 'active',
      productName: 'デイサービス向け保険プラン',
      premium: 600000,
      coverageJson: {
        火災保険: '最大2億円',
        賠償責任: '最大1億円',
        施設管理者賠償: '最大5000万円',
      },
      startDate: now,
      endDate: oneYearLater,
    },
  });

  const draftPolicy = await prisma.policy.create({
    data: {
      tenantId: tenant1.id,
      insuredEntityId: facility3.id,
      policyNumber: 'POL-2024-003',
      status: 'draft',
      productName: '訪問看護ステーション保険プラン',
      premium: 450000,
      coverageJson: {
        賠償責任: '最大1億円',
        医療過誤: '最大5000万円',
        従業員災害補償: '最大3000万円',
      },
      startDate: now,
      endDate: oneYearLater,
    },
  });

  console.log('✅ Policies created');

  // 見積もりリクエストの作成
  await prisma.quoteRequest.createMany({
    data: [
      {
        tenantId: tenant1.id,
        insuredEntityId: facility3.id,
        requestedById: sales.id,
        status: 'quoted',
        answersJson: {
          facilityType: 'visiting_nurse',
          employeeCount: 12,
          serviceArea: '千葉市全域',
          monthlyVisits: 450,
          specializedCare: ['小児看護', '終末期ケア'],
        },
        quotedPremium: 450000,
        quotedCoverage: {
          賠償責任: '最大1億円',
          医療過誤: '最大5000万円',
          従業員災害補償: '最大3000万円',
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Quote requests created');

  // 監査ログの作成
  await prisma.auditLog.createMany({
    data: [
      {
        tenantId: tenant1.id,
        userId: adminUser.id,
        action: 'CREATE_POLICY',
        entityType: 'Policy',
        entityId: policy1.id,
        changes: {
          status: 'active',
          policyNumber: 'POL-2024-001',
        },
        ipAddress: '192.168.1.1',
      },
      {
        tenantId: tenant1.id,
        userId: underwriter.id,
        action: 'ASSESS_RISK',
        entityType: 'RiskAssessment',
        entityId: facility1.id,
        changes: {
          scenarioType: 'nursing_home_fire',
          rank: 'low',
        },
        ipAddress: '192.168.1.2',
      },
    ],
  });

  console.log('✅ Audit logs created');

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📋 Sample credentials:');
  console.log('  Admin: admin@example.com / password123');
  console.log('  Underwriter: underwriter@example.com / password123');
  console.log('  Sales: sales@example.com / password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
