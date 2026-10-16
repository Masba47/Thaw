import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EvidenceRecord } from '../types';
import { computeSHA256, truncateHash, formatBytes, formatDate } from '../utils/crypto';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Upload, 
  Eye, 
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { 
    evidenceList, 
    commitments, 
    project, 
    currentBlock, 
    targetEvidenceToVerify,
    language,
    t,
    setSelectedCommitmentId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommitmentFilter, setSelectedCommitmentFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Verification Station State
  const [activeVerificationTarget, setActiveVerificationTarget] = useState<EvidenceRecord | null>(
    targetEvidenceToVerify || null
  );
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'match' | 'mismatch' | null>(null);
  const [matchedRecord, setMatchedRecord] = useState<EvidenceRecord | null>(null);

  // Tx receipt inspector
  const [inspectedRecord, setInspectedRecord] = useState<EvidenceRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when targetEvidenceToVerify changes from props/context
  useEffect(() => {
    if (targetEvidenceToVerify) {
      setActiveVerificationTarget(targetEvidenceToVerify);
      setVerificationFile(null);
      setComputedHash(null);
      setVerificationResult(null);
      setMatchedRecord(null);
    }
  }, [targetEvidenceToVerify]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run SHA-256 verification on uploaded file
  const handleVerifyFile = async (file: File) => {
    setVerificationFile(file);
    setIsVerifying(true);
    setVerificationResult(null);
    setMatchedRecord(null);

    try {
      const hash = await computeSHA256(file);
      setComputedHash(hash);

      if (activeVerificationTarget) {
        if (hash.toLowerCase() === activeVerificationTarget.sha256.toLowerCase()) {
          setVerificationResult('match');
          setMatchedRecord(activeVerificationTarget);
        } else {
          setVerificationResult('mismatch');
        }
      } else {
        const match = evidenceList.find(e => e.sha256.toLowerCase() === hash.toLowerCase());
        if (match) {
          setVerificationResult('match');
          setMatchedRecord(match);
          setActiveVerificationTarget(match);
        } else {
          setVerificationResult('mismatch');
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const simulateTamperedFile = async () => {
    if (!activeVerificationTarget) return;
    const modifiedContent = language === 'es'
      ? `CONTENIDO ADULTERADO: Un actor no autorizado alteró los parámetros de concentración de metales pesados de 0.012 mg/L a 0.999 mg/L. Firma y resumen SHA-256 invalidados. Archivo original: ${activeVerificationTarget.fileName}`
      : `TAMPERED CONTENT: Attacker changed the heavy metal threshold readings from 0.012 to 0.999! Invalidating signature. Original file: ${activeVerificationTarget.fileName}`;
    
    const blob = new Blob([modifiedContent], { type: 'text/plain' });
    const fakeFile = new File([blob], `ALTERADO_${activeVerificationTarget.fileName}`, { type: 'text/plain' });
    await handleVerifyFile(fakeFile);
  };

  const simulateAuthenticFile = async () => {
    if (!activeVerificationTarget) return;
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 400));
    setVerificationFile(new File([new Blob(['authentic'])], activeVerificationTarget.fileName));
    setComputedHash(activeVerificationTarget.sha256);
    setVerificationResult('match');
    setMatchedRecord(activeVerificationTarget);
    setIsVerifying(false);
  };

  // Filtered evidence records
  const filteredEvidence = evidenceList.filter(e => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCommitment = 
      selectedCommitmentFilter === 'all' || e.commitmentId === selectedCommitmentFilter;

    return matchesSearch && matchesCommitment;
  });

  return (
    <div className="space-y-6 font-interface">
      {/* Alpine White Header: Editorial Title with Hark-inspired Serif */}
      <div className="rounded-2xl bg-gradient-to-b from-sky-50/40 via-white to-white border border-sky-100/70 p-6 sm:p-8 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-sky-800">{project.avalancheSubnet.name}</span>
            <span>·</span>
            <span>Chain ID: {project.avalancheSubnet.chainId}</span>
            <span>·</span>
            <span className="text-emerald-600 font-medium">{t.zeroEcoChain}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {t.ledgerTitle}
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-light">
            {t.ledgerSubtitle}
          </p>
        </div>

        {/* Minimal Unboxed Telemetry Line */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            <span className="text-slate-400">{t.currentBlockLabel}:</span>{' '}
            <strong className="font-mono text-slate-800">#{currentBlock.toLocaleString()}</strong>
          </div>
          <span className="text-slate-200">/</span>
          <div>
            <span className="text-slate-400">{t.anchoredProofsLabel}:</span>{' '}
            <strong className="font-mono text-slate-800">{evidenceList.length}</strong>
          </div>
          <span className="text-slate-200">/</span>
          <div>
            <span className="text-slate-400">{t.subnetFinalityLabel}:</span>{' '}
            <strong className="font-mono text-slate-800">&lt; 0.45s (Snowman++)</strong>
          </div>
        </div>
      </div>

      {/* Frosted Glacial Verification Station */}
      <div className="bg-white rounded-2xl border border-sky-100/80 p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>{t.verifierStationTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              {t.verifierStationSubtitle}
            </p>
          </div>

          {activeVerificationTarget && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">{language === 'es' ? 'Comparando contra:' : 'Targeting:'}</span>
              <span className="font-mono text-sky-800 font-medium truncate max-w-[180px]">
                {activeVerificationTarget.fileName}
              </span>
              <button
                onClick={() => {
                  setActiveVerificationTarget(null);
                  setVerificationResult(null);
                  setComputedHash(null);
                  setVerificationFile(null);
                }}
                className="text-slate-400 hover:text-slate-700 underline text-[11px]"
              >
                {language === 'es' ? 'Limpiar' : 'Clear'}
              </button>
            </div>
          )}
        </div>

        {/* Dropzone & simulation triggers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-8">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleVerifyFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/20 hover:bg-sky-50/50 rounded-xl p-4 text-center transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleVerifyFile(e.target.files[0]);
                  }
                }}
              />
              <div className="flex items-center justify-center gap-3">
                <Upload className="w-5 h-5 text-sky-600 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-medium text-slate-800">
                    {verificationFile ? `${language === 'es' ? 'Seleccionado:' : 'Selected:'} ${verificationFile.name}` : t.dropToVerify}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {language === 'es' ? 'Recálculo instantáneo en RAM sin transferencia de red' : 'Instant in-browser SHA-256 calculation'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-1.5">
            <button
              onClick={simulateAuthenticFile}
              disabled={!activeVerificationTarget}
              className="w-full py-1.5 px-3 text-xs text-emerald-800 hover:bg-emerald-50 border border-emerald-200 rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.testMatchBtn}</span>
            </button>

            <button
              onClick={simulateTamperedFile}
              disabled={!activeVerificationTarget}
              className="w-full py-1.5 px-3 text-xs text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.testMismatchBtn}</span>
            </button>
          </div>
        </div>

        {/* Verification Result Notification */}
        {isVerifying ? (
          <div className="p-3 bg-sky-50/60 rounded-lg flex items-center justify-center gap-2 text-xs text-sky-800">
            <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
            <span>{t.verifyingProgress}</span>
          </div>
        ) : verificationResult === 'match' ? (
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.matchConfirmed}</span>
            </div>
            <p className="text-emerald-800 text-[11px]">
              {t.matchDesc} <strong>{formatDate(matchedRecord?.timestamp || '', language)}</strong> por <strong>{matchedRecord?.submittedBy}</strong> (Bloque #{matchedRecord?.blockNumber}).
            </p>
            <div className="text-[10px] font-mono text-emerald-950 bg-white/70 p-2 rounded border border-emerald-200 truncate">
              SHA-256: {computedHash}
            </div>
          </div>
        ) : verificationResult === 'mismatch' ? (
          <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-rose-900 font-medium">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>{t.mismatchDetected}</span>
            </div>
            <p className="text-rose-800 text-[11px]">{t.mismatchDesc}</p>
            <div className="text-[10px] font-mono space-y-1 bg-white/70 p-2 rounded border border-rose-200">
              <div className="text-slate-500">Esperado: {activeVerificationTarget?.sha256}</div>
              <div className="text-rose-900 font-medium">Calculado: {computedHash}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Notion Table View for Ledger */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-medium text-slate-800 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.ledgerTableTitle} ({filteredEvidence.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'es' ? 'Buscar en ledger...' : 'Search ledger...'}
              className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-md w-44 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <select
              value={selectedCommitmentFilter}
              onChange={(e) => setSelectedCommitmentFilter(e.target.value)}
              className="text-xs py-1 px-2.5 bg-white border border-slate-200 rounded-md text-slate-600"
            >
              <option value="all">{language === 'es' ? 'Todas las cláusulas' : 'All clauses'}</option>
              {commitments.map(c => (
                <option key={c.id} value={c.id}>{c.clauseId}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-150 bg-slate-50/60 text-slate-400 font-normal uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-4 font-medium">{t.colTitle}</th>
                <th className="py-2.5 px-4 font-medium">{t.colClause}</th>
                <th className="py-2.5 px-4 font-medium">{t.colSha}</th>
                <th className="py-2.5 px-4 font-medium">{t.colTx}</th>
                <th className="py-2.5 px-4 font-medium">{t.colTimestamp}</th>
                <th className="py-2.5 px-4 font-medium text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvidence.map((record) => {
                const comm = commitments.find(c => c.id === record.commitmentId);
                const isSelected = activeVerificationTarget?.id === record.id;

                return (
                  <tr 
                    key={record.id}
                    className={`hover:bg-sky-50/30 transition-colors ${isSelected ? 'bg-sky-50/60' : ''}`}
                  >
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">{record.title}</div>
                      <div className="text-[11px] text-slate-400">{record.fileName} ({formatBytes(record.fileSize)})</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {comm ? (
                        <button
                          onClick={() => setSelectedCommitmentId(comm.id)}
                          className="hover:text-sky-700 hover:underline"
                        >
                          {comm.clauseId}
                        </button>
                      ) : '-'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{truncateHash(record.sha256, 8, 6)}</span>
                        <button
                          onClick={() => copyToClipboard(record.sha256, `sha-${record.id}`)}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy SHA-256"
                        >
                          {copiedId === `sha-${record.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      <div className="text-slate-400">Bloque #{record.blockNumber}</div>
                      <button
                        onClick={() => setInspectedRecord(record)}
                        className="text-sky-600 hover:underline"
                      >
                        {truncateHash(record.txHash, 6, 4)}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <div>{formatDate(record.timestamp, language)}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{record.submittedBy}</div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setActiveVerificationTarget(record);
                          setVerificationFile(null);
                          setComputedHash(null);
                          setVerificationResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          isSelected 
                            ? 'bg-sky-600 text-white font-medium' 
                            : 'text-sky-700 hover:bg-sky-50'
                        }`}
                      >
                        {isSelected ? t.selectedBadge : t.verifyAction}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Receipt Inspector (Clean Notion Modal) */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-interface">
              <h3 className="font-medium text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'es' ? 'Recibo de Bloque Avalanche' : 'Avalanche Block Receipt'}</span>
              </h3>
              <button onClick={() => setInspectedRecord(null)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <div className="space-y-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">TX HASH</span>
                <span className="text-slate-900 break-all">{inspectedRecord.txHash}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">BLOQUE</span>
                  <span className="text-slate-900 font-bold">#{inspectedRecord.blockNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">FINALIDAD</span>
                  <span className="text-emerald-700 font-semibold">Confirmado (&lt; 0.5s)</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SHA-256 DE LA EVIDENCIA</span>
                <span className="text-sky-900 break-all">{inspectedRecord.sha256}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DIRECCIÓN FIRMANTE</span>
                <span className="text-slate-700 truncate block">{inspectedRecord.submitterAddress}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end font-interface">
              <button
                onClick={() => setInspectedRecord(null)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
