'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Module, TestStats } from '@/types';
import { generatePDF } from '@/utils/pdfGenerator';
import ModuleBlock from '@/components/ModuleBlock';
import Dashboard from '@/components/Dashboard';
import NotificationBell from '@/components/NotificationBell';

type TestStatus = 'SUCCESS' | 'FAILURE' | 'NOT_TESTED';

import Sidebar from '@/components/Sidebar';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState<TestStats>({ total: 0, success: 0, failure: 0, notTested: 0 });
  const [loading, setLoading] = useState(true);
  const [newModuleName, setNewModuleName] = useState('');
  const [showAddModule, setShowAddModule] = useState(false);

  // Fetch modules from API
  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules');
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchModules();
      fetchStats();
    }
  }, [status]);

  // Update test
  const handleUpdateTest = async (testId: string, updates: { status?: TestStatus; remark?: string; issueDescription?: string }) => {
    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchModules();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  // Delete test
  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) return;

    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchModules();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  // Add test
  const handleAddTest = async (moduleId: string, testName: string) => {
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, name: testName }),
      });

      if (response.ok) {
        await fetchModules();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error adding test:', error);
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce module et tous ses tests ?')) return;

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchModules();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  // Add module
  const handleAddModule = async () => {
    if (!newModuleName.trim()) return;

    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newModuleName.trim() }),
      });

      if (response.ok) {
        await fetchModules();
        await fetchStats();
        setNewModuleName('');
        setShowAddModule(false);
      }
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    generatePDF(modules, stats);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(modules, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tests-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <main className="flex-1 pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
              <div className="text-sm text-slate-400 mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-medium text-sm">Export</button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-medium text-sm">Import</button>
            </div>
          </header>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm flex flex-col items-center">
              <div className="text-slate-400 text-lg mb-1 font-semibold flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                TOTAL DES CAS
              </div>
              <div className="text-4xl font-bold text-blue-700">{stats.total}</div>
              <div className="text-xs text-slate-400 mt-1">{modules.length} modules</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm flex flex-col items-center">
              <div className="text-slate-400 text-lg mb-1 font-semibold flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                SUCCÈS
              </div>
              <div className="text-4xl font-bold text-emerald-600">{stats.success}</div>
              <div className="text-xs text-slate-400 mt-1">{stats.total > 0 ? `${Math.round((stats.success / stats.total) * 100)}% de réussite` : '0% de réussite'}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm flex flex-col items-center">
              <div className="text-slate-400 text-lg mb-1 font-semibold flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ÉCHECS
              </div>
              <div className="text-4xl font-bold text-rose-600">{stats.failure}</div>
              <div className="text-xs text-slate-400 mt-1">{stats.failure === 0 ? 'Aucun' : `${Math.round((stats.failure / stats.total) * 100)}% échoués`}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm flex flex-col items-center">
              <div className="text-slate-400 text-lg mb-1 font-semibold flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                NON TESTÉS
              </div>
              <div className="text-4xl font-bold text-slate-500">{stats.notTested}</div>
              <div className="text-xs text-slate-400 mt-1">{stats.total > 0 ? `${Math.round((stats.notTested / stats.total) * 100)}% complété` : '0% complété'}</div>
            </div>
          </div>

          {/* Répartition et progression par module */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Répartition */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center">
              <div className="font-bold text-slate-900 mb-2">Répartition</div>
              <div className="text-xs text-slate-400 mb-4">Statut global des cas de test</div>
              {/* TODO: Ajouter un vrai donut chart ici */}
              <div className="flex items-center justify-center w-full mb-4">
                <div className="relative w-24 h-24">
                  {/* Placeholder donut chart */}
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${stats.success / stats.total * 100 || 0},100`} strokeDashoffset="25" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${stats.failure / stats.total * 100 || 0},100`} strokeDashoffset="25" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-lg text-slate-700">
                      {stats.total > 0 ? `${Math.round(((stats.success + stats.failure) / stats.total) * 100)}%` : '0%'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center ml-6 gap-1">
                  <div className="flex items-center gap-2 text-sm text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Succès <span className="ml-2 font-semibold">{stats.success}</span> <span className="ml-2 text-xs text-slate-400">{stats.total > 0 ? `${Math.round((stats.success / stats.total) * 100)}%` : '0%'}</span></div>
                  <div className="flex items-center gap-2 text-sm text-rose-600"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Échecs <span className="ml-2 font-semibold">{stats.failure}</span> <span className="ml-2 text-xs text-slate-400">{stats.total > 0 ? `${Math.round((stats.failure / stats.total) * 100)}%` : '0%'}</span></div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Non testés <span className="ml-2 font-semibold">{stats.notTested}</span> <span className="ml-2 text-xs text-slate-400">{stats.total > 0 ? `${Math.round((stats.notTested / stats.total) * 100)}%` : '100%'}</span></div>
                </div>
              </div>
            </div>
            {/* Progression par module */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="font-bold text-slate-900 mb-2">Progression par module</div>
              <div className="text-xs text-slate-400 mb-4">Taux de couverture (testés / total)</div>
              <div className="space-y-2">
                {modules.map((mod) => {
  const tested = (mod.tests || []).filter((t: any) => t.status !== 'NOT_TESTED').length;
  return (
    <div key={mod.id} className="flex items-center justify-between">
      <span className="text-slate-700 font-medium">{mod.name}</span>
      <span className="text-xs text-slate-400">{tested} / {mod.tests ? mod.tests.length : 0}</span>
    </div>
  );
})}
              </div>
            </div>
          </div>

          {/* Tous les modules */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">TOUS LES MODULES</h2>
            {/* Modules */}
            {modules.map((module) => (
              <ModuleBlock
                key={module.id}
                module={module}
                onUpdateTest={handleUpdateTest}
                onDeleteTest={handleDeleteTest}
                onAddTest={handleAddTest}
                onDeleteModule={handleDeleteModule}
              />
            ))}
          </div>
        </div>
      </main>
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
              <div className="text-sm text-slate-400 mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-medium text-sm">Export</button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-medium text-sm">Import</button>
            </div>
          </header>
          {/* Dashboard cards et sections à venir ici... */}

        {/* Dashboard */}
        <div className="mb-8">
          <Dashboard stats={stats} />
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={handleGeneratePDF}
            disabled={modules.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Générer le rapport PDF
          </button>

          <button
            onClick={handleExportJSON}
            disabled={modules.length === 0}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter JSON
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>

        {/* Modules */}
        {modules.length > 0 ? (
          <div className="space-y-6 mb-8">
            {modules.map((module) => (
              <ModuleBlock
                key={module.id}
                module={module}
                onUpdateTest={handleUpdateTest}
                onDeleteTest={handleDeleteTest}
                onAddTest={handleAddTest}
                onDeleteModule={handleDeleteModule}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200 mb-8">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun module de test</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter un module pour organiser vos tests</p>
            <button
              onClick={() => setShowAddModule(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer le premier module
            </button>
          </div>
        )}

        {/* Add Module */}
        <div className="mb-8">
          {!showAddModule ? (
            <button
              onClick={() => setShowAddModule(true)}
              className="w-full py-4 px-6 border-2 border-dashed border-gray-400 rounded-xl text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium text-lg flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un module
            </button>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Nouveau module</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddModule()}
                  placeholder="Nom du module (ex: Authentification, Rechargement...)..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  autoFocus
                />
                <button
                  onClick={handleAddModule}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setShowAddModule(false);
                    setNewModuleName('');
                  }}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12 pb-8 border-t border-gray-200 pt-8">
          <p className="font-medium">Test Manager QA - Outil professionnel de gestion de tests</p>
          <p className="mt-2">💾 Les données sont sauvegardées en base de données PostgreSQL</p>
          <p className="mt-1 text-xs">Déployé sur Vercel • Propulsé par Next.js, Prisma & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
