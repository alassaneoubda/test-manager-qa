'use client';

import { TestStats } from '@/types';

interface StatsPanelProps {
  stats: TestStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : '0';
  const failureRate = stats.total > 0 ? ((stats.failure / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Statistiques Globales</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-sm text-blue-100">Tests Total</div>
        </div>
        
        <div className="bg-green-500/20 backdrop-blur rounded-lg p-4 border border-green-300/30">
          <div className="text-3xl font-bold">{stats.success}</div>
          <div className="text-sm text-green-100">Succès ({successRate}%)</div>
        </div>
        
        <div className="bg-red-500/20 backdrop-blur rounded-lg p-4 border border-red-300/30">
          <div className="text-3xl font-bold">{stats.failure}</div>
          <div className="text-sm text-red-100">Échecs ({failureRate}%)</div>
        </div>
        
        <div className="bg-gray-500/20 backdrop-blur rounded-lg p-4 border border-gray-300/30">
          <div className="text-3xl font-bold">{stats.notTested}</div>
          <div className="text-sm text-gray-100">Non testés</div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progression</span>
            <span>{((stats.success + stats.failure) / stats.total * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-green-400 transition-all duration-500"
                style={{ width: `${(stats.success / stats.total) * 100}%` }}
              />
              <div
                className="bg-red-400 transition-all duration-500"
                style={{ width: `${(stats.failure / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
