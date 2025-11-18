import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: true,
        insuredEntities: true,
        policies: true,
      },
    });
  }

  async create(data: { name: string; type: 'agency' | 'corporate' }) {
    return this.prisma.tenant.create({
      data,
    });
  }

  async update(id: string, data: Partial<{ name: string; type: string; isActive: boolean }>) {
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }
}
