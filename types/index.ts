import { Module as PrismaModule, TestCase as PrismaTestCase, TestStatus as PrismaTestStatus } from '@prisma/client';

// Re-export Prisma types
export type { TestStatus } from '@prisma/client';
export { TestStatus as TestStatusEnum } from '@prisma/client';

// Extended types with relations
export type Module = PrismaModule & {
  tests: TestCase[];
};

export type TestCase = PrismaTestCase;

export interface TestStats {
  total: number;
  success: number;
  failure: number;
  notTested: number;
}

export interface ModuleWithStats extends Module {
  stats: {
    total: number;
    success: number;
    failure: number;
    notTested: number;
  };
}
