import { PrismaClient } from '@prisma/client';

import { buildLoaders, DataLoaders } from './loaders.js';

export interface Context extends DataLoaders {
  prisma: PrismaClient;
}

export const getContextValue = (prisma: PrismaClient): Context => ({
  prisma,
  ...buildLoaders(prisma),
});
