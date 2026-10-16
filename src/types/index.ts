export type Role = 'project_owner' | 'reviewer' | 'regulator' | 'community';

export type CommitmentStatus = 'pending' | 'submitted' | 'validated' | 'overdue';

export type EvidenceStatus = 'valid' | 'pending_review' | 'flagged' | 'superseded';

export type CommitmentCategory = 
  | 'water' 
  | 'air' 
  | 'biodiversity' 
  | 'tailings' 
  | 'community' 
  | 'labor';

export interface EvidenceRecord {
  id: string;
  commitmentId: string;
  title: string;
  fileName: string;
  fileSize: number; // in bytes
  mimeType: string;
  sha256: string;
  txHash: string; // Avalanche 0x...
  blockNumber: number;
  timestamp: string; // ISO format
  submittedBy: string;
  submitterRole: Role;
  submitterAddress: string;
  status: EvidenceStatus;
  technicalNotes: string;
  category: string;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  simulatedGasUsed?: number;
}

export interface Dispute {
  id: string;
  commitmentId: string;
  title: string;
  category: string;
  filedBy: string;
  filerContact?: string;
  filedAt: string;
  description: string;
  evidenceFileName?: string;
  evidenceSha256?: string;
  evidenceTxHash?: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  regulatorNotes?: string;
  resolvedAt?: string;
}

export interface Commitment {
  id: string;
  clauseId: string; // e.g. "RCA-ENV-01"
  title: string;
  description: string;
  category: CommitmentCategory;
  owner: string; // responsible party
  responsibleContact: string;
  deadline: string; // YYYY-MM-DD
  frequency: string;
  status: CommitmentStatus;
  requiredEvidence: string;
  legalCitation: string;
  lastUpdated: string;
}

export interface AvalancheSubnetInfo {
  name: string;
  subnetId: string;
  chainId: number;
  rpcUrl: string;
  blockHeight: number;
  validatorNodes: number;
  averageFinality: string;
  nativeToken: string;
  consensusEngine: string;
}

export interface Project {
  id: string;
  name: string;
  permitNumber: string;
  regulatoryBody: string;
  operator: string;
  location: string;
  biome: string;
  approvedDate: string;
  description: string;
  avalancheSubnet: AvalancheSubnetInfo;
}
