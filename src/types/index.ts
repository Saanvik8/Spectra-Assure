// ============================================================
// SpectraAssure – Core TypeScript Interfaces
// ============================================================

export type UserRole = 'contributor' | 'auditor' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

export type PipelineStage = 'DATA_INGESTION' | 'WEIGHT_SCAN' | 'INFERENCE_GATE';

export type GateStatus = 'CLEARED' | 'FLAGGED' | 'REJECTED';

export type AnomalyType =
  | 'LABEL_FLIP'
  | 'POISONING_PATCH'
  | 'NEAR_DUPLICATE'
  | 'OUT_OF_DISTRIBUTION';

export type ModelFramework = 'ONNX' | 'PyTorch' | 'TensorFlow' | 'JAX';

// ──────────────────────────────────────────────
// Pipeline Ledger
// ──────────────────────────────────────────────
export interface LedgerEntry {
  id: string;
  timestamp: string; // ISO 8601
  contributorId: string;
  batchName: string;
  sha256Digest: string; // full 64-char hex
  stage: PipelineStage;
  gateStatus: GateStatus;
  notes?: string;
}

// ──────────────────────────────────────────────
// Metric Cards
// ──────────────────────────────────────────────
export interface SampleMetrics {
  total: number;
  verified: number;
  quarantined: number;
  verifiedPct: number;
  quarantinedPct: number;
}

export interface ModelRegistryMetrics {
  totalCheckpoints: number;
  approved: number;
  quarantined: number;
}

export interface InferenceMetrics {
  totalRuns: number;
  tamperAttemptsCaught: number;
  successRate: number;
}

export interface ContributorRiskMetrics {
  averageReputation: number;
  totalContributors: number;
  highRiskCount: number;
}

export interface DashboardMetrics {
  samples: SampleMetrics;
  modelRegistry: ModelRegistryMetrics;
  inference: InferenceMetrics;
  contributorRisk: ContributorRiskMetrics;
}

// ──────────────────────────────────────────────
// Training-Data Diagnostic Explorer
// ──────────────────────────────────────────────
export interface FlaggedSample {
  id: string;
  contributorId: string;
  batchId: string;
  anomalyType: AnomalyType;
  thumbnailPlaceholder: string; // CSS gradient or color string
  assignedLabel: string;
  flaggedLabel?: string;
  confidence?: number;
  spectralAnomalyScore?: number;
  spectralThreshold?: number;
  similarityScore?: number;
  clusterSize?: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  selected?: boolean;
}

// ──────────────────────────────────────────────
// Model Registry & Neural Cleanse
// ──────────────────────────────────────────────
export interface ModelCheckpoint {
  id: string;
  name: string;
  version: string;
  framework: ModelFramework;
  sha256Digest: string;
  uploadedAt: string;
  uploadedBy: string;
  sbomValidated: boolean;
  status: 'approved' | 'quarantined' | 'pending';
  anomalyIndex?: number; // Neural Cleanse anomaly index
  suspectClassIdx?: number;
  classAnomalyScores?: ClassAnomalyScore[];
}

export interface ClassAnomalyScore {
  classIndex: number;
  className: string;
  anomalyIndex: number;
  isOutlier: boolean;
}

export interface AttestationCertificate {
  schemaVersion: string;
  modelId: string;
  modelSha256: string;
  issuedAt: string;
  expiresAt: string;
  issuerDid: string;
  ed25519PublicKey: string;
  ed25519Signature: string;
  sbomRef: string;
  nonce: string;
  auditTrailHash: string;
}

// ──────────────────────────────────────────────
// Inference Anti-Tamper Verifier
// ──────────────────────────────────────────────
export type CheckStatus = 'pass' | 'fail' | 'pending';

export interface InferenceCheck {
  id: string;
  label: string;
  detail: string;
  status: CheckStatus;
}

export interface InferenceReceipt {
  receiptId: string;
  modelId: string;
  modelSha256: string;
  queryImageHash: string;
  inferenceResult: string;
  confidence: number;
  nonce: string;
  timestamp: string;
  ed25519Signature: string;
  authorityPublicKey: string;
  antiReplayWindowMs: number;
}
