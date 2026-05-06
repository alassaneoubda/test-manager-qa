import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TestStatus } from '@prisma/client';

// PATCH update a test
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, remark, issueDescription } = body;

    // Validation: if status is FAILURE, issueDescription is required
    if (status === TestStatus.FAILURE && !issueDescription) {
      return NextResponse.json(
        { error: 'Issue description is required for failed tests' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (remark !== undefined) {
      updateData.remark = remark;
    }
    
    if (issueDescription !== undefined) {
      updateData.issueDescription = issueDescription;
    }

    // Clear issueDescription if status is not FAILURE
    if (status && status !== TestStatus.FAILURE) {
      updateData.issueDescription = null;
    }

    const test = await prisma.testCase.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error updating test:', error);
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    );
  }
}

// DELETE a test
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.testCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { error: 'Failed to delete test' },
      { status: 500 }
    );
  }
}
