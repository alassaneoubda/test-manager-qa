import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');

    const reports = await prisma.testReport.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(assigneeId && { assigneeId }),
      },
      include: {
        testCase: {
          include: {
            module: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST create a new report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { testCaseId, title, description, priority, assigneeId } = body;

    if (!testCaseId || !title || !description) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const report = await prisma.testReport.create({
      data: {
        testCaseId,
        reporterId: (session.user as any).id,
        title,
        description,
        priority: priority || 'MEDIUM',
        assigneeId: assigneeId || null,
      },
      include: {
        testCase: {
          include: {
            module: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for assignee if present
    if (assigneeId) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          senderId: (session.user as any).id,
          type: 'REPORT_ASSIGNED',
          title: 'Nouveau rapport assigné',
          message: `${session.user.name} vous a assigné un rapport: ${title}`,
          link: `/reports/${report.id}`,
        },
      });
    }

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
