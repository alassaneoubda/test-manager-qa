'use client';

import { TestStats } from '@/types';

interface DashboardProps {
  stats: TestStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : '0';
  const failureRate = stats.total > 0 ? ((stats.failure / stats.total) * 100).toFixed(1) : '0';
  const completionRate = stats.total > 0 ? (((stats.success + stats.failure) / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">📊 Dashboard QA</h2>
          <p className="text-blue-100">Vue d'ensemble des tests fonctionnels</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold">{completionRate}%</div>
          <div className="text-sm text-blue-200">Progression</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-4xl font-bold mb-1">{stats.total}</div>
          <div className="text-sm text-blue-100 font-medium">Tests Total</div>
        </div>
        
        <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-5 border border-green-400/30 hover:bg-green-500/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-4xl font-bold mb-1 text-green-100">{stats.success}</div>
          <div className="text-sm text-green-100 font-medium">Succès ({successRate}%)</div>
        </div>
        
        <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-5 border border-red-400/30 hover:bg-red-500/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 text-red-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-4xl font-bold mb-1 text-red-100">{stats.failure}</div>
          <div className="text-sm text-red-100 font-medium">Échecs ({failureRate}%)</div>
        </div>
        
        <div className="bg-gray-500/20 backdrop-blur-sm rounded-xl p-5 border border-gray-400/30 hover:bg-gray-500/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-4xl font-bold mb-1 text-gray-100">{stats.notTested}</div>
          <div className="text-sm text-gray-100 font-medium">Non testés</div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progression globale</span>
            <span className="font-bold">{stats.success + stats.failure} / {stats.total} testés</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden shadow-inner">
            <div className="h-full flex">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-700 ease-out"
                style={{ width: `${(stats.success / stats.total) * 100}%` }}
                title={`${stats.success} succès`}
              />
              <div
                className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-700 ease-out"
                style={{ width: `${(stats.failure / stats.total) * 100}%` }}
                title={`${stats.failure} échecs`}
              />
            </div>
          </div>
          
          {stats.failure > 0 && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-red-100">Attention : {stats.failure} test{stats.failure > 1 ? 's' : ''} en échec</p>
                <p className="text-sm text-red-200 mt-1">Consultez les descriptions d'erreur pour plus de détails</p>
              </div>
            </div>
          )}
        </div>
      )}

      {stats.total === 0 && (
        <div className="text-center py-8 bg-white/10 rounded-lg border border-white/20">
          <svg className="w-16 h-16 mx-auto mb-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">Aucun test disponible</p>
          <p className="text-sm text-blue-200 mt-1">Ajoutez des modules et des tests pour commencer</p>
        </div>
      )}
    </div>
  );
}
