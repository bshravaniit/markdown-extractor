import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Prospect, OutreachDraft, OutreachType } from '../types';
import { generateOutreachDraft } from '../services/geminiService';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/localProspects';

interface Props {
  prospect: Prospect;
  onClose: () => void;
  onSaveDraft: (prospectId: string, draft: OutreachDraft) => void;
}

export default function OutreachModal({ prospect, onClose, onSaveDraft }: Props) {
  const [activeType, setActiveType] = useState<OutreachType>('email');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);

  const handleGenerate = async (type: OutreachType) => {
    setActiveType(type);
    setIsGenerating(true);
    setError('');
    setGeneratedText('');
    setSavedDraftId(null);
    try {
      const text = await generateOutreachDraft(prospect, type);
      setGeneratedText(text);
    } catch (e: any) {
      setError(e.message || 'Generation failed. Check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = () => {
    if (!generatedText) return;
    const draft: OutreachDraft = {
      id: uuidv4(),
      type: activeType,
      content: generatedText,
      createdAt: new Date().toISOString(),
    };
    onSaveDraft(prospect.id, draft);
    setSavedDraftId(draft.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{prospect.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[prospect.category]}`}>
                {CATEGORY_LABELS[prospect.category]}
              </span>
              <span className="text-xs text-gray-500">{prospect.city}, MI {prospect.zipCode}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <i className="ph ph-x text-xl"></i>
          </button>
        </div>

        {/* Generate Buttons */}
        <div className="px-6 pt-4 pb-2 flex gap-3">
          <button
            onClick={() => handleGenerate('email')}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <i className="ph ph-envelope"></i>
            Generate Email
          </button>
          <button
            onClick={() => handleGenerate('call_script')}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <i className="ph ph-phone"></i>
            Generate Call Script
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Crafting personalized outreach...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <i className="ph ph-warning-circle mr-2"></i>{error}
            </div>
          )}

          {generatedText && !isGenerating && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {activeType === 'email' ? 'Email Draft' : 'Call Script'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <i className={`ph ${copied ? 'ph-check' : 'ph-copy'}`}></i>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!!savedDraftId}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      savedDraftId
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
                    }`}
                  >
                    <i className={`ph ${savedDraftId ? 'ph-check-circle' : 'ph-floppy-disk'}`}></i>
                    {savedDraftId ? 'Saved' : 'Save Draft'}
                  </button>
                </div>
              </div>
              <textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="w-full h-64 p-4 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 font-mono"
              />
            </div>
          )}

          {/* Previous drafts */}
          {prospect.outreachDrafts.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Saved Drafts ({prospect.outreachDrafts.length})
              </p>
              <div className="space-y-3">
                {prospect.outreachDrafts.map(draft => (
                  <div key={draft.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        draft.type === 'email' ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {draft.type === 'email' ? 'Email' : 'Call Script'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(draft.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 font-mono whitespace-pre-wrap">{draft.content}</p>
                    <button
                      onClick={() => { setGeneratedText(draft.content); setActiveType(draft.type); }}
                      className="mt-2 text-xs text-violet-600 hover:text-violet-800 font-medium"
                    >
                      Load this draft →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!generatedText && !isGenerating && !error && prospect.outreachDrafts.length === 0 && (
            <div className="mt-8 text-center text-gray-400">
              <i className="ph ph-sparkle text-4xl block mb-2"></i>
              <p className="text-sm">Click a button above to generate a personalized outreach draft</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
