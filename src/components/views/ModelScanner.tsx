import React, { useState } from 'react';
import {
  BrainCircuit, ShieldAlert, CheckCircle2, Copy, Check, X,
  FileText, ChevronRight, Package, Cpu, AlertOctagon,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InfoTooltip } from '../ui/Tooltip';
import { mockModelCheckpoints, mockAttestationCertificate } from '../../data/mockData';
import { cn, truncateHash, formatTimestamp, copyToClipboard } from '../../lib/utils';
import type { ModelCheckpoint, UserRole } from '../../types';

// ── Backdoor Score Bar Chart ─────────────────────────────────
function BackdoorScoreChart({ scores }: { scores: NonNullable<ModelCheckpoint['classAnomalyScores']> }) {
  const THRESHOLD = 2.0;
  const maxVal = Math.max(...scores.map((s) => s.anomalyIndex), THRESHOLD + 0.5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-700">
          <InfoTooltip
            label="Class-by-Class Backdoor Score"
            tooltip="Tests model weights to find out if it was secretly trained to trigger a specific target label."
          />
        </p>
        <span className="text-[10px] font-mono text-slate-500">
          Threshold: <span className="text-amber-600 font-bold">{THRESHOLD}</span>
        </span>
      </div>
      <div className="space-y-1.5">
        {scores.map((score) => {
          const pct = (score.anomalyIndex / maxVal) * 100;
          const threshPct = (THRESHOLD / maxVal) * 100;
          return (
            <div key={score.classIndex} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-32 text-right flex-shrink-0 truncate">
                {score.className}
              </span>
              <div className="flex-1 relative h-3.5 bg-slate-100 rounded overflow-hidden">
                {/* Threshold marker */}
                <div className="absolute top-0 bottom-0 w-px bg-amber-500 z-10" style={{ left: `${threshPct}%` }} />
                {/* Bar */}
                <div
                  className={cn('h-full rounded-xs', score.isOutlier ? 'bg-rose-600' : 'bg-slate-300')}
                  style={{ width: `${pct}%`, transition: 'width 0.3s ease' }}
                />
              </div>
              <span className={cn('text-xs font-mono w-10 text-right flex-shrink-0', score.isOutlier ? 'text-rose-700 font-semibold' : 'text-slate-500')}>
                {score.anomalyIndex.toFixed(2)}{score.isOutlier && ' ↑'}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded p-2">
        Class 6 ("Roundabout") score {3.47} exceeds anomaly threshold {THRESHOLD} — trigger suspected.
      </p>
    </div>
  );
}

// ── Activation Map Comparison ────────────────────────────────
function ActivationMapComparison() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-700">Layer Activation Profile: Baseline vs. Suspect</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Baseline Checkpoint</span>
            <span className="font-mono text-[10px]">L4/Conv3</span>
          </div>
          <div className="h-24 rounded border border-slate-200 bg-white p-2.5 flex flex-col justify-between">
            <div className="grid grid-cols-6 gap-1">
              {[42, 68, 85, 91, 54, 33, 29, 74, 95, 88, 62, 40].map((v, i) => (
                <div
                  key={i}
                  className="h-5 rounded-xs bg-slate-100 flex items-center justify-center text-[9px] font-mono text-slate-600"
                  style={{ opacity: v / 100 }}
                >
                  .{v}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Standard activation spread</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-rose-700">
            <span className="font-medium">Triggered Response</span>
            <span className="font-mono text-[10px] text-rose-600">L4/Outlier</span>
          </div>
          <div className="h-24 rounded border border-rose-200 bg-rose-50/30 p-2.5 flex flex-col justify-between">
            <div className="grid grid-cols-6 gap-1">
              {[12, 18, 25, 21, 14, 13, 98, 99, 97, 22, 19, 15].map((v, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-5 rounded-xs flex items-center justify-center text-[9px] font-mono',
                    v > 90 ? 'bg-rose-600 text-white font-medium' : 'bg-rose-100/50 text-rose-800'
                  )}
                >
                  .{v}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-rose-800 font-medium">
              Hotspot at indices [6..8]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Attestation Certificate Modal ────────────────────────────
function AttestationModal({ modelId, onClose }: { modelId: string; onClose: () => void }) {
  const cert = mockAttestationCertificate;
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = (key: string, val: string) => {
    copyToClipboard(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fields = [
    { key: 'schema',  label: 'schemaVersion',     value: cert.schemaVersion },
    { key: 'model',   label: 'modelSha256',        value: cert.modelSha256, mono: true },
    { key: 'issued',  label: 'issuedAt',           value: cert.issuedAt, mono: true },
    { key: 'expires', label: 'expiresAt',          value: cert.expiresAt, mono: true },
    { key: 'issuer',  label: 'issuerDid',          value: cert.issuerDid, mono: true },
    { key: 'pubkey',  label: 'publicKey',          value: cert.ed25519PublicKey, mono: true },
    { key: 'sig',     label: 'signature',          value: cert.ed25519Signature, mono: true },
    { key: 'sbom',    label: 'sbomRef',            value: cert.sbomRef, mono: true },
    { key: 'nonce',   label: 'nonce',              value: cert.nonce, mono: true },
    { key: 'audit',   label: 'auditTrailHash',     value: cert.auditTrailHash, mono: true },
  ];

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[640px] max-w-[95vw] max-h-[85vh] overflow-auto bg-white border border-slate-200 rounded-2xl shadow-card-md animate-fade-in">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <Dialog.Title className="text-sm font-semibold text-slate-900">Signed Attestation Certificate</Dialog.Title>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Model ID: {modelId}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
              <p className="text-xs text-emerald-700">
                <span className="font-semibold">Certificate Valid</span> — Bill of materials verified · Signature authentic · Issued by trusted authority
              </p>
            </div>
            {/* JSON viewer */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-3.5 py-2 border-b border-slate-200 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">canonical-attestation.json</span>
              </div>
              <div className="p-4 space-y-1.5">
                {fields.map(({ key, label, value, mono }) => (
                  <div key={key} className="flex items-start gap-2 group/f text-[11px]">
                    <span className="text-indigo-500 font-mono w-36 flex-shrink-0 text-right shrink-0">"{label}":</span>
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className={cn('text-emerald-700 break-all', mono && 'font-mono text-[10px]')}>"{value}"</span>
                      <button onClick={() => copy(key, value)} className="opacity-0 group-hover/f:opacity-100 transition-opacity flex-shrink-0">
                        {copiedField === key
                          ? <Check className="w-3 h-3 text-emerald-500" strokeWidth={2.5} />
                          : <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" strokeWidth={2} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="secondary" size="sm">Download .json</Button>
              <Button variant="primary" size="sm">Publish to Registry</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Checkpoint row ────────────────────────────────────────────
function CheckpointRow({ model, onInspect, onAttest, canEdit }: {
  model: ModelCheckpoint; onInspect: () => void; onAttest: () => void; canEdit: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const statusVariant = model.status === 'approved' ? 'approved' : model.status === 'quarantined' ? 'quarantined' : 'pending';

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
            model.status === 'quarantined' ? 'bg-rose-50' : 'bg-slate-100')}>
            {model.status === 'quarantined'
              ? <AlertOctagon className="w-3.5 h-3.5 text-rose-500" strokeWidth={2} />
              : <BrainCircuit className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">{model.name}</p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{model.version}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5 group/h">
          <span className="font-mono text-[11px] text-slate-400">{truncateHash(model.sha256Digest, 8)}</span>
          <button onClick={() => { copyToClipboard(model.sha256Digest); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="opacity-0 group-hover/h:opacity-100 transition-opacity">
            {copied ? <Check className="w-3 h-3 text-emerald-500" strokeWidth={2.5} /> : <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" strokeWidth={2} />}
          </button>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-slate-400" strokeWidth={1.5} />
          <span className="text-[11px] font-mono text-slate-500">{model.framework}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        {model.sbomValidated
          ? <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} /><span className="text-[11px] text-emerald-700 font-medium">Validated</span></div>
          : <div className="flex items-center gap-1.5"><X className="w-3.5 h-3.5 text-rose-500" strokeWidth={2.5} /><span className="text-[11px] text-rose-600 font-medium">Missing</span></div>}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className={cn('text-[11px] font-mono font-bold', (model.anomalyIndex ?? 0) > 2.0 ? 'text-rose-600' : 'text-slate-500')}>
            {model.anomalyIndex?.toFixed(2) ?? '—'}
          </span>
          {(model.anomalyIndex ?? 0) > 2.0 && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" strokeWidth={2} />}
        </div>
      </td>
      <td className="px-5 py-3.5"><Badge variant={statusVariant} dot>{model.status.toUpperCase()}</Badge></td>
      <td className="px-5 py-3.5">
        {canEdit && (
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {model.classAnomalyScores && (
              <Button variant="danger" size="xs" onClick={onInspect} icon={<ChevronRight className="w-3 h-3" strokeWidth={2} />}>
                Inspect
              </Button>
            )}
            {model.status === 'approved' && (
              <Button variant="success" size="xs" onClick={onAttest} icon={<FileText className="w-3 h-3" strokeWidth={2} />}>
                Attest
              </Button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

// ── View C ────────────────────────────────────────────────────
export function ModelScannerView({ role }: { role: UserRole }) {
  const [inspectedModel, setInspectedModel] = useState<ModelCheckpoint | null>(null);
  const [attestModelId, setAttestModelId] = useState<string | null>(null);
  const canEdit = role === 'auditor' || role === 'admin';

  return (
    <div className="space-y-5 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Model Checkpoint Registry</CardTitle>
            <Badge variant="neutral">{mockModelCheckpoints.length} checkpoints</Badge>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Button variant="secondary" size="xs" icon={<Package className="w-3.5 h-3.5" strokeWidth={1.75} />}>Import</Button>
              <Button variant="primary" size="xs" icon={<FileText className="w-3.5 h-3.5" strokeWidth={2} />}>Batch Attest</Button>
            </div>
          )}
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Model / Version', 'SHA-256 Digest', 'Framework', 'SBOM', '', 'Status', 'Actions'].map((h, i) => (
                  <th key={h || i} className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {i === 4 ? (
                      <InfoTooltip
                        label="Backdoor Score"
                        tooltip="Tests model weights to find out if it was secretly trained to trigger a specific target label."
                      />
                    ) : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockModelCheckpoints.map((m) => (
                <CheckpointRow key={m.id} model={m} canEdit={canEdit}
                  onInspect={() => setInspectedModel(m)} onAttest={() => setAttestModelId(m.id)} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Backdoor Scanner Panel */}
      {inspectedModel?.classAnomalyScores && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
          <Card className="border-rose-200">
            <CardHeader className="border-rose-100">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" strokeWidth={2} />
                <CardTitle className="text-rose-700">
                  <InfoTooltip
                    label="Backdoor Scanner Analysis"
                    tooltip="Tests model weights to find out if it was secretly trained to trigger a specific target label."
                  />
                </CardTitle>
              </div>
              <button onClick={() => setInspectedModel(null)} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <p className="text-xs font-mono text-rose-700">
                  Model: <span className="text-slate-700 font-semibold">{inspectedModel.name} v{inspectedModel.version}</span>
                </p>
                <p className="text-xs font-mono text-rose-700 mt-0.5">
                  Suspect class: <span className="text-rose-600 font-bold">Index {inspectedModel.suspectClassIdx} "Roundabout"</span>
                </p>
              </div>
              <BackdoorScoreChart scores={inspectedModel.classAnomalyScores} />
            </CardContent>
          </Card>

          <Card className="border-rose-200">
            <CardHeader className="border-rose-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" strokeWidth={2} />
                <CardTitle className="text-rose-700">Activation Map Comparison</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ActivationMapComparison />
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 justify-end">
                <Button variant="danger" size="sm">Quarantine Model</Button>
                <Button variant="primary" size="sm" onClick={() => setAttestModelId(inspectedModel.id)}>
                  Generate Attestation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {attestModelId && <AttestationModal modelId={attestModelId} onClose={() => setAttestModelId(null)} />}
    </div>
  );
}
