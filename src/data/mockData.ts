// ============================================================
// SpectraAssure – Mock Dataset (Realistic CV Security Data)
// ============================================================

import type {
  LedgerEntry,
  DashboardMetrics,
  FlaggedSample,
  ModelCheckpoint,
  ClassAnomalyScore,
  AttestationCertificate,
  InferenceReceipt,
  InferenceCheck,
} from '../types';

// ──────────────────────────────────────────────
// Dashboard Metrics
// ──────────────────────────────────────────────
export const mockMetrics: DashboardMetrics = {
  samples: {
    total: 4_218_334,
    verified: 4_033_102,
    quarantined: 23_471,
    verifiedPct: 95.6,
    quarantinedPct: 0.56,
  },
  modelRegistry: {
    totalCheckpoints: 147,
    approved: 138,
    quarantined: 9,
  },
  inference: {
    totalRuns: 18_294_012,
    tamperAttemptsCaught: 1_847,
    successRate: 99.99,
  },
  contributorRisk: {
    averageReputation: 84.3,
    totalContributors: 2_314,
    highRiskCount: 31,
  },
};

// ──────────────────────────────────────────────
// Pipeline Ledger Entries
// ──────────────────────────────────────────────
export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: 'led-001',
    timestamp: '2026-09-06T07:03:14Z',
    contributorId: 'CTR-8841-JINL',
    batchName: 'streetview_night_batch_0094.tar.gz',
    sha256Digest: 'a3f2c17e9b08d4561234facb0018ef2c3d7a819e4b56f0e123cd45678901abcd',
    stage: 'DATA_INGESTION',
    gateStatus: 'CLEARED',
  },
  {
    id: 'led-002',
    timestamp: '2026-09-06T07:01:58Z',
    contributorId: 'CTR-2273-WKOP',
    batchName: 'traffic_sign_augmented_v7.zip',
    sha256Digest: 'b8de4a990cfa2318bc7d1e3f00984c51e6a27f3b18d9e452a71bc0988765fedc',
    stage: 'DATA_INGESTION',
    gateStatus: 'FLAGGED',
    notes: 'Mislabeled images detected in 4.2% of samples — Stop Sign → Speed Limit',
  },
  {
    id: 'led-003',
    timestamp: '2026-09-06T06:58:33Z',
    contributorId: 'CTR-5590-QRNM',
    batchName: 'yolov9_traffic_finetune_ep140.onnx',
    sha256Digest: '1c4e8f72ba36901de5c23094b5f71a8d0e4b9c6f2378014da59871bc23409ef1',
    stage: 'WEIGHT_SCAN',
    gateStatus: 'REJECTED',
    notes: 'Backdoor trigger detected via Backdoor Scanner. Score 3.47 > threshold 2.0.',
  },
  {
    id: 'led-004',
    timestamp: '2026-09-06T06:55:01Z',
    contributorId: 'CTR-1102-PLSX',
    batchName: 'inference_receipt_run_7743.json',
    sha256Digest: 'e72f9a0b1c3d45678901bef2a34c5d6e7f890a1b2c3d4e5f6789012345678901',
    stage: 'INFERENCE_GATE',
    gateStatus: 'CLEARED',
  },
  {
    id: 'led-005',
    timestamp: '2026-09-06T06:52:47Z',
    contributorId: 'CTR-3317-DVNQ',
    batchName: 'pedestrian_cross_batch_0231.tar.gz',
    sha256Digest: 'f1a2b3c4d5e6f7890123456789abcdef1234567890abcdef1234567890abcdef12',
    stage: 'DATA_INGESTION',
    gateStatus: 'FLAGGED',
    notes: 'Duplicate spam flooding: similarity score 0.982 across 1,340 samples.',
  },
  {
    id: 'led-006',
    timestamp: '2026-09-06T06:50:22Z',
    contributorId: 'CTR-9938-LMVT',
    batchName: 'resnet50_v4_checkpoint.pt',
    sha256Digest: '23456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    stage: 'WEIGHT_SCAN',
    gateStatus: 'CLEARED',
  },
  {
    id: 'led-007',
    timestamp: '2026-09-06T06:47:09Z',
    contributorId: 'CTR-7714-AZKW',
    batchName: 'inference_receipt_run_7742.json',
    sha256Digest: '9f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7d6c5b4a3928170605f4e3d2c1b',
    stage: 'INFERENCE_GATE',
    gateStatus: 'REJECTED',
    notes: 'Tamper-proof receipt mismatch. Replay attack suspected — token previously consumed.',
  },
  {
    id: 'led-008',
    timestamp: '2026-09-06T06:44:55Z',
    contributorId: 'CTR-4421-BNRQ',
    batchName: 'construction_zone_batch_0018.zip',
    sha256Digest: '0a1b2c3d4e5f6789abcdef1234567890abcdef1234567890abcdef123456789012',
    stage: 'DATA_INGESTION',
    gateStatus: 'CLEARED',
  },
  {
    id: 'led-009',
    timestamp: '2026-09-06T06:42:31Z',
    contributorId: 'CTR-6689-STNV',
    batchName: 'detr_r101_dc5_e2e_v2.onnx',
    sha256Digest: 'c0d1e2f3a4b5c6d7e8f9012345678901abcdef1234567890abcdef1234567890ab',
    stage: 'WEIGHT_SCAN',
    gateStatus: 'FLAGGED',
    notes: 'Bill-of-materials validation incomplete. License compliance gap in 2 transitive dependencies.',
  },
  {
    id: 'led-010',
    timestamp: '2026-09-06T06:40:18Z',
    contributorId: 'CTR-8841-JINL',
    batchName: 'highway_thermal_batch_0044.tar.gz',
    sha256Digest: 'd1e2f3a4b5c6d7e8f9012345678901abcdef1234567890abcdef1234567890abcd',
    stage: 'DATA_INGESTION',
    gateStatus: 'CLEARED',
  },
];

