import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePolicyDto, UpdatePolicyDto } from '@insurance-platform/shared';

@Injectable()
export class PoliciesService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('policy-reminders') private reminderQueue: Queue,
  ) {}

  async findByTenant(tenantId: string) {
    return this.prisma.policy.findMany({
      where: { tenantId },
      include: {
        insuredEntity: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.policy.findUnique({
      where: { id },
      include: {
        insuredEntity: true,
        tenant: true,
      },
    });
  }

  async create(tenantId: string, data: CreatePolicyDto) {
    const policy = await this.prisma.policy.create({
      data: {
        ...data,
        tenantId,
        status: 'draft',
      },
    });

    // 契約終了30日前にリマインダージョブを設定
    const reminderDate = new Date(data.endDate);
    reminderDate.setDate(reminderDate.getDate() - 30);

    await this.reminderQueue.add(
      'renewal-reminder',
      { policyId: policy.id },
      { delay: reminderDate.getTime() - Date.now() },
    );

    return policy;
  }

  async update(id: string, data: UpdatePolicyDto) {
    return this.prisma.policy.update({
      where: { id },
      data,
    });
  }

  async activate(id: string) {
    return this.prisma.policy.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  async cancel(id: string) {
    return this.prisma.policy.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  async getExpiringPolicies(tenantId: string, days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.policy.findMany({
      where: {
        tenantId,
        status: 'active',
        endDate: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        insuredEntity: true,
      },
    });
  }
}
