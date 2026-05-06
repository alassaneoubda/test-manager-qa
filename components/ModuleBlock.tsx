'use client';

import { Module } from '@/types';
import { TestStatus } from '@prisma/client';
import TestItem from './TestItem';
import { useState } from 'react';

interface ModuleBlockProps {
  module: Module;
  onUpdateTest: (testId: string, updates: { status?: TestStatus; remark?: string; issueDescription?: string }) => void;
  onDeleteTest: (testId: string) => void;
  onAddTest: (moduleId: string, testName: string) => void;
  onDeleteModule: (moduleId: string) => void;
}

export default function ModuleBlock({
  module,
  onUpdateTest,
  onDeleteTest,
  onAddTest,
  onDeleteModule,
}: ModuleBlockProps) {
  const [newTestName, setNewTestName] = useState('');
  const [showAddTest, setShowAddTest] = useState(false);

  const handleAddTest = () => {
    if (newTestName.trim()) {
      onAddTest(module.id, newTestName.trim());
      setNewTestName('');
      setShowAddTest(false);
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  const getModuleStats = () => {
    const success = module.tests.filter(t => t.status === TestStatus.SUCCESS).length;
    const failure = module.tests.filter(t => t.status === TestStatus.FAILURE).length;
    const notTested = module.tests.filter(t => t.status === TestStatus.NOT_TESTED).length;
    return { success, failure, notTested, total: module.tests.length };
  };

  const stats = getModuleStats();
  const completionRate = stats.total > 0 ? Math.round(((stats.success + stats.failure) / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-bold text-gray-900">{module.name}</h3>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                title={isCollapsed ? 'Développer' : 'Réduire'}
              >
                <svg className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="flex gap-6 text-sm mb-3">
              <span className="flex items-center gap-1 text-green-600 font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {stats.success} Succès
              </span>
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {stats.failure} Échecs
              </span>
              <span className="flex items-center gap-1 text-gray-500 font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                {stats.notTested} Non testés
              </span>
              <span className="text-gray-700 font-semibold">• Total: {stats.total}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="h-full flex">
                  <div className="bg-green-500 transition-all duration-500" style={{ width: `${stats.total > 0 ? (stats.success / stats.total) * 100 : 0}%` }} />
                  <div className="bg-red-500 transition-all duration-500" style={{ width: `${stats.total > 0 ? (stats.failure / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700 min-w-[60px]">{completionRate}% testé</span>
            </div>
          </div>
          <button
            onClick={() => onDeleteModule(module.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 ml-4"
            title="Supprimer ce module"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6">
          <div className="space-y-3">
            {module.tests.length > 0 ? (
              module.tests.map((test) => (
                <TestItem
                  key={test.id}
                  test={test}
                  onUpdateTest={onUpdateTest}
                  onDeleteTest={onDeleteTest}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Aucun test dans ce module</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            {!showAddTest ? (
              <button
                onClick={() => setShowAddTest(true)}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un test
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTest()}
                  placeholder="Nom du nouveau test..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  autoFocus
                />
                <button
                  onClick={handleAddTest}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setShowAddTest(false);
                    setNewTestName('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
