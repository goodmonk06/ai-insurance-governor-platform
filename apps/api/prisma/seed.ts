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

  // ポリシーテンプレートの作成
  const template1 = await prisma.policyTemplate.create({
    data: {
      tenantId: tenant1.id,
      name: '介護施設総合保険テンプレート',
      description: '介護施設向けの包括的な保険商品テンプレート',
      facilityTypes: ['nursing_home', 'day_service'],
      coverageConfig: {
        baseCoverage: {
          fire: { maxAmount: 500000000, deductible: 100000 },
          liability: { maxAmount: 300000000, deductible: 50000 },
          facilityManager: { maxAmount: 100000000, deductible: 50000 },
        },
        optionalCoverage: {
          employeeCompensation: { maxAmount: 50000000 },
          businessInterruption: { maxAmount: 100000000 },
        },
      },
      premiumFormula: {
        baseRate: 0.05,
        factors: {
          bedCount: { weight: 0.3, min: 0, max: 200 },
          employeeCount: { weight: 0.2, min: 0, max: 100 },
          yearsInOperation: { weight: -0.1, min: 0, max: 50 },
          hasFireSafety: { weight: -0.15, value: true },
          hasEmergencyPlan: { weight: -0.1, value: true },
        },
      },
      underwritingRules: {
        minBedCount: 10,
        minYearsInOperation: 1,
        requiresFireSafety: true,
        maxRiskScore: 70,
      },
      isActive: true,
      isPublic: true,
      version: 1,
      createdById: adminUser.id,
    },
  });

  const template2 = await prisma.policyTemplate.create({
    data: {
      tenantId: tenant1.id,
      name: '訪問看護ステーション保険テンプレート',
      description: '訪問看護ステーション向けの医療過誤対応保険',
      facilityTypes: ['visiting_nurse'],
      coverageConfig: {
        baseCoverage: {
          liability: { maxAmount: 100000000, deductible: 50000 },
          malpractice: { maxAmount: 50000000, deductible: 100000 },
        },
        optionalCoverage: {
          employeeCompensation: { maxAmount: 30000000 },
        },
      },
      premiumFormula: {
        baseRate: 0.04,
        factors: {
          employeeCount: { weight: 0.3, min: 0, max: 50 },
          monthlyVisits: { weight: 0.2, min: 0, max: 1000 },
          yearsInOperation: { weight: -0.1, min: 0, max: 30 },
        },
      },
      underwritingRules: {
        minEmployeeCount: 3,
        minYearsInOperation: 1,
        maxRiskScore: 65,
      },
      isActive: true,
      isPublic: false,
      version: 1,
      createdById: underwriter.id,
    },
  });

  console.log('✅ Policy templates created');

  // クレーム（保険金請求）の作成
  const claim1 = await prisma.claim.create({
    data: {
      tenantId: tenant1.id,
      policyId: policy1.id,
      insuredEntityId: facility1.id,
      claimNumber: 'CLM-202401-0001',
      claimType: 'property_damage',
      status: 'approved',
      incidentDate: new Date('2024-01-10'),
      reportedDate: new Date('2024-01-12'),
      description: '厨房での小火により、調理機器と壁面の一部が損傷しました。',
      claimedAmount: 2500000,
      approvedAmount: 2300000,
      adjusterNotes: [
        {
          timestamp: new Date('2024-01-15'),
          author: underwriter.name,
          note: '現場調査完了。損害額を査定しました。',
        },
        {
          timestamp: new Date('2024-01-18'),
          author: underwriter.name,
          note: '修理見積もりを確認し、承認額を決定しました。',
        },
      ],
      reviewedById: underwriter.id,
      reviewedAt: new Date('2024-01-18'),
    },
  });

  const claim2 = await prisma.claim.create({
    data: {
      tenantId: tenant1.id,
      policyId: policy1.id,
      insuredEntityId: facility1.id,
      claimNumber: 'CLM-202401-0002',
      claimType: 'liability',
      status: 'under_review',
      incidentDate: new Date('2024-01-20'),
      reportedDate: new Date('2024-01-22'),
      description: '入居者の転倒事故により、骨折の治療費が発生しました。',
      claimedAmount: 850000,
      adjusterNotes: [
        {
          timestamp: new Date('2024-01-23'),
          author: underwriter.name,
          note: '事故報告書を受領。詳細調査を開始します。',
        },
      ],
      reviewedById: underwriter.id,
      reviewedAt: new Date('2024-01-23'),
    },
  });

  const claim3 = await prisma.claim.create({
    data: {
      tenantId: tenant1.id,
      policyId: policy2.id,
      insuredEntityId: facility2.id,
      claimNumber: 'CLM-202401-0003',
      claimType: 'property_damage',
      status: 'submitted',
      incidentDate: new Date('2024-01-25'),
      reportedDate: new Date('2024-01-26'),
      description: '台風による屋根の損傷が発生しました。',
      claimedAmount: 1200000,
      adjusterNotes: [],
    },
  });

  console.log('✅ Claims created');

  // ドキュメントの作成
  await prisma.document.createMany({
    data: [
      {
        tenantId: tenant1.id,
        entityType: 'policy',
        entityId: policy1.id,
        name: '保険証券_POL-2024-001.pdf',
        description: 'さくら介護ホームの保険証券',
        fileType: 'pdf',
        fileSize: 245678,
        storageKey: 'policies/tenant-1/POL-2024-001/certificate.pdf',
        uploadedById: adminUser.id,
        version: 1,
        tags: ['certificate', 'active'],
        metadata: {},
      },
      {
        tenantId: tenant1.id,
        entityType: 'claim',
        entityId: claim1.id,
        claimId: claim1.id,
        name: '事故報告書_CLM-202401-0001.pdf',
        description: '厨房火災の事故報告書',
        fileType: 'pdf',
        fileSize: 156789,
        storageKey: 'claims/tenant-1/CLM-202401-0001/accident-report.pdf',
        uploadedById: sales.id,
        version: 1,
        tags: ['claim', 'accident-report'],
        metadata: { incidentType: 'fire' },
      },
      {
        tenantId: tenant1.id,
        entityType: 'claim',
        entityId: claim1.id,
        claimId: claim1.id,
        name: '修理見積書.pdf',
        description: '調理機器修理の見積書',
        fileType: 'pdf',
        fileSize: 98765,
        storageKey: 'claims/tenant-1/CLM-202401-0001/repair-estimate.pdf',
        uploadedById: sales.id,
        version: 1,
        tags: ['claim', 'estimate'],
        metadata: {},
      },
      {
        tenantId: tenant1.id,
        entityType: 'inspection',
        entityId: facility1.id,
        name: '施設点検報告書_2024年1月.pdf',
        description: '月次施設点検報告書',
        fileType: 'pdf',
        fileSize: 234567,
        storageKey: 'inspections/tenant-1/facility-1/2024-01.pdf',
        uploadedById: adminUser.id,
        version: 1,
        tags: ['inspection', 'monthly'],
        metadata: { inspectionDate: '2024-01-05' },
      },
    ],
  });

  console.log('✅ Documents created');

  // 通知の作成
  await prisma.notification.createMany({
    data: [
      {
        tenantId: tenant1.id,
        userId: adminUser.id,
        channel: 'email',
        type: 'claim_update',
        recipient: 'admin@example.com',
        subject: '保険金請求が承認されました',
        body: 'クレーム番号 CLM-202401-0001 が承認されました。承認額: ¥2,300,000',
        status: 'delivered',
        sentAt: new Date('2024-01-18T10:00:00'),
        deliveredAt: new Date('2024-01-18T10:00:15'),
        retryCount: 0,
        metadata: { claimId: claim1.id, claimNumber: 'CLM-202401-0001' },
      },
      {
        tenantId: tenant1.id,
        userId: underwriter.id,
        channel: 'in_app',
        type: 'high_risk_alert',
        recipient: 'underwriter@example.com',
        body: 'ひまわりデイサービスセンターのリスク評価がmediumランクです。',
        status: 'delivered',
        sentAt: new Date('2024-01-20T09:00:00'),
        deliveredAt: new Date('2024-01-20T09:00:01'),
        retryCount: 0,
        metadata: { insuredEntityId: facility2.id, riskRank: 'medium' },
      },
      {
        tenantId: tenant1.id,
        channel: 'email',
        type: 'policy_renewal',
        recipient: 'info@sakura-kaigo.jp',
        subject: '保険契約の更新時期が近づいています',
        body: '貴施設の保険契約 POL-2024-001 の更新時期が1ヶ月後に迫っています。',
        status: 'pending',
        retryCount: 0,
        metadata: { policyId: policy1.id },
      },
    ],
  });

  console.log('✅ Notifications created');

  // リスク軽減計画の作成
  const riskAssessment = await prisma.riskAssessment.findFirst({
    where: {
      insuredEntityId: facility2.id,
      scenarioType: 'nursing_home_fire',
    },
  });

  if (riskAssessment) {
    await prisma.riskMitigationPlan.create({
      data: {
        insuredEntityId: facility2.id,
        riskAssessmentId: riskAssessment.id,
        title: '緊急時対応体制の強化計画',
        description: '火災リスクを低減するための緊急時対応マニュアル整備と訓練実施',
        priority: 'high',
        status: 'in_progress',
        recommendations: [
          '緊急時対応マニュアルの整備',
          '月次避難訓練の実施',
          '消防設備の定期点検',
          '職員への安全教育研修',
        ],
        actionItems: [
          {
            id: 1,
            task: 'マニュアル作成',
            assignee: '施設長',
            dueDate: '2024-02-15',
            status: 'in_progress',
          },
          {
            id: 2,
            task: '避難訓練計画立案',
            assignee: '安全管理者',
            dueDate: '2024-02-10',
            status: 'completed',
          },
          {
            id: 3,
            task: '消防設備点検業者選定',
            assignee: '総務担当',
            dueDate: '2024-02-05',
            status: 'completed',
          },
        ],
        estimatedCost: 500000,
        startDate: new Date('2024-01-15'),
        responsibleParty: '施設長 山田太郎',
        notes: '優先度が高いため、2月末までの完了を目指しています。',
      },
    });
  }

  console.log('✅ Risk mitigation plans created');

  // タグの作成
  await prisma.tag.createMany({
    data: [
      { tenantId: tenant1.id, name: '高リスク', category: 'risk', color: '#FF0000' },
      { tenantId: tenant1.id, name: '要注意', category: 'risk', color: '#FFA500' },
      { tenantId: tenant1.id, name: '新規契約', category: 'policy', color: '#00FF00' },
      { tenantId: tenant1.id, name: '更新対象', category: 'policy', color: '#0000FF' },
      { tenantId: tenant1.id, name: '介護施設', category: 'facility', color: '#800080' },
      { tenantId: tenant1.id, name: 'VIP顧客', category: 'general', color: '#FFD700' },
    ],
  });

  console.log('✅ Tags created');

  // メトリクスの作成
  const metricsDate = new Date();
  await prisma.metric.createMany({
    data: [
      {
        tenantId: tenant1.id,
        name: 'policies.active',
        value: 2,
        unit: 'count',
        labels: { period: 'current' },
        recordedAt: metricsDate,
      },
      {
        tenantId: tenant1.id,
        name: 'premium.collected',
        value: 1800000,
        unit: 'JPY',
        labels: { period: 'monthly', month: '2024-01' },
        recordedAt: metricsDate,
      },
      {
        tenantId: tenant1.id,
        name: 'claims.submitted',
        value: 3,
        unit: 'count',
        labels: { period: 'monthly', month: '2024-01' },
        recordedAt: metricsDate,
      },
      {
        tenantId: tenant1.id,
        name: 'claim.amount.paid',
        value: 0,
        unit: 'JPY',
        labels: { period: 'monthly', month: '2024-01' },
        recordedAt: metricsDate,
      },
      {
        tenantId: tenant1.id,
        name: 'risk.assessments.performed',
        value: 4,
        unit: 'count',
        labels: { period: 'monthly', month: '2024-01' },
        recordedAt: metricsDate,
      },
      {
        tenantId: tenant1.id,
        name: 'risk.score.avg',
        value: 43.25,
        unit: 'score',
        labels: { period: 'current' },
        recordedAt: metricsDate,
      },
    ],
  });

  console.log('✅ Metrics created');

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📋 Sample credentials:');
  console.log('  Admin: admin@example.com / password123');
  console.log('  Underwriter: underwriter@example.com / password123');
  console.log('  Sales: sales@example.com / password123');
  console.log('');
  console.log('📊 Seeded data summary:');
  console.log('  - 2 Tenants');
  console.log('  - 3 Users');
  console.log('  - 3 Insured Entities (Facilities)');
  console.log('  - 4 Risk Assessments');
  console.log('  - 3 Policies');
  console.log('  - 1 Quote Request');
  console.log('  - 2 Audit Logs');
  console.log('  - 2 Policy Templates');
  console.log('  - 3 Claims');
  console.log('  - 4 Documents');
  console.log('  - 3 Notifications');
  console.log('  - 1 Risk Mitigation Plan');
  console.log('  - 6 Tags');
  console.log('  - 6 Metrics');
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
