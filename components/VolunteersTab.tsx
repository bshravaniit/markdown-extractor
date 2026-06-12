import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Prospect, Volunteer } from '../types';
import { STATUS_LABELS, STATUS_COLORS, CATEGORY_COLORS } from '../data/localProspects';

interface Props {
  volunteers: Volunteer[];
  prospects: Prospect[];
  onAddVolunteer: (v: Volunteer) => void;
  onDeleteVolunteer: (id: string) => void;
  onAssignProspect: (prospectId: string, volunteerId: string) => void;
  onUnassignProspect: (prospectId: string) => void;
}

function AddVolunteerForm({ onAdd, onCancel }: { onAdd: (v: Volunteer) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ id: uuidv4(), name: name.trim(), email: email.trim() || undefined, phone: phone.trim() || undefined, addedAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-violet-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i className="ph ph-user-plus text-violet-600"></i> Add Volunteer
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="col-span-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Volunteer name"
            required
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            autoFocus
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(xxx) xxx-xxxx"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium">Add Volunteer</button>
      </div>
    </form>
  );
}

export default function VolunteersTab({ volunteers, prospects, onAddVolunteer, onDeleteVolunteer, onAssignProspect, onUnassignProspect }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedVolId, setExpandedVolId] = useState<string | null>(null);
  const [assignTarget, setAssignTarget] = useState<string | null>(null); // prospect id being assigned

  const unassigned = prospects.filter(p => !p.assignedVolunteerId);

  const getVolunteerProspects = (volId: string) => prospects.filter(p => p.assignedVolunteerId === volId);

  const statusCounts = (prosts: Prospect[]) => {
    const counts: Record<string, number> = { new: 0, contacted: 0, responded: 0, committed: 0, converted: 0 };
    prosts.forEach(p => counts[p.status]++);
    return counts;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Volunteer Team</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {volunteers.length} volunteers · {unassigned.length} unassigned prospects
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <i className="ph ph-user-plus"></i> Add Volunteer
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddVolunteerForm
            onAdd={(v) => { onAddVolunteer(v); setShowAddForm(false); }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Volunteer Cards */}
      {volunteers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
          <i className="ph ph-users text-5xl text-gray-300 block mb-3"></i>
          <p className="text-gray-500 font-medium">No volunteers yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your AoL teachers and coordinators to assign prospects</p>
        </div>
      ) : (
        <div className="space-y-4">
          {volunteers.map(vol => {
            const volProspects = getVolunteerProspects(vol.id);
            const counts = statusCounts(volProspects);
            const isExpanded = expandedVolId === vol.id;
            const hcTotal = volProspects.filter(p => p.status === 'committed' || p.status === 'converted').reduce((s, p) => s + (p.headcountPledged ?? 0), 0);

            return (
              <div key={vol.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                      {vol.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{vol.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {vol.email && <span className="text-xs text-gray-500">{vol.email}</span>}
                        {vol.phone && <span className="text-xs text-gray-500">{vol.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">{volProspects.length} prospects</p>
                      {hcTotal > 0 && <p className="text-xs text-violet-600 font-medium">{hcTotal} seats pledged</p>}
                    </div>
                    <button
                      onClick={() => setExpandedVolId(isExpanded ? null : vol.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <i className={`ph ph-caret-${isExpanded ? 'up' : 'down'} text-lg`}></i>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${vol.name}? Their prospects will become unassigned.`)) onDeleteVolunteer(vol.id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <i className="ph ph-trash text-base"></i>
                    </button>
                  </div>
                </div>

                {/* Status summary pills */}
                <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
                  {Object.entries(counts).filter(([, c]) => c > 0).map(([status, count]) => (
                    <span key={status} className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status]}`}>
                      {count} {STATUS_LABELS[status]}
                    </span>
                  ))}
                  {volProspects.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No prospects assigned</span>
                  )}
                </div>

                {/* Expanded: prospect list */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                    {volProspects.length > 0 ? (
                      <div className="space-y-1.5">
                        {volProspects.map(p => (
                          <div key={p.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                                {STATUS_LABELS[p.status]}
                              </span>
                              <span className="text-sm text-gray-800 font-medium truncate">{p.name}</span>
                              <span className="text-xs text-gray-400 hidden sm:block">{p.city}</span>
                            </div>
                            <button
                              onClick={() => onUnassignProspect(p.id)}
                              className="text-xs text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                              title="Unassign"
                            >
                              <i className="ph ph-x-circle"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-2">No prospects assigned</p>
                    )}

                    {/* Assign from unassigned */}
                    {unassigned.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Assign an unassigned prospect:</p>
                        <select
                          value=""
                          onChange={e => { if (e.target.value) { onAssignProspect(e.target.value, vol.id); } }}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                        >
                          <option value="">— Pick a prospect —</option>
                          {unassigned.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Unassigned Prospects Summary */}
      {unassigned.length > 0 && volunteers.length > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="ph ph-warning text-amber-600"></i>
            <span className="font-semibold text-amber-800 text-sm">{unassigned.length} unassigned prospects</span>
          </div>
          <p className="text-xs text-amber-700 mb-3">These prospects aren't assigned to any volunteer yet. Expand a volunteer card above to assign them.</p>
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
            {unassigned.slice(0, 20).map(p => (
              <div key={p.id} className="text-xs bg-white border border-amber-200 rounded-lg px-2 py-1.5 text-gray-700">
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-400 ml-1">{p.city}</span>
              </div>
            ))}
            {unassigned.length > 20 && (
              <div className="col-span-2 text-xs text-amber-700 text-center py-1">...and {unassigned.length - 20} more</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
