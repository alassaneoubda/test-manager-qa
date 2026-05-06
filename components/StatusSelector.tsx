'use client';

import { TestStatus } from '@prisma/client';

interface StatusSelectorProps {
  currentStatus: TestStatus;
  onStatusChange: (status: TestStatus) => void;
  disabled?: boolean;
}

export default function StatusSelector({ currentStatus, onStatusChange, disabled = false }: StatusSelectorProps) {
  const getButtonStyle = (status: TestStatus) => {
    const isActive = currentStatus === status;
    const baseStyle = 'px-4 py-2 rounded-md border-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (status) {
      case TestStatus.SUCCESS:
        return `${baseStyle} ${
          isActive
            ? 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
            : 'bg-white text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400'
        }`;
      case TestStatus.FAILURE:
        return `${baseStyle} ${
          isActive
            ? 'bg-red-500 text-white border-red-600 shadow-lg scale-105'
            : 'bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400'
        }`;
      case TestStatus.NOT_TESTED:
        return `${baseStyle} ${
          isActive
            ? 'bg-gray-500 text-white border-gray-600 shadow-lg scale-105'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }`;
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onStatusChange(TestStatus.SUCCESS)}
        disabled={disabled}
        className={getButtonStyle(TestStatus.SUCCESS)}
        title="Marquer comme réussi"
      >
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Succès
        </span>
      </button>
      
      <button
        onClick={() => onStatusChange(TestStatus.FAILURE)}
        disabled={disabled}
        className={getButtonStyle(TestStatus.FAILURE)}
        title="Marquer comme échoué"
      >
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Échec
        </span>
      </button>
      
      <button
        onClick={() => onStatusChange(TestStatus.NOT_TESTED)}
        disabled={disabled}
        className={getButtonStyle(TestStatus.NOT_TESTED)}
        title="Marquer comme non testé"
      >
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
          </svg>
          Non testé
        </span>
      </button>
    </div>
  );
}
