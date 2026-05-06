import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TestStatus } from '@prisma/client';

// POST create a new test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, name } = body;

    if (!moduleId || !name) {
      return NextResponse.json(
        { error: 'Module ID and test name are required' },
        { status: 400 }
      );
    }

    const test = await prisma.testCase.create({
      data: {
        moduleId,
        name,
        status: TestStatus.NOT_TESTED,
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
}
