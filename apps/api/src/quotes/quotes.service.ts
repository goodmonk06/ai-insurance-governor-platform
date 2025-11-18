import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto, UpdateQuoteStatusDto } from '@insurance-platform/shared';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.quoteRequest.findMany({
      where: { tenantId },
      include: {
        insuredEntity: true,
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        insuredEntity: true,
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async create(tenantId: string, userId: string, data: CreateQuoteDto) {
    // 見積もりの有効期限を30日後に設定
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return this.prisma.quoteRequest.create({
      data: {
        tenantId,
        requestedById: userId,
        insuredEntityId: data.insuredEntityId,
        answersJson: data.answersJson,
        status: 'pending',
        expiresAt,
      },
    });
  }

  async updateStatus(id: string, data: UpdateQuoteStatusDto) {
    return this.prisma.quoteRequest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.quoteRequest.delete({
      where: { id },
    });
  }
}
