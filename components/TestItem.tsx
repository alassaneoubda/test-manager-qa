'use client';

import { TestCase } from '@/types';
import { TestStatus } from '@prisma/client';
import { useState } from 'react';
import StatusSelector from './StatusSelector';

interface TestItemProps {
  test: TestCase;
  onUpdateTest: (testId: string, updates: { status?: TestStatus; remark?: string; issueDescription?: string }) => void;
  onDeleteTest: (testId: string) => void;
}

export default function TestItem({ test, onUpdateTest, onDeleteTest }: TestItemProps) {
  const [remark, setRemark] = useState(test.remark || '');
  const [issueDescription, setIssueDescription] = useState(test.issueDescription || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TestStatus) => {
    setIsUpdating(true);
    const updates: any = { status: newStatus };
    
    // Clear issue description if status is not FAILURE
    if (newStatus !== TestStatus.FAILURE) {
      updates.issueDescription = null;
      setIssueDescription('');
    } else if (newStatus === TestStatus.FAILURE && issueDescription) {
      updates.issueDescription = issueDescription;
    }
    
    await onUpdateTest(test.id, updates);
    setIsUpdating(false);
  };

  const handleRemarkChange = async (value: string) => {
    setRemark(value);
  };

  const handleRemarkBlur = async () => {
    if (remark !== test.remark) {
      await onUpdateTest(test.id, { remark });
    }
  };

  const handleIssueDescriptionChange = async (value: string) => {
    setIssueDescription(value);
  };

  const handleIssueDescriptionBlur = async () => {
    if (issueDescription !== test.issueDescription) {
      await onUpdateTest(test.id, { issueDescription });
    }
  };

  const getStatusColor = () => {
    switch (test.status) {
      case TestStatus.SUCCESS:
        return 'bg-green-50 border-green-300 shadow-green-100';
      case TestStatus.FAILURE:
        return 'bg-red-50 border-red-300 shadow-red-100';
      case TestStatus.NOT_TESTED:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-5 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${getStatusColor()}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <h4 className="font-semibold text-gray-900 text-base">{test.name}</h4>
          
          <StatusSelector
            currentStatus={test.status}
            onStatusChange={handleStatusChange}
            disabled={isUpdating}
          />

          {/* Champ Remarque - Toujours visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              💬 Remarque (optionnelle)
            </label>
            <textarea
              value={remark}
              onChange={(e) => handleRemarkChange(e.target.value)}
              onBlur={handleRemarkBlur}
              placeholder="Ajoutez une remarque ou un commentaire..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              rows={2}
              disabled={isUpdating}
            />
          </div>

          {/* Champ Description du problème - Visible si FAILURE */}
          {test.status === TestStatus.FAILURE && (
            <div className="bg-red-50 p-3 rounded-md border border-red-200">
              <label className="block text-sm font-semibold text-red-700 mb-1">
                ⚠️ Description du problème *
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => handleIssueDescriptionChange(e.target.value)}
                onBlur={handleIssueDescriptionBlur}
                placeholder="Décrivez en détail le problème rencontré..."
                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 text-sm bg-white"
                rows={4}
                required
                disabled={isUpdating}
              />
              {!issueDescription && (
                <p className="text-xs text-red-600 mt-1">⚠️ Ce champ est obligatoire pour les tests en échec</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => onDeleteTest(test.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
          title="Supprimer ce test"
          disabled={isUpdating}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
