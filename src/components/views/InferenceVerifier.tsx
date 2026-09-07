import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud, CheckCircle2, XCircle, Clock,
  ShieldAlert, ShieldCheck, AlertTriangle,
  Hash, Key, Timer, Fingerprint, FileJson, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { InfoTooltip } from '../ui/Tooltip';
import { mockCleanReceipt, mockCleanChecks, mockTamperedChecks } from '../../data/mockData';
import { cn } from '../../lib/utils';
import type { InferenceCheck, CheckStatus, UserRole } from '../../types';

const checkIconMap: Record<string, React.ElementType> = {
  'chk-001': Hash,
  'chk-002': Timer,
  'chk-003': Key,
  'chk-004': Fingerprint,
};

// ── Animated check item ──────────────────────────────────────
function CheckItem({ check, delay }: { check: InferenceCheck; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [status, setStatus]   = useState<CheckStatus>('pending');

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true),          delay);
    const t2 = setTimeout(() => setStatus(check.status),  delay + 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [check.status, delay]);

  const Icon = checkIconMap[check.id] ?? ShieldCheck;

  // Add tooltips for specific check IDs
  const labelWithTooltip = () => {
    if (check.id === 'chk-002') {
      return (
        <InfoTooltip
          label={check.label}
          tooltip="Prevents stale or intercepted predictions from being reused."
        />
      );
    }
    if (check.id === 'chk-003') {
      return (
        <InfoTooltip
          label={check.label}
          tooltip="Cryptographic seal proving that this prediction came directly from the certified model."
        />
      );
    }
    return check.label;
  };

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border transition-colors bg-white',
      status === 'fail' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
    )}>
      {/* Status icon */}
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
        status === 'pending'  && 'bg-slate-100',
        status === 'pass'     && 'bg-emerald-100/60',
        status === 'fail'     && 'bg-rose-100/60',
      )}>
        {status === 'pending' && <Clock        className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />}
        {status === 'pass'    && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2} />}
        {status === 'fail'    && <XCircle      className="w-3.5 h-3.5 text-rose-700"    strokeWidth={2} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.75} />
          <span className="text-xs font-medium text-slate-900">
            {labelWithTooltip()}
          </span>
        </div>
        <p className="text-[11px] font-mono mt-1 leading-relaxed text-slate-500">
          {check.detail}
        </p>
      </div>

      <div className="flex-shrink-0">
        {status === 'pass'    && <Badge variant="cleared">PASS</Badge>}
        {status === 'fail'    && <Badge variant="rejected">FAIL</Badge>}
        {status === 'pending' && <Badge variant="neutral">—</Badge>}
      </div>
    </div>
  );
}

// ── Drop zone ────────────────────────────────────────────────
function DropZone({ label, icon: Icon, loaded, onLoad }: {
  label: string; icon: React.ElementType; loaded: boolean; onLoad: () => void;
}) {
  return (
    <div
      onClick={onLoad}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onLoad(); }}
      className={cn(
        'border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all min-h-[96px]',
        loaded
          ? 'border-emerald-300 bg-emerald-50'
          : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30'
      )}
    >
      {loaded ? (
        <>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={2} />
          <span className="text-xs text-emerald-700 font-semibold">Loaded</span>
        </>
      ) : (
        <>
          <Icon className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
          <span className="text-xs text-slate-500 font-medium text-center">{label}</span>
          <span className="text-[10px] text-slate-400">Click or drag &amp; drop</span>
        </>
      )}
    </div>
  );
}

