import React, { useState, useEffect, useCallback } from 'react';
import { Prospect, Volunteer, ProspectStatus, OutreachDraft } from './types';
import { getSeedProspects } from './data/localProspects';
import ProspectsTab from './components/ProspectsTab';
import EventInfoTab from './components/EventInfoTab';
import CRMTab from './components/CRMTab';
import VolunteersTab from './components/VolunteersTab';

type Tab = 'prospects' | 'crm' | 'event' | 'volunteers';

const STORAGE_KEY_PROSPECTS = 'jw_prospects_v1';
const STORAGE_KEY_VOLUNTEERS = 'jw_volunteers_v1';

const GOAL = 2000;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('prospects');
  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const saved = loadFromStorage<Prospect[] | null>(STORAGE_KEY_PROSPECTS, null);
    if (saved && saved.length > 0) return saved;
    return getSeedProspects();
  });
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() =>
    loadFromStorage<Volunteer[]>(STORAGE_KEY_VOLUNTEERS, [])
  );

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_PROSPECTS, JSON.stringify(prospects)); } catch {}
  }, [prospects]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(volunteers)); } catch {}
  }, [volunteers]);

  // ── Prospect mutations ──────────────────────────────────────────────
  const updateProspects = useCallback((updated: Prospect[]) => setProspects(updated), []);

  const updateStatus = useCallback((id: string, status: ProspectStatus, headcount?: number) => {
    setProspects(prev => prev.map(p => p.id === id
      ? {
          ...p,
          status,
          headcountPledged: headcount !== undefined ? headcount : p.headcountPledged,
          lastContact: status === 'contacted' ? new Date().toISOString() : p.lastContact,
        }
      : p
    ));
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, notes } : p));
  }, []);

  const saveDraft = useCallback((prospectId: string, draft: OutreachDraft) => {
    setProspects(prev => prev.map(p =>
      p.id === prospectId
        ? { ...p, outreachDrafts: [...p.outreachDrafts, draft] }
        : p
    ));
  }, []);

  const assignVolunteer = useCallback((prospectId: string, volunteerId: string) => {
    setProspects(prev => prev.map(p =>
      p.id === prospectId ? { ...p, assignedVolunteerId: volunteerId || undefined } : p
    ));
  }, []);

  // ── Volunteer mutations ──────────────────────────────────────────────
  const addVolunteer = useCallback((v: Volunteer) => setVolunteers(prev => [...prev, v]), []);

  const deleteVolunteer = useCallback((id: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
    setProspects(prev => prev.map(p => p.assignedVolunteerId === id ? { ...p, assignedVolunteerId: undefined } : p));
  }, []);

  const unassignProspect = useCallback((prospectId: string) => {
    setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, assignedVolunteerId: undefined } : p));
  }, []);

  // ── Summary stats for header ─────────────────────────────────────────
  const totalPledged = prospects
    .filter(p => p.status === 'committed' || p.status === 'converted')
    .reduce((s, p) => s + (p.headcountPledged ?? 0), 0);
  const inPipeline = prospects.filter(p => p.status !== 'new').length;
  const progressPct = Math.min(100, Math.round((totalPledged / GOAL) * 100));

  const TAB_CONFIG = [
    { id: 'prospects' as Tab, label: 'Prospects', icon: 'ph-buildings', badge: prospects.filter(p => p.status === 'new').length },
    { id: 'crm' as Tab, label: 'Tracker / CRM', icon: 'ph-kanban', badge: inPipeline },
    { id: 'event' as Tab, label: 'Event Info', icon: 'ph-info', badge: 0 },
    { id: 'volunteers' as Tab, label: 'Volunteers', icon: 'ph-users-three', badge: volunteers.length },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-20 flex-shrink-0">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white text-lg font-bold shadow-md select-none">
              ☯
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">The Journey Within</h1>
              <p className="text-xs text-gray-500 leading-tight">Gurudev Sri Sri Ravi Shankar · Battle Creek · Jul 9, 2025</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-2">
            <div className="text-right">
              <p className="text-xs text-violet-500 font-medium uppercase tracking-wider">Headcount Pledged</p>
              <p className="text-lg font-black text-violet-700 leading-tight">
                {totalPledged.toLocaleString()} <span className="text-sm font-normal text-violet-400">/ {GOAL.toLocaleString()}</span>
              </p>
            </div>
            <div className="w-20 h-2 bg-violet-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-gray-700">{progressPct}%</span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex border-t border-gray-100">
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-violet-600 text-violet-700 bg-violet-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <i className={`ph ${tab.icon}`}></i>
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'prospects' && (
          <ProspectsTab
            prospects={prospects}
            volunteers={volunteers}
            onUpdateProspects={updateProspects}
            onUpdateStatus={updateStatus}
            onSaveDraft={saveDraft}
            onAssignVolunteer={assignVolunteer}
          />
        )}
        {activeTab === 'crm' && (
          <CRMTab
            prospects={prospects}
            volunteers={volunteers}
            onUpdateStatus={updateStatus}
            onUpdateNotes={updateNotes}
          />
        )}
        {activeTab === 'event' && (
          <div className="h-full overflow-y-auto">
            <EventInfoTab />
          </div>
        )}
        {activeTab === 'volunteers' && (
          <div className="h-full overflow-y-auto">
            <VolunteersTab
              volunteers={volunteers}
              prospects={prospects}
              onAddVolunteer={addVolunteer}
              onDeleteVolunteer={deleteVolunteer}
              onAssignProspect={assignVolunteer}
              onUnassignProspect={unassignProspect}
            />
          </div>
        )}
      </main>

      {/* Mobile progress bar */}
      <div className="sm:hidden h-1 bg-gray-100 flex-shrink-0">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-green-500 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
    </div>
  );
}
