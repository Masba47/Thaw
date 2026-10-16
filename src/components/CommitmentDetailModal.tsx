import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommitmentStatus, EvidenceStatus } from '../types';
import { truncateHash, formatBytes, formatDate, getDeadlineInfo } from '../utils/crypto';
import { 
  X, 
  Upload, 
  Copy, 
  Check, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar,
  User,
  Scale,
  Clock,
  Sparkles
} from 'lucide-react';

interface Props {
  commitmentId: string;
  onClose: () => void;
}

export const CommitmentDetailModal: React.FC<Props> = ({ commitmentId, onClose }) => {
  const { 
    commitments, 
    evidenceList, 
    disputes, 
    role, 
    language,
    t,
    openUploadModalForCommitment, 
    openVerifyModal,
    reviewEvidence,
    updateCommitmentStatus,
    setActiveTab
  } = useApp();

  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [reviewingEvidenceId, setReviewingEvidenceId] = useState<string | null>(null);
  const [reviewNotesInput, setReviewNotesInput] = useState('');
  const [reviewStatusChoice, setReviewStatusChoice] = useState<EvidenceStatus>('valid');

  const commitment = commitments.find(c => c.id === commitmentId);
  if (!commitment) return null;

  const relevantEvidence = evidenceList.filter(e => e.commitmentId === commitmentId);
  const relevantDisputes = disputes.filter(d => d.commitmentId === commitmentId);
  const deadlineInfo = getDeadlineInfo(commitment.deadline, language);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleAuditSubmit = (evidenceId: string) => {
    reviewEvidence(
      evidenceId, 
      reviewStatusChoice, 
      reviewNotesInput || (language === 'es' ? 'Verificado conforme a requerimientos de la resolución ambiental.' : 'Verified against technical resolution requirements.')
    );
    setReviewingEvidenceId(null);
    setReviewNotesInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh] font-interface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Notion-like page bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-700 font-medium">{commitment.clauseId}</span>
            <span>/</span>
            <span>{t.commitmentSpec}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Document Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Editorial Title */}
          <div className="space-y-2">
            <h2 className="font-editorial text-2xl sm:text-3xl text-slate-950 tracking-tight leading-snug">
              {commitment.title}
            </h2>

            {/* Notion Status and properties line */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <span className={`w-2 h-2 rounded-full ${
                  commitment.status === 'validated' ? 'bg-emerald-500' :
                  commitment.status === 'submitted' ? 'bg-sky-500 animate-pulse' :
                  commitment.status === 'overdue' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <span>
                  {commitment.status === 'validated' ? t.status_validated :
                   commitment.status === 'submitted' ? t.status_submitted :
                   commitment.status === 'overdue' ? t.status_overdue : t.status_pending}
                </span>
              </span>
              <span>·</span>
              <span>{commitment.frequency}</span>
            </div>
          </div>

          {/* Properties Block (Notion Style) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3 h-3 text-sky-600" />
                  {t.resolutionDeadline}
                </div>
                <div className="font-medium text-slate-800">{commitment.deadline}</div>
                <div className={`text-[10px] ${deadlineInfo.isOverdue ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                  {deadlineInfo.label}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <User className="w-3 h-3 text-sky-600" />
                  {t.responsibleOwner}
                </div>
                <div className="font-medium text-slate-800 truncate">{commitment.owner}</div>
                <div className="text-[10px] text-slate-500 truncate">{commitment.responsibleContact}</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Scale className="w-3 h-3 text-sky-600" />
                  {t.legalCitation}
                </div>
                <div className="font-mono text-slate-700 text-[11px] line-clamp-2">
                  {commitment.legalCitation}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Narrative & Criteria */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'es' ? 'Descripción del Compromiso' : 'Commitment Description'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-light">
              {commitment.description}
            </p>

            <div className="p-3.5 rounded-lg bg-sky-50/40 border border-sky-100 text-xs text-sky-900 space-y-1">
              <div className="font-medium text-sky-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                {t.requiredEvidenceStd}
              </div>
              <p className="text-sky-800 leading-relaxed font-light">
                {commitment.requiredEvidence}
              </p>
            </div>
          </div>

          {/* Active Disputes Notice */}
          {relevantDisputes.length > 0 && (
            <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-rose-900">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  {t.disputeAlertTitle}
                </span>
                <span className="font-mono text-[10px] text-rose-700 uppercase">
                  {relevantDisputes[0].status}
                </span>
              </div>
              {relevantDisputes.map(disp => (
                <div key={disp.id} className="text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-rose-100 space-y-1">
                  <div className="font-medium text-slate-900">{disp.title}</div>
                  <p className="text-slate-600 font-light">{disp.description}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                    <span>{disp.filedBy}</span>
                    <span>{formatDate(disp.filedAt, language)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Evidence History & Avalanche Audit Trail */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                {t.evidenceHistoryTitle}
              </h3>

              {role === 'project_owner' && (
                <button
                  onClick={() => openUploadModalForCommitment(commitment.id)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>{t.notarizeEvidence}</span>
                </button>
              )}
            </div>

            {relevantEvidence.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                {t.noEvidenceYet}
              </div>
            ) : (
              <div className="space-y-3">
                {relevantEvidence.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-sky-200 transition-colors space-y-2.5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{ev.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ev.fileName} ({formatBytes(ev.fileSize)}) · {formatDate(ev.timestamp, language)} · {ev.submittedBy}
                        </div>
                      </div>

                      <button
                        onClick={() => openVerifyModal(ev)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50/80 rounded-md transition-colors shrink-0"
                      >
                        <Search className="w-3 h-3 text-sky-600" />
                        <span>{t.verifyHashBtn}</span>
                      </button>
                    </div>

                    {/* Hashes in quiet monospace */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between min-w-0">
                        <span className="text-slate-400 truncate mr-2">SHA-256: {truncateHash(ev.sha256, 8, 6)}</span>
                        <button
                          onClick={() => copyToClipboard(ev.sha256, `sha-${ev.id}`)}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy SHA-256"
                        >
                          {copiedHash === `sha-${ev.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between min-w-0">
                        <span className="text-slate-400 truncate mr-2">Tx: {truncateHash(ev.txHash, 6, 4)} (Bloque #{ev.blockNumber})</span>
                        <button
                          onClick={() => copyToClipboard(ev.txHash, `tx-${ev.id}`)}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy Tx Hash"
                        >
                          {copiedHash === `tx-${ev.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {ev.reviewNotes && (
                      <div className="text-xs text-slate-600 bg-sky-50/30 p-2 rounded-md border border-sky-100 flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                        <div>
                          <strong>{ev.reviewedBy}:</strong> {ev.reviewNotes}
                        </div>
                      </div>
                    )}

                    {/* Auditor / Regulator Actions */}
                    {(role === 'reviewer' || role === 'regulator') && ev.status === 'pending_review' && (
                      <div className="pt-2 border-t border-slate-100">
                        {reviewingEvidenceId === ev.id ? (
                          <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                            <div className="font-medium text-slate-800">{t.recordAuditDecision}</div>
                            <div className="flex gap-3 text-xs">
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="auditStatus" 
                                  value="valid" 
                                  checked={reviewStatusChoice === 'valid'}
                                  onChange={() => setReviewStatusChoice('valid')}
                                />
                                <span className="text-emerald-700 font-medium">{t.approveValidate}</span>
                              </label>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="auditStatus" 
                                  value="flagged" 
                                  checked={reviewStatusChoice === 'flagged'}
                                  onChange={() => setReviewStatusChoice('flagged')}
                                />
                                <span className="text-rose-700 font-medium">{t.flagCorrection}</span>
                              </label>
                            </div>
                            <textarea
                              value={reviewNotesInput}
                              onChange={(e) => setReviewNotesInput(e.target.value)}
                              placeholder={t.auditPlaceholder}
                              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                              rows={2}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReviewingEvidenceId(null)}
                                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                              >
                                {language === 'es' ? 'Cancelar' : 'Cancel'}
                              </button>
                              <button
                                onClick={() => handleAuditSubmit(ev.id)}
                                className="px-3 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded font-medium"
                              >
                                {t.signAuditBtn}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReviewingEvidenceId(ev.id);
                              setReviewNotesInput('');
                            }}
                            className="text-xs text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{t.performAuditBtn}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regulator Official Resolution Authority */}
          {role === 'regulator' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {t.regulatorAuthority}
              </div>
              <p className="text-slate-500 font-light">{t.regulatorDesc}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => updateCommitmentStatus(commitment.id, 'validated')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium"
                >
                  {t.grantValidBtn}
                </button>
                <button
                  onClick={() => updateCommitmentStatus(commitment.id, 'overdue')}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium"
                >
                  {t.issueOverdueBtn}
                </button>
                <button
                  onClick={() => updateCommitmentStatus(commitment.id, 'pending')}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded text-xs"
                >
                  {t.resetPendingBtn}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Avalanche Subnet Consensus</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