// ──────────────────────────────────────────────
// Flagged Samples
// ──────────────────────────────────────────────
export const mockFlaggedSamples: FlaggedSample[] = [
  {
    id: 'smp-001',
    contributorId: 'CTR-2273-WKOP',
    batchId: 'led-002',
    anomalyType: 'LABEL_FLIP',
    thumbnailPlaceholder: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    assignedLabel: 'Stop Sign',
    flaggedLabel: 'Speed Limit 30',
    confidence: 93.8,
    description:
      'Auto-detection confidence strongly favors "Speed Limit 30" (93.8%) over the contributor-assigned "Stop Sign". Suspicious geometric transformation on boundary detected.',
    severity: 'critical',
  },
  {
    id: 'smp-002',
    contributorId: 'CTR-4421-BNRQ',
    batchId: 'led-003',
    anomalyType: 'POISONING_PATCH',
    thumbnailPlaceholder: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
    assignedLabel: 'Yield Sign',
    spectralAnomalyScore: 0.84,
    spectralThreshold: 0.35,
    description:
      'High-frequency checkerboard patch (14×14 px) detected in lower-right quadrant. Hidden sabotage check reveals adversarial trigger pattern consistent with backdoor insertion.',
    severity: 'critical',
  },
  {
    id: 'smp-003',
    contributorId: 'CTR-3317-DVNQ',
    batchId: 'led-005',
    anomalyType: 'NEAR_DUPLICATE',
    thumbnailPlaceholder: 'linear-gradient(135deg, #172554 0%, #1e3a5f 50%, #1e40af 100%)',
    assignedLabel: 'Pedestrian Crossing',
    similarityScore: 0.982,
    clusterSize: 1340,
    description:
      'Duplicate spam filter match score of 0.982 detected across 1,340 samples within contributor batch. Flooding attack pattern — synthetic overrepresentation of a single scene geometry.',
    severity: 'high',
  },
  {
    id: 'smp-004',
    contributorId: 'CTR-8841-JINL',
    batchId: 'led-001',
    anomalyType: 'OUT_OF_DISTRIBUTION',
    thumbnailPlaceholder: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    assignedLabel: 'Traffic Light',
    confidence: 12.4,
    description:
      'Irrelevant data check flags this sample as 4.8σ from the expected data distribution. Likely synthetic image inserted from a different domain (simulation vs. real-world).',
    severity: 'medium',
  },
];

