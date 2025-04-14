import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaService {
  async saveKudos(data: {
    senderId: string;
    recipientId: string;
    kudosType: string;
    message: string;
    visibility: string;
  }) {
    return prisma.kudos.create({
      data,
    });
  }

  async getKudos(userId: string) {
    return prisma.kudos.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}