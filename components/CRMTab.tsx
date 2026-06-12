import React, { useState } from 'react';
import { Prospect, ProspectStatus, Volunteer } from '../types';
import { STATUS_LABELS, STATUS_COLORS, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/localProspects';

const GOAL = 2000;

const PIPELINE_STAGES: ProspectStatus[] = ['contacted', 'responded', 'committed', 'converted'];

const STAGE_CONFIG = {
  contacted: { label: 'Contacted', icon: 'ph-paper-plane-right', color: 'border-blue-300', headerBg: 'bg-blue-50', dot: 'bg-blue-400' },
  responded: { label: 'Responded', icon: 'ph-chat-dots', color: 'border-yellow-300', headerBg: 'bg-yellow-50', dot: 'bg-yellow-400' },
  committed: { label: 'Committed', icon: 'ph-hand-pointing', color: 'border-orange-300', headerBg: 'bg-orange-50', dot: 'bg-orange-400' },
  converted: { label: 'Converted ✓', icon: 'ph-check-circle', color: 'border-green-300', headerBg: 'bg-green-50', dot: 'bg-green-500' },
};

interface Props {
  prospects: Prospect[];
  volunteers: Volunteer[];
  onUpdateStatus: (id: string, status: ProspectStatus, headcount?: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

function HeadcountModal({ prospect, onSave, onClose }: { prospect: Prospect; onSave: (hc: number) => void; onClose: () => void }) {
  const [hc, setHc] = useState<string>(String(prospect.headcountPledged ?? ''));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
        <h3 className="font-bold text-gray-900 mb-1">Update Committed Headcount</h3>
        <p className="text-sm text-gray-500 mb-4">{prospect.name}</p>
        <input
          type="number"
          min="1"
          value={hc}
          onChange={e => setHc(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 mb-4"
          placeholder="Number of attendees pledged"
          autoFocus
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => { const n = parseInt(hc); if (!isNaN(n) && n > 0) onSave(n); }}
            className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function NotesModal({ prospect, onSave, onClose }: { prospect: Prospect; onSave: (notes: string) => void; onClose: () => void }) {
  const [notes, setNotes] = useState(prospect.notes ?? '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
        <h3 className="font-bold text-gray-900 mb-1">Notes</h3>
        <p className="text-sm text-gray-500 mb-3">{prospect.name}</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full h-32 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none mb-4"
          placeholder="Add contact notes, follow-up reminders..."
          autoFocus
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(notes)} className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function CRMTab({ prospects, volunteers, onUpdateStatus, onUpdateNotes }: Props) {
  const [headcountModal, setHeadcountModal] = useState<Prospect | null>(null);
  const [notesModal, setNotesModal] = useState<Prospect | null>(null);

  const pipelineProspects = prospects.filter(p => p.status !== 'new');

  const byStage = (stage: ProspectStatus) => pipelineProspects.filter(p => p.status === stage);

  const totalHeadcountCommitted = prospects
    .filter(p => p.status === 'committed' || p.status === 'converted')
    .reduce((sum, p) => sum + (p.headcountPledged ?? 0), 0);

  const totalConverted = prospects.filter(p => p.status === 'converted').reduce((sum, p) => sum + (p.headcountPledged ?? 1), 0);

  const progressPct = Math.min(100, Math.round((totalHeadcountCommitted / GOAL) * 100));

  const volunteerMap = Object.fromEntries(volunteers.map(v => [v.id, v.name]));

  const moveStage = (prospect: Prospect, direction: 'forward' | 'back') => {
    const idx = PIPELINE_STAGES.indexOf(prospect.status as ProspectStatus);
    if (direction === 'forward' && idx < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[idx + 1];
      if (nextStage === 'committed') {
        setHeadcountModal(prospect);
      } else {
        onUpdateStatus(prospect.id, nextStage);
      }
    } else if (direction === 'back' && idx > 0) {
      onUpdateStatus(prospect.id, PIPELINE_STAGES[idx - 1]);
    } else if (direction === 'back' && idx === 0) {
      onUpdateStatus(prospect.id, 'new');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Stats Bar */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 bg-white">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Outreach Pipeline</h2>
            <p className="text-sm text-gray-500 mt-0.5">{pipelineProspects.length} prospects in pipeline</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-violet-700">{totalHeadcountCommitted.toLocaleString()}</p>
            <p className="text-xs text-gray-500">headcount pledged / <span className="font-semibold">2,000 goal</span></p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-gray-500">{progressPct}% toward goal</span>
          <span className="text-xs text-green-600 font-medium">{totalConverted} confirmed</span>
        </div>

        {/* Stage counts */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {PIPELINE_STAGES.map(stage => {
            const items = byStage(stage);
            const cfg = STAGE_CONFIG[stage];
            const hcSum = items.reduce((s, p) => s + (p.headcountPledged ?? 0), 0);
            return (
              <div key={stage} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className={`text-lg font-black ${stage === 'converted' ? 'text-green-600' : stage === 'committed' ? 'text-orange-600' : 'text-gray-800'}`}>
                  {items.length}
                </div>
                <div className="text-xs text-gray-500 font-medium">{cfg.label}</div>
                {hcSum > 0 && (
                  <div className="text-xs text-violet-600 font-medium mt-0.5">{hcSum} seats</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-4 h-full min-w-max">
          {PIPELINE_STAGES.map(stage => {
            const items = byStage(stage);
            const cfg = STAGE_CONFIG[stage];
            return (
              <div key={stage} className={`flex flex-col w-72 bg-gray-50 rounded-2xl border ${cfg.color} overflow-hidden flex-shrink-0`}>
                {/* Column Header */}
                <div className={`px-4 py-3 ${cfg.headerBg} border-b ${cfg.color}`}>
                  <div className="flex items-center gap-2">
                    <i className={`ph ${cfg.icon} text-base`}></i>
                    <span className="font-semibold text-gray-900 text-sm">{cfg.label}</span>
                    <span className="ml-auto bg-white rounded-full px-2 py-0.5 text-xs font-bold text-gray-700 border border-gray-200">
                      {items.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {items.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs">No prospects here yet</div>
                  )}
                  {items.map(p => (
                    <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</p>
                        <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[p.category]}`}>
                          {p.category.slice(0, 4)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{p.city} · {p.zipCode}</p>

                      {p.assignedVolunteerId && volunteerMap[p.assignedVolunteerId] && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <i className="ph ph-user-circle text-gray-400 text-xs"></i>
                          <span className="text-xs text-gray-500">{volunteerMap[p.assignedVolunteerId]}</span>
                        </div>
                      )}

                      {(stage === 'committed' || stage === 'converted') && (
                        <div className="mt-2 flex items-center gap-1">
                          <i className="ph ph-users text-violet-500 text-sm"></i>
                          <span className="text-sm font-bold text-violet-700">
                            {p.headcountPledged ? `${p.headcountPledged} seats` : 'Headcount TBD'}
                          </span>
                          {stage === 'committed' && (
                            <button
                              onClick={() => setHeadcountModal(p)}
                              className="ml-1 text-xs text-gray-400 hover:text-violet-600"
                            >
                              <i className="ph ph-pencil-simple"></i>
                            </button>
                          )}
                        </div>
                      )}

                      {p.notes && (
                        <p className="text-xs text-gray-500 mt-1.5 italic line-clamp-2">{p.notes}</p>
                      )}

                      {p.lastContact && (
                        <p className="text-xs text-gray-400 mt-1">
                          Last contact: {new Date(p.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-1.5 mt-3">
                        {stage !== 'contacted' && (
                          <button
                            onClick={() => moveStage(p, 'back')}
                            title="Move back"
                            className="flex-1 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-1"
                          >
                            <i className="ph ph-arrow-left"></i>
                          </button>
                        )}
                        {stage === 'contacted' && (
                          <button
                            onClick={() => onUpdateStatus(p.id, 'new')}
                            title="Move back to New"
                            className="flex-1 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-1"
                          >
                            <i className="ph ph-arrow-left"></i> New
                          </button>
                        )}
                        <button
                          onClick={() => setNotesModal(p)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                          title="Add notes"
                        >
                          <i className="ph ph-note-pencil"></i>
                        </button>
                        {stage !== 'converted' && (
                          <button
                            onClick={() => moveStage(p, 'forward')}
                            className="flex-1 py-1 text-xs bg-violet-50 border border-violet-200 rounded-lg text-violet-700 hover:bg-violet-100 flex items-center justify-center gap-1 font-medium"
                          >
                            {stage === 'responded' ? 'Commit' : stage === 'committed' ? 'Convert' : 'Advance'}
                            <i className="ph ph-arrow-right"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {headcountModal && (
        <HeadcountModal
          prospect={headcountModal}
          onSave={(hc) => {
            const currentIdx = PIPELINE_STAGES.indexOf(headcountModal.status as ProspectStatus);
            const targetStage = currentIdx < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[currentIdx + 1] : headcountModal.status as ProspectStatus;
            onUpdateStatus(headcountModal.id, targetStage === 'committed' && headcountModal.status !== 'committed' ? 'committed' : headcountModal.status as ProspectStatus, hc);
            // If we're editing existing committed, keep status; otherwise advance
            if (headcountModal.status === 'committed') {
              onUpdateStatus(headcountModal.id, 'committed', hc);
            } else {
              onUpdateStatus(headcountModal.id, 'committed', hc);
            }
            setHeadcountModal(null);
          }}
          onClose={() => setHeadcountModal(null)}
        />
      )}
      {notesModal && (
        <NotesModal
          prospect={notesModal}
          onSave={(notes) => { onUpdateNotes(notesModal.id, notes); setNotesModal(null); }}
          onClose={() => setNotesModal(null)}
        />
      )}
    </div>
  );
}
