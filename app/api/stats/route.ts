import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TestStatus } from '@prisma/client';

// GET statistics
export async function GET() {
  try {
    const tests = await prisma.testCase.findMany({
      select: {
        status: true,
      },
    });

    const stats = {
      total: tests.length,
      success: tests.filter(t => t.status === TestStatus.SUCCESS).length,
      failure: tests.filter(t => t.status === TestStatus.FAILURE).length,
      notTested: tests.filter(t => t.status === TestStatus.NOT_TESTED).length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
