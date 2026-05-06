'use client';

import { TestStats } from '@/types';

interface DashboardProps {
  stats: TestStats;
}

const cards = [
  {
    key: 'total',
    label: 'Total',
    color: 'text-blue-600',
  },
  {
    key: 'success',
    label: 'Succès',
    color: 'text-emerald-600',
  },
  {
    key: 'failure',
    label: 'Échecs',
    color: 'text-rose-600',
  },
  {
    key: 'notTested',
    label: 'Non testés',
    color: 'text-slate-500',
  },
] as const;

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(({ key, label, color }) => (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-4 text-center shadow-sm"
          >
            <div className={`text-3xl font-semibold ${color}`}>
              {stats[key]}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
