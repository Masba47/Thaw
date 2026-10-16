import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { computeSHA256, formatDate } from '../utils/crypto';
import { 
  Users, 
  ShieldAlert, 
  Droplets, 
  Plus, 
  X, 
  FileText, 
  Check, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { 
    commitments, 
    evidenceList, 
    disputes, 
    addDispute, 
    updateDispute, 
    role, 
    language,
    t,
    setSelectedCommitmentId
  } = useApp();

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeCommitmentId, setDisputeCommitmentId] = useState<string>(commitments[0]?.id || '');
  const [disputeTitle, setDisputeTitle] = useState('');
  const [disputeCategory, setDisputeCategory] = useState(
    language === 'es' ? 'Calidad de Agua / Contaminación' : 'Water Quality / Contamination'
  );
  const [filedByName, setFiledByName] = useState('');
  const [filerContact, setFilerContact] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Optional dispute evidence file
  const [disputeFile, setDisputeFile] = useState<File | null>(null);
  const [disputeSha, setDisputeSha] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Regulator dispute action state
  const [editingDisputeId, setEditingDisputeId] = useState<string | null>(null);
  const [regulatorNotes, setRegulatorNotes] = useState('');
  const [regulatorStatusChoice, setRegulatorStatusChoice] = useState<'open' | 'investigating' | 'resolved' | 'dismissed'>('investigating');

  const handleDisputeFileChange = async (file: File) => {
    setDisputeFile(file);
    try {
      const hash = await computeSHA256(file);
      setDisputeSha(hash);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !disputeCommitmentId) return;

    setIsSubmitting(true);
    await addDispute({
      commitmentId: disputeCommitmentId,
      title: disputeTitle || `${disputeCategory} ${language === 'es' ? 'Observado' : 'Observation'}`,
      category: disputeCategory,
      filedBy: isAnonymous 
        ? (language === 'es' ? 'Vecino / Denunciante Anónimo Protegido' : 'Anonymous Citizen / Whistleblower')
        : (filedByName || (language === 'es' ? 'Vecino de la Cuenca' : 'Concerned Basin Resident')),
      filerContact: isAnonymous ? undefined : filerContact,
      description,
      evidenceFileName: disputeFile?.name,
      evidenceSha256: disputeSha || undefined,
    });

    setIsSubmitting(false);
    setSubmittedNotice(true);
    setTimeout(() => {
      setSubmittedNotice(false);
      setIsDisputeModalOpen(false);
      setDisputeTitle('');
      setDescription('');
      setFiledByName('');
      setFilerContact('');
      setDisputeFile(null);
      setDisputeSha(null);
    }, 1800);
  };

  const handleRegulatorUpdate = (disputeId: string) => {
    updateDispute(disputeId, regulatorStatusChoice, regulatorNotes);
    setEditingDisputeId(null);
    setRegulatorNotes('');
  };

  const getDisputeStatusLabel = (status: 'open' | 'investigating' | 'resolved' | 'dismissed') => {
    if (language === 'es') {
      switch (status) {
        case 'open': return 'Abierto';
        case 'investigating': return 'En Fiscalización';
        case 'resolved': return 'Subsanado';
        case 'dismissed': return 'Desestimado';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-8 font-interface">
      {/* Alpine Hero: Editorial Typography (Hark style) */}
      <div className="rounded-2xl bg-gradient-to-b from-sky-50/40 via-white to-white border border-sky-100/70 p-6 sm:p-8 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-teal-700 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {t.communityPortalTitle}
            </span>
            <span>·</span>
            <span>{t.communityPortalSubtitle}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {t.communityHeroTitle}
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-light">
            {t.communityHeroDesc}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsDisputeModalOpen(true)}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.fileGrievanceBtn}</span>
          </button>
          <span className="text-xs text-slate-400">
            {t.disputesOnChainNotice}
          </span>
        </div>

        {/* Basin Health Status: Minimalist unboxed row */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50/60 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-sky-600" />
              <span>{language === 'es' ? 'Escorrentía Proglaciar' : 'Glacial Runoff'}</span>
            </div>
            <div className="text-emerald-700 font-medium">● {t.normalBaseline}</div>
          </div>

          <div className="p-3 bg-slate-50/60 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400">
              {language === 'es' ? 'Polvo en Ruta de Transporte' : 'Haul Road Dust'}
            </div>
            <div className="text-rose-700 font-medium">● {t.overLimitDisputed}</div>
          </div>

          <div className="p-3 bg-slate-50/60 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400">
              {language === 'es' ? 'Muestreos con el Ayllu' : 'Ayllu Sampling Assemblies'}
            </div>
            <div className="text-sky-700 font-medium">● {t.underAuditProtocol}</div>
          </div>
        </div>
      </div>

      {/* Notion-Style Public Grievances Log */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs space-y-0">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.grievanceRegisterTitle} ({disputes.length})</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              {t.grievanceRegisterDesc}
            </p>
          </div>

          <button
            onClick={() => setIsDisputeModalOpen(true)}
            className="flex items-center gap-1 text-xs text-rose-700 hover:text-rose-800 font-medium"
          >
            <Plus className="w-3 h-3" />
            <span>{t.fileNewDisputeBtn}</span>
          </button>
        </div>

        {disputes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            {language === 'es' ? 'No hay denuncias comunitarias registradas actualmente.' : 'No community disputes logged currently.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {disputes.map(disp => {
              const comm = commitments.find(c => c.id === disp.commitmentId);

              return (
                <div key={disp.id} className="p-5 hover:bg-slate-50/40 transition-colors space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{disp.title}</span>
                      <span className="text-[11px] text-slate-400 font-normal">({disp.category})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <span>{disp.filedBy}</span> · <span>{formatDate(disp.filedAt, language)}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 font-light leading-relaxed">
                    {disp.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="text-slate-500 font-medium">
                      Estado: <strong className="text-slate-700">{getDisputeStatusLabel(disp.status)}</strong>
                    </span>
                    <span>·</span>
                    <span>Asociado a: <strong className="text-sky-800 font-mono">{comm?.clauseId}</strong></span>
                    {disp.evidenceFileName && (
                      <>
                        <span>·</span>
                        <span className="text-slate-500">{disp.evidenceFileName}</span>
                      </>
                    )}
                  </div>

                  {disp.regulatorNotes && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 space-y-0.5">
                      <div className="font-medium text-slate-900 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-sky-700" />
                        <span>Dictamen de la Superintendencia del Medio Ambiente (SMA):</span>
                      </div>
                      <p className="text-slate-600 font-light">{disp.regulatorNotes}</p>
                    </div>
                  )}

                  {/* Regulator Adjudication */}
                  {role === 'regulator' && (
                    <div className="pt-2 border-t border-slate-100">
                      {editingDisputeId === disp.id ? (
                        <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                          <div className="font-medium text-slate-800">{language === 'es' ? 'Resolución de Fiscalización' : 'Regulatory Ruling'}</div>
                          <div className="flex gap-3 text-xs">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name="disputeStatus" 
                                value="investigating" 
                                checked={regulatorStatusChoice === 'investigating'} 
                                onChange={() => setRegulatorStatusChoice('investigating')} 
                              />
                              <span className="text-rose-700">{t.dispatchInspection}</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name="disputeStatus" 
                                value="resolved" 
                                checked={regulatorStatusChoice === 'resolved'} 
                                onChange={() => setRegulatorStatusChoice('resolved')} 
                              />
                              <span className="text-emerald-700">{t.markResolved}</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name="disputeStatus" 
                                value="dismissed" 
                                checked={regulatorStatusChoice === 'dismissed'} 
                                onChange={() => setRegulatorStatusChoice('dismissed')} 
                              />
                              <span className="text-slate-600">{t.dismissClaim}</span>
                            </label>
                          </div>
                          <textarea
                            value={regulatorNotes}
                            onChange={(e) => setRegulatorNotes(e.target.value)}
                            placeholder={language === 'es' ? 'Detalle el informe de fiscalización en terreno...' : 'Detail inspection findings...'}
                            rows={2}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingDisputeId(null)}
                              className="px-2.5 py-1 text-xs text-slate-500"
                            >
                              {language === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                              onClick={() => handleRegulatorUpdate(disp.id)}
                              className="px-3 py-1 text-xs bg-sky-700 hover:bg-sky-800 text-white rounded font-medium"
                            >
                              {t.publishRulingBtn}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingDisputeId(disp.id);
                            setRegulatorNotes(disp.regulatorNotes || '');
                          }}
                          className="text-xs text-sky-800 hover:underline font-medium"
                        >
                          {t.adjudicateRegulatorBtn}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Dispute Modal (Notion-like Center Sheet) */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-interface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{t.fileGrievanceBtn}</span>
              </h3>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedNotice ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {t.grievanceRecordedSuccess}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-light">
                  {t.grievanceRecordedDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    {t.targetClauseSelect}
                  </label>
                  <select
                    value={disputeCommitmentId}
                    onChange={(e) => setDisputeCommitmentId(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                    required
                  >
                    {commitments.map(c => (
                      <option key={c.id} value={c.id}>
                        [{c.clauseId}] {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      {t.grievanceCategory}
                    </label>
                    <select
                      value={disputeCategory}
                      onChange={(e) => setDisputeCategory(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      {language === 'es' ? (
                        <>
                          <option value="Calidad de Agua / Contaminación">Calidad de Agua / Contaminación</option>
                          <option value="Material Particulado en Aire / Polvo">Material Particulado en Aire / Polvo</option>
                          <option value="Afectación a Flora y Fauna Silvestre">Afectación a Flora y Fauna Silvestre</option>
                          <option value="Vulneración de Acuerdos con el Ayllu">Vulneración de Acuerdos con el Ayllu</option>
                          <option value="Ruido / Vibraciones Mecánicas">Ruido / Vibraciones Mecánicas</option>
                          <option value="Incumplimiento de Contratación Local">Incumplimiento de Contratación Local</option>
                        </>
                      ) : (
                        <>
                          <option value="Water Quality / Contamination">Water Quality / Contamination</option>
                          <option value="Airborne Dust / Respiratory Hazard">Airborne Dust / Respiratory Hazard</option>
                          <option value="Wildlife Habitat Harm">Wildlife Habitat Harm</option>
                          <option value="Indigenous Free Prior Consultation">Indigenous Consultation Breach</option>
                          <option value="Noise / Heavy Machinery Vibration">Noise / Machinery Vibration</option>
                          <option value="Labor Quota Non-Compliance">Labor Quota Non-Compliance</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      {t.grievanceSubject}
                    </label>
                    <input
                      type="text"
                      value={disputeTitle}
                      onChange={(e) => setDisputeTitle(e.target.value)}
                      placeholder={language === 'es' ? 'ej. Polvo excesivo y falta de riego' : 'e.g. Excessive dust on road'}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    {t.grievanceDesc}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === 'es' ? 'Indique fechas precisas, ubicación geográfica o afectación en pastos y agua...' : 'Provide dates, location, and impact...'}
                    rows={3}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 font-light"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-md space-y-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span className="text-[11px] text-slate-600">{t.anonymousToggle}</span>
                  </label>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <input
                        type="text"
                        value={filedByName}
                        onChange={(e) => setFiledByName(e.target.value)}
                        placeholder={language === 'es' ? 'Nombre o Asociación' : 'Name or Assembly'}
                        className="p-1.5 bg-white border border-slate-200 rounded text-xs"
                      />
                      <input
                        type="text"
                        value={filerContact}
                        onChange={(e) => setFilerContact(e.target.value)}
                        placeholder={language === 'es' ? 'Contacto (opcional)' : 'Contact (optional)'}
                        className="p-1.5 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    {t.attachPhoto}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleDisputeFileChange(e.target.files[0]);
                      }
                    }}
                    className="text-xs text-slate-500 w-full"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-rose-700 hover:bg-rose-800 rounded-md shadow-2xs transition-colors"
                  >
                    {isSubmitting ? '...' : (language === 'es' ? 'Registrar en Avalanche' : 'Submit to Avalanche')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