// ──────────────────────────────────────────────
// Model Checkpoints
// ──────────────────────────────────────────────
const mockClassScores: ClassAnomalyScore[] = [
  { classIndex: 0, className: 'Stop Sign', anomalyIndex: 0.42, isOutlier: false },
  { classIndex: 1, className: 'Speed Limit 30', anomalyIndex: 0.51, isOutlier: false },
  { classIndex: 2, className: 'Yield Sign', anomalyIndex: 0.38, isOutlier: false },
  { classIndex: 3, className: 'Traffic Light', anomalyIndex: 0.61, isOutlier: false },
  { classIndex: 4, className: 'Pedestrian Crossing', anomalyIndex: 0.47, isOutlier: false },
  { classIndex: 5, className: 'No Entry', anomalyIndex: 0.55, isOutlier: false },
  { classIndex: 6, className: 'Roundabout', anomalyIndex: 3.47, isOutlier: true }, // ← backdoor target
  { classIndex: 7, className: 'School Zone', anomalyIndex: 0.43, isOutlier: false },
  { classIndex: 8, className: 'Highway Entry', anomalyIndex: 0.39, isOutlier: false },
  { classIndex: 9, className: 'Emergency Vehicle', anomalyIndex: 0.58, isOutlier: false },
];

export const mockModelCheckpoints: ModelCheckpoint[] = [
  {
    id: 'mdl-001',
    name: 'spectra-traffic-detector-v3',
    version: '3.2.1',
    framework: 'ONNX',
    sha256Digest: '7f3a9b2c1d4e5f6789abcdef1234567890abcdef1234567890abcdef12345678',
    uploadedAt: '2026-09-05T14:22:10Z',
    uploadedBy: 'CTR-1102-PLSX',
    sbomValidated: true,
    status: 'approved',
    anomalyIndex: 0.61,
  },
  {
    id: 'mdl-002',
    name: 'yolov9-traffic-finetune',
    version: '1.0.0-ep140',
    framework: 'ONNX',
    sha256Digest: '1c4e8f72ba36901de5c23094b5f71a8d0e4b9c6f2378014da59871bc23409ef1',
    uploadedAt: '2026-09-06T06:44:01Z',
    uploadedBy: 'CTR-5590-QRNM',
    sbomValidated: false,
    status: 'quarantined',
    anomalyIndex: 3.47,
    suspectClassIdx: 6,
    classAnomalyScores: mockClassScores,
  },
  {
    id: 'mdl-003',
    name: 'resnet50-scene-classifier-v4',
    version: '4.1.0',
    framework: 'PyTorch',
    sha256Digest: '23456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    uploadedAt: '2026-09-06T06:50:00Z',
    uploadedBy: 'CTR-9938-LMVT',
    sbomValidated: true,
    status: 'approved',
    anomalyIndex: 0.44,
  },
  {
    id: 'mdl-004',
    name: 'detr-r101-dc5-e2e-v2',
    version: '2.0.3',
    framework: 'ONNX',
    sha256Digest: 'c0d1e2f3a4b5c6d7e8f9012345678901abcdef1234567890abcdef1234567890ab',
    uploadedAt: '2026-09-06T06:42:00Z',
    uploadedBy: 'CTR-6689-STNV',
    sbomValidated: false,
    status: 'pending',
    anomalyIndex: 0.72,
  },
  {
    id: 'mdl-005',
    name: 'efficientdet-d4-pedestrian',
    version: '2.3.7',
    framework: 'TensorFlow',
    sha256Digest: 'e7f8a9b0c1d2e3f4567890abcdef1234567890abcdef1234567890abcdef123456',
    uploadedAt: '2026-09-04T11:15:22Z',
    uploadedBy: 'CTR-1102-PLSX',
    sbomValidated: true,
    status: 'approved',
    anomalyIndex: 0.38,
  },
];

