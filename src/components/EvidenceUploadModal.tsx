import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { computeSHA256, formatBytes } from '../utils/crypto';
import { 
  X, 
  Upload, 
  FileCheck, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  Sparkles, 
  Hash, 
  Cpu, 
  FileCode,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export const EvidenceUploadModal: React.FC = () => {
  const { 
    commitments, 
    preselectedCommitmentForUpload, 
    setIsUploadModalOpen, 
    addEvidence,
    role,
    language,
    t
  } = useApp();

  const [selectedCommitmentId, setSelectedCommitmentId] = useState<string>(
    preselectedCommitmentForUpload || commitments[0]?.id || ''
  );
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState(language === 'es' ? 'Calidad de Agua' : 'Water Quality');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [submittingUser, setSubmittingUser] = useState(
    role === 'project_owner' 
      ? (language === 'es' ? 'Ing. Claudio Vargas (Oficial de Cumplimiento Ambiental)' : 'Eng. Claudio Vargas (Lead Environmental Officer)')
      : (language === 'es' ? 'Especialista Técnico Acreditado' : 'Certified Technical Specialist')
  );

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [sha256Hash, setSha256Hash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);

  // Submission / Notarization stages
  const [txStage, setTxStage] = useState<'idle' | 'broadcasting' | 'consensus' | 'confirmed'>('idle');
  const [createdTxHash, setCreatedTxHash] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle actual file dropped or selected
  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);
    setMimeType(selectedFile.type || 'application/octet-stream');
    
    if (!docTitle) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setDocTitle(cleanName);
    }

    setIsHashing(true);
    try {
      const hash = await computeSHA256(selectedFile);
      setSha256Hash(hash);
    } catch (err) {
      console.error('Hashing failed:', err);
    } finally {
      setIsHashing(false);
    }
  };

  // Helper: Use a built-in sample document for instant testing
  const loadSampleDocument = async (sampleType: 'water' | 'dust' | 'geotech') => {
    let sampleContent = '';
    let name = '';
    let cat = '';
    let title = '';

    if (sampleType === 'water') {
      name = 'Telemetria_Calidad_Agua_Rio_Blanco_Oct2026.csv';
      cat = language === 'es' ? 'Telemetría de Calidad de Agua' : 'Water Quality Telemetry';
      title = language === 'es' 
        ? 'Telemetría Continua Multiparamétrica y Metales Pesados en Río Blanco (Oct 2026)'
        : 'Continuous Multi-Probe Water Quality & Heavy Metal Telemetry (Oct 2026)';
      sampleContent = `Estacion_ID,Fecha_Hora,pH,Conductividad_uS,Turbidez_NTU,Oxigeno_Disuelto_mgL,Cobre_mgL,Arsenico_mgL
ST-01,2026-10-16T08:00:00Z,7.42,482,1.2,8.9,0.012,0.003
ST-01,2026-10-16T09:00:00Z,7.40,485,1.4,8.8,0.014,0.003
ST-01,2026-10-16T10:00:00Z,7.39,481,1.1,9.0,0.011,0.002
# Certificado de Calibracion: Sonda Optica YSI Serie SN-99412
# Firma digital verificada por Laboratorio de Hidrologia Andes`;
    } else if (sampleType === 'dust') {
      name = 'Bitacora_Supresion_Polvo_Camion_Aljibe_S42.pdf';
      cat = language === 'es' ? 'Mitigación de Calidad del Aire' : 'Air Quality Mitigation';
      title = language === 'es'
        ? 'Bitácora de Aplicación de Bischofita y Registros Ópticos de Polvo PM10'
        : 'Haul Road PM10 Dust-Suppression Application & Continuous Optical Sensor Log';
      sampleContent = `%PDF-1.4 Informe Ambiental Simulado
Titulo: Bitacora de Riego con Supresor Biodegradable Km 0 al 48
Fecha: 2026-10-16
Telemetria GPS: 4 camiones aljibe operativos en ruta con bischofita al 30%.
Promedio estacion optica PM10: 38 ug/m3 (Limite maximo permitido RCA: 150 ug/m3).
Superintendencia de Operaciones Mina Andes.`;
    } else {
      name = 'Deformacion_Dique_InSAR_Relaves_Oct2026.nc';
      cat = language === 'es' ? 'Radar Geotécnico' : 'Geotechnical Radar';
      title = language === 'es'
        ? 'Matriz de Interferometría Radar Satelital Sentinel-1 en Dique de Relaves Filtrados'
        : 'Dry-Stack Tailings Buttress Sentinel-1 Radar Interferometry Settlement Data';
      sampleContent = `NetCDF-4 Matriz de Desplazamiento Satelital InSAR
Satelite: ESA Copernicus Sentinel-1 Pasada Ascendente 44
Zona: Prisma Dique de Relaves Espesados Celda 4
Asentamiento vertical maximo: 1.12mm (Margen de seguridad admisible > 12mm)
Nivel piezometrico freatico: Seco / Sin presion de poros.`;
    }

    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const sampleFile = new File([blob], name, { type: 'text/plain' });
    setDocTitle(title);
    setCategory(cat);
    await handleFileChange(sampleFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sha256Hash || !selectedCommitmentId) return;

    // Start animated Avalanche on-chain notarization sequence
    setTxStage('broadcasting');
    await new Promise(r => setTimeout(r, 650));

    setTxStage('consensus');
    await new Promise(r => setTimeout(r, 750));

    const record = await addEvidence({
      commitmentId: selectedCommitmentId,
      title: docTitle || fileName,
      fileName,
      fileSize,
      mimeType,
      sha256: sha256Hash,
      technicalNotes,
      category,
    });

    setCreatedTxHash(record.txHash);
    setTxStage('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-sky-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-cyan-300 border border-sky-400/30">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.uploadTitle}
              </h3>
              <p className="text-xs text-slate-300">
                {t.uploadSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notarization Success Screen */}
        {txStage === 'confirmed' ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {t.evidenceNotarizedSuccess}
              </h4>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                {t.evidenceNotarizedDesc}
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-900 text-left p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans uppercase">{t.sha256Checksum}</span>
                <span className="text-cyan-300 break-all">{sha256Hash}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans uppercase">{t.avalancheTx} Hash</span>
                <span className="text-emerald-400 break-all">{createdTxHash}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800 font-sans">
                <span>Subnet: Avalanche Evergreen #431140</span>
                <span>{language === 'es' ? 'Finalidad: 0.38s • Confirmado' : 'Finality: 0.38s • Confirmed'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
            >
              {t.doneReturnBtn}
            </button>
          </div>
        ) : txStage === 'broadcasting' || txStage === 'consensus' ? (
          /* Processing Modal */
          <div className="p-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
              <div className="absolute inset-3 rounded-full bg-sky-50 flex items-center justify-center">
                <Cpu className="w-7 h-7 text-sky-600 animate-pulse" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {txStage === 'broadcasting' ? t.transmittingToSubnet : t.snowmanConsensus}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {txStage === 'broadcasting'
                  ? (language === 'es' ? 'Codificando resumen criptográfico en payload de transacción Avalanche.' : 'Encoding cryptographic digest into Avalanche transaction payload.')
                  : (language === 'es' ? 'Validadores firmando la transición de estado con finalidad subsegundo.' : 'Validators signing state transition with sub-second finality.')}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-sky-600">
                <Check className="w-3.5 h-3.5" /> SHA-256 OK
              </span>
              <span>→</span>
              <span className="text-sky-600 font-semibold animate-pulse">
                {language === 'es' ? 'Notarización On-Chain' : 'On-Chain Notarization'}
              </span>
            </div>
          </div>
        ) : (
          /* Standard Upload Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Step 1: File selection or quick samples */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  {t.attachDoc}
                </label>
                <span className="text-[11px] text-slate-400">PDF, CSV, NetCDF, GeoTIFF, JPG</span>
              </div>

              {/* Drag and drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  file
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {isHashing ? (
                  <div className="flex flex-col items-center justify-center py-2 space-y-2">
                    <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                    <div className="text-xs font-semibold text-sky-800">
                      {t.computingSha}
                    </div>
                  </div>
                ) : file ? (
                  <div className="flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
                        <div className="text-xs text-slate-500">
                          {formatBytes(file.size)} • {file.type || 'Datos técnicos'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setSha256Hash(null);
                      }}
                      className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1"
                    >
                      {language === 'es' ? 'Cambiar archivo' : 'Change file'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-sky-500 mx-auto" />
                    <div className="text-xs font-semibold text-slate-800">
                      {t.dragOrClick}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t.sha256LocalNotice}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick sample document buttons for fast demonstration */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">{t.quickSamples}</span>
                <button
                  type="button"
                  onClick={() => loadSampleDocument('water')}
                  className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  {t.sampleWater}
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleDocument('dust')}
                  className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  {t.sampleDust}
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleDocument('geotech')}
                  className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1"
                >
                  <FileCode className="w-3 h-3" />
                  {t.sampleGeotech}
                </button>
              </div>
            </div>

            {/* Computed SHA-256 Hash Display */}
            {sha256Hash && (
              <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 text-cyan-200 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-sans">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-cyan-400" />
                    {language === 'es' ? 'Resumen SHA-256 Calculado (WebCrypto API)' : 'Computed SHA-256 Digest (Browser WebCrypto API)'}
                  </span>
                  <span className="text-emerald-400 text-[10px] uppercase font-semibold">{t.readyForSubnet}</span>
                </div>
                <div className="font-mono text-xs text-cyan-300 break-all select-all bg-slate-950 p-2 rounded border border-slate-800/80">
                  {sha256Hash}
                </div>
              </div>
            )}

            {/* Form details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetCommitment}
                </label>
                <select
                  value={selectedCommitmentId}
                  onChange={(e) => setSelectedCommitmentId(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  {commitments.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.clauseId}] {c.title.length > 38 ? c.title.slice(0, 38) + '...' : c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.docTitleLabel}
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder={language === 'es' ? 'ej. Telemetría de Calidad de Agua Octubre 2026' : 'e.g. October 2026 Water Telemetry Assay'}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.submittingAuthority}
                </label>
                <input
                  type="text"
                  value={submittingUser}
                  onChange={(e) => setSubmittingUser(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.evidenceCategory}
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.technicalMemo}
              </label>
              <textarea
                value={technicalNotes}
                onChange={(e) => setTechnicalNotes(e.target.value)}
                placeholder={t.technicalMemoPlaceholder}
                rows={2}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Gas Simulado: <span className="font-mono text-slate-700 font-semibold">0.0028 AVAX</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!sha256Hash || !selectedCommitmentId}
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.signAndRecordBtn}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
