import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Prospect, Volunteer, ProspectCategory, ProspectStatus, OutreachDraft } from '../types';
import {
  CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS, STATUS_COLORS,
  ALL_ZIP_CODES, getSeedProspects,
} from '../data/localProspects';
import OutreachModal from './OutreachModal';

interface Props {
  prospects: Prospect[];
  volunteers: Volunteer[];
  onUpdateProspects: (updated: Prospect[]) => void;
  onUpdateStatus: (id: string, status: ProspectStatus) => void;
  onSaveDraft: (prospectId: string, draft: OutreachDraft) => void;
  onAssignVolunteer: (prospectId: string, volunteerId: string) => void;
}

const ALL_CATEGORIES: ProspectCategory[] = [
  'wellness', 'church', 'hospital', 'corporate', 'community',
  'education', 'cultural', 'fitness', 'restaurant', 'other',
];

function AddProspectModal({ volunteers, onAdd, onClose }: {
  volunteers: Volunteer[];
  onAdd: (p: Prospect) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: '', category: 'wellness' as ProspectCategory, address: '', city: '', zipCode: '',
    phone: '', email: '', contactPerson: '', notes: '', assignedVolunteerId: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) return;
    const p: Prospect = {
      id: uuidv4(),
      name: form.name.trim(),
      category: form.category,
      address: form.address.trim(),
      city: form.city.trim(),
      zipCode: form.zipCode.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      contactPerson: form.contactPerson.trim() || undefined,
      notes: form.notes.trim() || undefined,
      assignedVolunteerId: form.assignedVolunteerId || undefined,
      status: 'new',
      outreachDrafts: [],
      addedAt: new Date().toISOString(),
      isFromDatabase: false,
    };
    onAdd(p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="ph ph-plus-circle text-violet-600"></i> Add Prospect
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><i className="ph ph-x text-lg"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Organization Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Sunrise Yoga Studio"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Zip Code</label>
              <input value={form.zipCode} onChange={e => set('zipCode', e.target.value)} placeholder="49006"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} required placeholder="Kalamazoo"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(269) 000-0000"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="info@org.com"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Person</label>
            <input value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} placeholder="e.g. Studio Manager, HR Director"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>
          {volunteers.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Assign To Volunteer</label>
              <select value={form.assignedVolunteerId} onChange={e => set('assignedVolunteerId', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="">Unassigned</option>
                {volunteers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Any special notes about this prospect..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium">Add Prospect</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProspectsTab({ prospects, volunteers, onUpdateProspects, onUpdateStatus, onSaveDraft, onAssignVolunteer }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [zipFilter, setZipFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [outreachTarget, setOutreachTarget] = useState<Prospect | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const volunteerMap = Object.fromEntries(volunteers.map(v => [v.id, v.name]));

  const filtered = useMemo(() => {
    return prospects.filter(p => {
      if (zipFilter && p.zipCode !== zipFilter) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || (p.contactPerson?.toLowerCase().includes(q) ?? false);
      }
      return true;
    });
  }, [prospects, zipFilter, categoryFilter, statusFilter, searchQuery]);

  const handleAddProspect = (p: Prospect) => {
    onUpdateProspects([...prospects, p]);
    setShowAddModal(false);
  };

  const handleDeleteProspect = (id: string) => {
    if (window.confirm('Remove this prospect?')) {
      onUpdateProspects(prospects.filter(p => p.id !== id));
    }
  };

  const handleMarkContacted = (id: string) => {
    onUpdateStatus(id, 'contacted');
  };

  const statusOrder: ProspectStatus[] = ['new', 'contacted', 'responded', 'committed', 'converted'];

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search prospects..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Filters */}
        <select value={zipFilter} onChange={e => setZipFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 min-w-40">
          {ALL_ZIP_CODES.map(z => <option key={z.zip} value={z.zip}>{z.label}</option>)}
        </select>

        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
          <option value="">All Statuses</option>
          {statusOrder.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>

        <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2 text-sm ${viewMode === 'grid' ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-50'}`}><i className="ph ph-grid-four"></i></button>
          <button onClick={() => setViewMode('list')} className={`p-2 text-sm ${viewMode === 'list' ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-50'}`}><i className="ph ph-list"></i></button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium whitespace-nowrap shadow-sm transition-colors"
        >
          <i className="ph ph-plus"></i> Add Prospect
        </button>
      </div>

      {/* Results count */}
      <div className="px-5 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
        Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of {prospects.length} prospects
        {(zipFilter || categoryFilter || statusFilter || searchQuery) && (
          <button onClick={() => { setZipFilter(''); setCategoryFilter(''); setStatusFilter(''); setSearchQuery(''); }}
            className="ml-2 text-violet-600 hover:text-violet-800 font-medium">Clear filters</button>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <i className="ph ph-magnifying-glass text-5xl block mb-3"></i>
            <p className="font-medium">No prospects match your filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{p.name}</h3>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </div>

                <span className={`self-start text-xs px-2 py-0.5 rounded-full font-medium mb-2 ${CATEGORY_COLORS[p.category]}`}>
                  {CATEGORY_LABELS[p.category]}
                </span>

                <div className="space-y-1 flex-1">
                  <div className="flex items-start gap-1.5">
                    <i className="ph ph-map-pin text-gray-400 text-xs mt-0.5 flex-shrink-0"></i>
                    <span className="text-xs text-gray-600">{p.address ? `${p.address}, ` : ''}{p.city} {p.zipCode}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-1.5">
                      <i className="ph ph-phone text-gray-400 text-xs flex-shrink-0"></i>
                      <span className="text-xs text-gray-600">{p.phone}</span>
                    </div>
                  )}
                  {p.contactPerson && (
                    <div className="flex items-center gap-1.5">
                      <i className="ph ph-user text-gray-400 text-xs flex-shrink-0"></i>
                      <span className="text-xs text-gray-600">{p.contactPerson}</span>
                    </div>
                  )}
                  {p.assignedVolunteerId && volunteerMap[p.assignedVolunteerId] && (
                    <div className="flex items-center gap-1.5">
                      <i className="ph ph-user-circle text-violet-400 text-xs flex-shrink-0"></i>
                      <span className="text-xs text-violet-600 font-medium">{volunteerMap[p.assignedVolunteerId]}</span>
                    </div>
                  )}
                  {p.notes && (
                    <p className="text-xs text-gray-500 italic line-clamp-2 mt-1">{p.notes}</p>
                  )}
                  {p.outreachDrafts.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <i className="ph ph-files text-violet-400 text-xs"></i>
                      <span className="text-xs text-violet-600">{p.outreachDrafts.length} draft{p.outreachDrafts.length > 1 ? 's' : ''} saved</span>
                    </div>
                  )}
                </div>

                {/* Assign volunteer */}
                {volunteers.length > 0 && (
                  <div className="mt-3">
                    <select
                      value={p.assignedVolunteerId ?? ''}
                      onChange={e => onAssignVolunteer(p.id, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400 bg-gray-50"
                    >
                      <option value="">Unassigned</option>
                      {volunteers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setOutreachTarget(p)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 rounded-xl text-xs font-medium transition-colors"
                  >
                    <i className="ph ph-sparkle"></i> Outreach
                  </button>
                  {p.status === 'new' && (
                    <button
                      onClick={() => handleMarkContacted(p.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-medium transition-colors"
                    >
                      <i className="ph ph-paper-plane-right"></i> Mark Contacted
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProspect(p.id)}
                    className="px-2 py-2 hover:bg-red-50 text-gray-300 hover:text-red-400 rounded-xl transition-colors text-xs"
                  >
                    <i className="ph ph-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-1">
            {filtered.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{p.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[p.category]}`}>{CATEGORY_LABELS[p.category]}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">{p.city} {p.zipCode}</span>
                    {p.phone && <span className="text-xs text-gray-500">{p.phone}</span>}
                    {p.contactPerson && <span className="text-xs text-gray-500">→ {p.contactPerson}</span>}
                    {p.assignedVolunteerId && volunteerMap[p.assignedVolunteerId] && (
                      <span className="text-xs text-violet-600"><i className="ph ph-user-circle"></i> {volunteerMap[p.assignedVolunteerId]}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setOutreachTarget(p)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 rounded-lg text-xs font-medium">
                    <i className="ph ph-sparkle"></i> Outreach
                  </button>
                  {p.status === 'new' && (
                    <button onClick={() => handleMarkContacted(p.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
                      <i className="ph ph-paper-plane-right"></i> Contacted
                    </button>
                  )}
                  <button onClick={() => handleDeleteProspect(p.id)}
                    className="px-2 py-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg text-xs">
                    <i className="ph ph-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProspectModal
          volunteers={volunteers}
          onAdd={handleAddProspect}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {outreachTarget && (
        <OutreachModal
          prospect={outreachTarget}
          onClose={() => setOutreachTarget(null)}
          onSaveDraft={onSaveDraft}
        />
      )}
    </div>
  );
}