// ──────────────────────────────────────────────
// Attestation Certificate
// ──────────────────────────────────────────────
export const mockAttestationCertificate: AttestationCertificate = {
  schemaVersion: '2.1.0',
  modelId: 'mdl-001',
  modelSha256: '7f3a9b2c1d4e5f6789abcdef1234567890abcdef1234567890abcdef12345678',
  issuedAt: '2026-09-06T07:03:14Z',
  expiresAt: '2026-12-06T07:03:14Z',
  issuerDid: 'did:spectra:authority:0xA3f2C17e9B08D4561234FaCb0018Ef2C3D7a819E',
  ed25519PublicKey: 'ed25519:MCowBQYDK2VwAyEAf4K2m9RNvBQ1z8JhX3pDcLwYqTsGkMnVr0uEhOi6RaI=',
  ed25519Signature:
    '3bdb1e7f2a94c5d8e1f3b06a27c4d9e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8',
  sbomRef: 'sha256:4a5b6c7d8e9f0a1b2c3d4e5f6789abcdef1234567890abcdef1234567890abcdef',
  nonce: 'sa_nonce_9f7e2a1b4c8d3e0f',
  auditTrailHash: 'sha256:f1e2d3c4b5a69788796a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4',
};

// ──────────────────────────────────────────────
// Inference Receipt (Clean)
// ──────────────────────────────────────────────
export const mockCleanReceipt: InferenceReceipt = {
  receiptId: 'rcpt-7743-9f8e-7d6c',
  modelId: 'mdl-001',
  modelSha256: '7f3a9b2c1d4e5f6789abcdef1234567890abcdef1234567890abcdef12345678',
  queryImageHash: 'sha256:a1b2c3d4e5f6789012345678abcdef901234567890abcdef1234567890abcdef12',
  inferenceResult: 'Stop Sign',
  confidence: 98.72,
  nonce: 'sa_nonce_4b8c1e5f9d2a7c3e',
  timestamp: '2026-09-06T07:03:14.221Z',
  ed25519Signature:
    '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  authorityPublicKey: 'ed25519:MCowBQYDK2VwAyEAf4K2m9RNvBQ1z8JhX3pDcLwYqTsGkMnVr0uEhOi6RaI=',
  antiReplayWindowMs: 30000,
};

export const mockCleanChecks: InferenceCheck[] = [
  {
    id: 'chk-001',
    label: 'Model Hash matches verified registry',
    detail: `Registry SHA-256: 7f3a9b2c...12345678`,
    status: 'pass',
  },
  {
    id: 'chk-002',
    label: 'Replay protection window valid',
    detail: 'Replay protection passed — token sa_nonce_4b8c1e5f9d2a7c3e is fresh (Δt = 142ms)',
    status: 'pass',
  },
  {
    id: 'chk-003',
    label: 'Tamper-proof receipt signature matches authority key',
    detail: 'Signature verified against did:spectra:authority:0xA3f2C17e...819E',
    status: 'pass',
  },
  {
    id: 'chk-004',
    label: 'Inference result integrity',
    detail: 'Result hash bound to receipt payload — no post-hoc modification detected',
    status: 'pass',
  },
];

export const mockTamperedChecks: InferenceCheck[] = [
  {
    id: 'chk-001',
    label: 'Model Hash matches verified registry',
    detail: `Mismatch — receipt claims 7f3a9b2c...12345678, registry shows 9a1f4c7e...deadbeef`,
    status: 'fail',
  },
  {
    id: 'chk-002',
    label: 'Replay protection window valid',
    detail: 'REPLAY DETECTED — token sa_nonce_4b8c1e5f9d2a7c3e was previously consumed at 07:01:03Z',
    status: 'fail',
  },
  {
    id: 'chk-003',
    label: 'Tamper-proof receipt signature matches authority key',
    detail: 'Signature INVALID — payload has been modified after signing',
    status: 'fail',
  },
  {
    id: 'chk-004',
    label: 'Inference result integrity',
    detail: 'Result payload hash mismatch — field "inferenceResult" was mutated',
    status: 'fail',
  },
];
