import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all modules with their tests
export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        tests: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

// POST create a new module
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Module name is required' },
        { status: 400 }
      );
    }

    // Get the highest order number
    const lastModule = await prisma.module.findFirst({
      orderBy: { order: 'desc' },
    });

    const module = await prisma.module.create({
      data: {
        name,
        order: (lastModule?.order ?? 0) + 1,
      },
      include: {
        tests: true,
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
