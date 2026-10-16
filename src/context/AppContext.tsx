import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Commitment, 
  EvidenceRecord, 
  Dispute, 
  Role, 
  CommitmentStatus, 
  EvidenceStatus 
} from '../types';
import { 
  INITIAL_PROJECT, 
  INITIAL_COMMITMENTS, 
  INITIAL_EVIDENCE, 
  INITIAL_DISPUTES 
} from '../data/seedData';
import { generateAvalancheTxHash, generateAvalancheAddress } from '../utils/crypto';
import { Language, translations } from '../utils/i18n';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['es'];
  activeTab: 'dashboard' | 'ledger' | 'community';
  setActiveTab: (tab: 'dashboard' | 'ledger' | 'community') => void;
  selectedCommitmentId: string | null;
  setSelectedCommitmentId: (id: string | null) => void;
  project: Project;
  commitments: Commitment[];
  evidenceList: EvidenceRecord[];
  disputes: Dispute[];
  currentBlock: number;
  // Actions
  addEvidence: (params: {
    commitmentId: string;
    title: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    sha256: string;
    technicalNotes: string;
    category: string;
  }) => Promise<EvidenceRecord>;
  reviewEvidence: (
    evidenceId: string, 
    status: EvidenceStatus, 
    reviewNotes: string
  ) => void;
  updateCommitmentStatus: (commitmentId: string, status: CommitmentStatus) => void;
  addDispute: (params: {
    commitmentId: string;
    title: string;
    category: string;
    filedBy: string;
    filerContact?: string;
    description: string;
    evidenceFileName?: string;
    evidenceSha256?: string;
  }) => Promise<Dispute>;
  updateDispute: (
    disputeId: string, 
    status: 'open' | 'investigating' | 'resolved' | 'dismissed', 
    regulatorNotes?: string
  ) => void;
  resetToDemo: () => void;
  // Modal controllers
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  preselectedCommitmentForUpload: string | null;
  openUploadModalForCommitment: (commitmentId?: string) => void;
  isVerifyModalOpen: boolean;
  setIsVerifyModalOpen: (open: boolean) => void;
  targetEvidenceToVerify: EvidenceRecord | null;
  openVerifyModal: (evidence?: EvidenceRecord | null) => void;
}

