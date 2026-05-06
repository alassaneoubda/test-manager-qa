import React from 'react';

const modules = [
  'Rechargement',
  'Transfert',
  'Paiement',
  'QR Code',
  'Coffre',
  'Cagnotte',
];

export default function Sidebar({ onNewModule }: { onNewModule?: () => void }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-30">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="bg-blue-600 text-white font-bold rounded-2xl w-12 h-12 flex items-center justify-center text-xl shadow">
          QA
        </div>
        <div>
          <div className="font-bold text-lg text-slate-900">TestBoard</div>
          <div className="text-xs text-slate-500">Quality dashboard</div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-400 mb-2 tracking-widest">NAVIGATION</div>
          <button className="w-full text-left px-3 py-2 rounded-lg font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition mb-2">
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Vue d'ensemble
            </span>
          </button>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-400 tracking-widest">MODULES</div>
            <div className="text-xs text-slate-400">{modules.length}</div>
          </div>
          <ul className="space-y-1">
            {modules.map((mod) => (
              <li key={mod}>
                <button className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition">
                  {mod}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onNewModule}
          className="w-full mt-4 px-4 py-2 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 font-semibold transition"
        >
          + Nouveau module
        </button>
      </nav>
    </aside>
  );
}
