import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET single report
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const report = await prisma.testReport.findUnique({
      where: { id: params.id },
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

    if (!report) {
      return NextResponse.json({ error: 'Rapport non trouvé' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// PATCH update report
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { status, priority, assigneeId, title, description } = body;

    const existingReport = await prisma.testReport.findUnique({
      where: { id: params.id },
    });

    if (!existingReport) {
      return NextResponse.json({ error: 'Rapport non trouvé' }, { status: 404 });
    }

    const report = await prisma.testReport.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(title && { title }),
        ...(description && { description }),
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

    // Create notification if assignee changed
    if (assigneeId && assigneeId !== existingReport.assigneeId) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          senderId: (session.user as any).id,
          type: 'REPORT_ASSIGNED',
          title: 'Rapport assigné',
          message: `${session.user.name} vous a assigné un rapport: ${report.title}`,
          link: `/reports/${report.id}`,
        },
      });
    }

    // Create notification if status changed
    if (status && status !== existingReport.status && existingReport.reporterId !== (session.user as any).id) {
      await prisma.notification.create({
        data: {
          userId: existingReport.reporterId,
          senderId: (session.user as any).id,
          type: 'REPORT_UPDATED',
          title: 'Rapport mis à jour',
          message: `${session.user.name} a mis à jour le statut de votre rapport: ${report.title}`,
          link: `/reports/${report.id}`,
        },
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

// DELETE report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const report = await prisma.testReport.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return NextResponse.json({ error: 'Rapport non trouvé' }, { status: 404 });
    }

    // Only admin or reporter can delete
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    
    if (userRole !== 'ADMIN' && report.reporterId !== userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await prisma.testReport.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