const STORAGE_KEY_PREFIX = 'thaw_compliance_v2_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('project_owner');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}lang`);
      return (saved === 'en' || saved === 'es') ? saved : 'es';
    } catch {
      return 'es';
    }
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'community'>('dashboard');
  const [selectedCommitmentId, setSelectedCommitmentId] = useState<string | null>(null);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [preselectedCommitmentForUpload, setPreselectedCommitmentForUpload] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [targetEvidenceToVerify, setTargetEvidenceToVerify] = useState<EvidenceRecord | null>(null);

  // Subnet block height ticker
  const [currentBlock, setCurrentBlock] = useState<number>(INITIAL_PROJECT.avalancheSubnet.blockHeight);

  // Core Data loaded from localStorage or seeds
  const [project] = useState<Project>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}project`);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT;
    } catch {
      return INITIAL_PROJECT;
    }
  });

  const [commitments, setCommitments] = useState<Commitment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}commitments`);
      return saved ? JSON.parse(saved) : INITIAL_COMMITMENTS;
    } catch {
      return INITIAL_COMMITMENTS;
    }
  });

  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}evidence`);
      return saved ? JSON.parse(saved) : INITIAL_EVIDENCE;
    } catch {
      return INITIAL_EVIDENCE;
    }
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}disputes`);
      return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
    } catch {
      return INITIAL_DISPUTES;
    }
  });

  // Save language to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}lang`, language);
    } catch {
      // ignore
    }
  }, [language]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}commitments`, JSON.stringify(commitments));
    } catch {
      // ignore
    }
  }, [commitments]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}evidence`, JSON.stringify(evidenceList));
    } catch {
      // ignore
    }
  }, [evidenceList]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}disputes`, JSON.stringify(disputes));
    } catch {
      // ignore
    }
  }, [disputes]);

  // Avalanche Subnet simulated block generation (~every 5.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBlock(prev => prev + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const openUploadModalForCommitment = (commitmentId?: string) => {
    setPreselectedCommitmentForUpload(commitmentId || null);
    setIsUploadModalOpen(true);
  };

  const openVerifyModal = (evidence?: EvidenceRecord | null) => {
    setTargetEvidenceToVerify(evidence || null);
    setIsVerifyModalOpen(true);
  };

  // Add Evidence (Simulated on-chain notarization)
  const addEvidence = async (params: {
    commitmentId: string;
    title: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    sha256: string;
    technicalNotes: string;
    category: string;
  }): Promise<EvidenceRecord> => {
    const newTxHash = generateAvalancheTxHash();
    const newBlock = currentBlock + 1;
    const nowIso = new Date().toISOString();

    const roleAddresses: Record<Role, string> = {
      project_owner: '0x71C8A3e4726487e83f0dEAA7628864f15d74291e',
      reviewer: '0x884D3C29b057E94B32A91F46A17C3D52e787A5B0',
      regulator: '0x44F99A2D81C0834BE8B6D12E4A71658E34988F01',
      community: '0x12D9b456C87EA029411F49C52E742A980B5277DF',
    };

    const roleDisplayNames: Record<Role, string> = language === 'es' ? {
      project_owner: 'Equipo Técnico Ambiental (Andes Minera)',
      reviewer: 'Consorcio Auditor Boreal EcoAudit (Auditor)',
      regulator: 'Superintendencia del Medio Ambiente (Inspector SMA)',
      community: 'Delegado Comunitario Ayllu Río Blanco',
    } : {
      project_owner: 'Engineering Compliance Team (Andes Minera)',
      reviewer: 'Boreal EcoAudit Consortium (Auditor)',
      regulator: 'Superintendence of the Environment (SMA Inspector)',
      community: 'Río Blanco Basin Ayllu Delegate',
    };

    const newEvidence: EvidenceRecord = {
      id: `ev-${Date.now()}`,
      commitmentId: params.commitmentId,
      title: params.title,
      fileName: params.fileName,
      fileSize: params.fileSize,
      mimeType: params.mimeType,
      sha256: params.sha256,
      txHash: newTxHash,
      blockNumber: newBlock,
      timestamp: nowIso,
      submittedBy: roleDisplayNames[role],
      submitterRole: role,
      submitterAddress: roleAddresses[role] || generateAvalancheAddress(),
      status: role === 'regulator' ? 'valid' : 'pending_review',
      technicalNotes: params.technicalNotes,
      category: params.category,
      simulatedGasUsed: Math.floor(38000 + Math.random() * 15000),
    };

    setEvidenceList(prev => [newEvidence, ...prev]);

    // Update commitment status: if it was pending or overdue, set to 'submitted'
    setCommitments(prev => prev.map(c => {
      if (c.id === params.commitmentId) {
        let nextStatus: CommitmentStatus = c.status;
        if (role === 'regulator') {
          nextStatus = 'validated';
        } else if (c.status === 'pending' || c.status === 'overdue') {
          nextStatus = 'submitted';
        }
        return {
          ...c,
          status: nextStatus,
          lastUpdated: nowIso,
        };
      }
      return c;
    }));

    return newEvidence;
  };

  // Review Evidence
  const reviewEvidence = (
    evidenceId: string, 
    status: EvidenceStatus, 
    reviewNotes: string
  ) => {
    const nowIso = new Date().toISOString();
    const reviewerName = role === 'regulator' 
      ? (language === 'es' ? 'Superintendencia del Medio Ambiente (Regulador)' : 'Superintendence of the Environment (Regulator)')
      : (language === 'es' ? 'Consorcio Auditor Boreal EcoAudit (Auditor Certificado)' : 'Boreal EcoAudit Consortium (Certified Auditor)');

    setEvidenceList(prev => prev.map(ev => {
      if (ev.id === evidenceId) {
        return {
          ...ev,
          status,
          reviewNotes,
          reviewedBy: reviewerName,
          reviewedAt: nowIso,
        };
      }
      return ev;
    }));

    // If validated, update commitment to validated
    if (status === 'valid') {
      const ev = evidenceList.find(e => e.id === evidenceId);
      if (ev) {
        setCommitments(prev => prev.map(c => {
          if (c.id === ev.commitmentId) {
            return { ...c, status: 'validated', lastUpdated: nowIso };
          }
          return c;
        }));
      }
    }
  };

  const updateCommitmentStatus = (commitmentId: string, status: CommitmentStatus) => {
    const nowIso = new Date().toISOString();
    setCommitments(prev => prev.map(c => {
      if (c.id === commitmentId) {
        return { ...c, status, lastUpdated: nowIso };
      }
      return c;
    }));
  };

  // Add Dispute (Community grievance mechanism)
  const addDispute = async (params: {
    commitmentId: string;
    title: string;
    category: string;
    filedBy: string;
    filerContact?: string;
    description: string;
    evidenceFileName?: string;
    evidenceSha256?: string;
  }): Promise<Dispute> => {
    const nowIso = new Date().toISOString();
    const txHash = generateAvalancheTxHash();

    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      commitmentId: params.commitmentId,
      title: params.title,
      category: params.category,
      filedBy: params.filedBy,
      filerContact: params.filerContact,
      filedAt: nowIso,
      description: params.description,
      evidenceFileName: params.evidenceFileName,
      evidenceSha256: params.evidenceSha256,
      evidenceTxHash: txHash,
      status: 'open',
    };

    setDisputes(prev => [newDispute, ...prev]);
    return newDispute;
  };

  // Update Dispute (Regulator action)
  const updateDispute = (
    disputeId: string, 
    status: 'open' | 'investigating' | 'resolved' | 'dismissed', 
    regulatorNotes?: string
  ) => {
    const nowIso = new Date().toISOString();
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          status,
          regulatorNotes: regulatorNotes || d.regulatorNotes,
          resolvedAt: status === 'resolved' || status === 'dismissed' ? nowIso : d.resolvedAt,
        };
      }
      return d;
    }));
  };

  const resetToDemo = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}commitments`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}evidence`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}disputes`);
    } catch {
      // ignore
    }
    setCommitments(INITIAL_COMMITMENTS);
    setEvidenceList(INITIAL_EVIDENCE);
    setDisputes(INITIAL_DISPUTES);
    setSelectedCommitmentId(null);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        selectedCommitmentId,
        setSelectedCommitmentId,
        project,
        commitments,
        evidenceList,
        disputes,
        currentBlock,
        addEvidence,
        reviewEvidence,
        updateCommitmentStatus,
        addDispute,
        updateDispute,
        resetToDemo,
        isUploadModalOpen,
        setIsUploadModalOpen,
        preselectedCommitmentForUpload,
        openUploadModalForCommitment,
        isVerifyModalOpen,
        setIsVerifyModalOpen,
        targetEvidenceToVerify,
        openVerifyModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