// ── Receipt JSON preview ─────────────────────────────────────
function ReceiptPreview({ tampered }: { tampered: boolean }) {
  const r = mockCleanReceipt;
  const fields = [
    { key: 'receiptId',        value: r.receiptId },
    { key: 'modelId',          value: r.modelId },
    { key: 'modelSha256',      value: tampered ? '9a1f4c7e...deadbeef ← MODIFIED' : r.modelSha256 },
    { key: 'inferenceResult',  value: tampered ? '"Roundabout" ← MUTATED' : `"${r.inferenceResult}"` },
    { key: 'confidence',       value: String(r.confidence) },
    { key: 'nonce',            value: tampered ? r.nonce + ' ← REPLAYED' : r.nonce },
    { key: 'timestamp',        value: r.timestamp },
    { key: 'signature',        value: r.ed25519Signature.slice(0, 24) + '…' },
  ];

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-3.5 py-2 border-b border-slate-200 flex items-center gap-2">
        <FileJson className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex-1">
          inference-receipt.json
        </span>
        {tampered && (
          <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-mono">
            TAMPERED
          </span>
        )}
      </div>
      <div className="p-3.5 space-y-1 text-[11px]">
        {fields.map(({ key, value }) => {
          const isMutated = tampered && (
            value.includes('MODIFIED') || value.includes('MUTATED') || value.includes('REPLAYED')
          );
          return (
            <div key={key} className="flex gap-2">
              <span className="text-indigo-500 font-mono shrink-0">"{key}":</span>
              <span className={cn('font-mono break-all', isMutated ? 'text-rose-600 font-semibold' : 'text-emerald-700')}>
                {value.startsWith('"') ? value : `"${value}"`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── View D ────────────────────────────────────────────────────
export function InferenceVerifierView({ role }: { role: UserRole }) {
  const [receiptLoaded, setReceiptLoaded] = useState(false);
  const [imageLoaded,   setImageLoaded]   = useState(false);
  const [isRunning,  setIsRunning]  = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [tampered,   setTampered]   = useState(false);
  const [checkKey,   setCheckKey]   = useState(0);

  const checks  = tampered ? mockTamperedChecks : mockCleanChecks;
  const canRun  = receiptLoaded && imageLoaded;
  const passed  = isComplete && !tampered;
  const failed  = isComplete && tampered;

  const runVerification = () => {
    if (!canRun || isRunning) return;
    setIsRunning(true);
    setIsComplete(false);
    setCheckKey((k) => k + 1);
    setTimeout(() => { setIsRunning(false); setIsComplete(true); }, checks.length * 300 + 800);
  };

  const handleTamperToggle = () => {
    setTampered((t) => !t);
    if (isComplete) setCheckKey((k) => k + 1);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: input sandbox */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <CardTitle>Receipt Inspection Sandbox</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <DropZone label="Signed JSON Receipt" icon={FileJson}    loaded={receiptLoaded} onLoad={() => setReceiptLoaded(true)} />
              <DropZone label="Query Image"          icon={UploadCloud} loaded={imageLoaded}   onLoad={() => setImageLoaded(true)} />

              {/* Tamper toggle — auditor/admin only */}
              {(role === 'auditor' || role === 'admin') && (
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Simulate Tampered Payload</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Triggers immediate security mismatch</p>
                  </div>
                  <button
                    onClick={handleTamperToggle}
                    className={cn('transition-colors', tampered ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500')}
                  >
                    {tampered
                      ? <ToggleRight className="w-8 h-8" strokeWidth={1.75} />
                      : <ToggleLeft  className="w-8 h-8" strokeWidth={1.75} />}
                  </button>
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={!canRun}
                loading={isRunning}
                onClick={runVerification}
                icon={<ShieldCheck className="w-4 h-4" strokeWidth={2} />}
              >
                {isRunning ? 'Verifying…' : 'Run Security Verification'}
              </Button>
            </CardContent>
          </Card>

          {receiptLoaded && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>
                  <InfoTooltip
                    label="Tamper-Proof Receipt"
                    tooltip="Cryptographic seal proving that this prediction came directly from the certified model."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ReceiptPreview tampered={tampered} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: validation checklist */}
        <div className="lg:col-span-3 space-y-4">
          <Card className={cn(
            'transition-all duration-300',
            failed && 'border-rose-300',
            passed && 'border-emerald-300',
          )}>
            <CardHeader className={cn(
              failed && 'border-rose-100 bg-rose-50/30',
              passed && 'border-emerald-100 bg-emerald-50/30',
            )}>
              <div className="flex items-center gap-2">
                {passed
                  ? <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                  : failed
                    ? <ShieldAlert className="w-4 h-4 text-rose-600" strokeWidth={2} />
                    : <ShieldCheck className="w-4 h-4 text-slate-400" strokeWidth={1.75} />}
                <CardTitle className={passed ? 'text-emerald-700' : failed ? 'text-rose-700' : ''}>
                  Security Verification Checklist
                </CardTitle>
              </div>
              {isComplete && (
                <Badge variant={passed ? 'cleared' : 'rejected'} dot>
                  {passed ? 'ALL CHECKS PASSED' : `${checks.filter(c => c.status === 'fail').length} FAILURES`}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-2">
              {!canRun && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Load a receipt and image to begin</p>
                    <p className="text-xs text-slate-400 mt-1">Security verification will run automatically</p>
                  </div>
                </div>
              )}

              {canRun && (
                <div key={checkKey} className="space-y-2">
                  {checks.map((check, i) => (
                    <CheckItem
                      key={`${checkKey}-${check.id}`}
                      check={check}
                      delay={isRunning || isComplete ? i * 300 : 0}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result banners */}
          {failed && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold text-rose-700">Security Alert: Payload Tampering Detected</p>
                <p className="text-xs text-rose-600 mt-1.5 leading-relaxed">
                  This inference receipt has failed security verification. The payload was modified
                  after signing, and a replay attack was detected via a previously consumed token. This event
                  has been logged to the immutable audit trail.{' '}
                  <strong>Do not trust the inference result.</strong>
                </p>
              </div>
            </div>
          )}

          {passed && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Verification Complete — Receipt is Authentic</p>
                <p className="text-xs text-emerald-600 mt-1.5 leading-relaxed">
                  All four security checks passed. The inference result{' '}
                  <strong>"Stop Sign"</strong> (confidence 98.72%) is bound to the verified model
                  checkpoint via tamper-proof receipt. Replay protection confirmed — token is fresh within the 30s window.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
