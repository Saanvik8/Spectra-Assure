import React, { useState } from 'react';
import {
  Database, BrainCircuit, ShieldCheck, Users,
  Copy, Check, ExternalLink, ChevronDown, ChevronUp, Minus,
  UploadCloud, Star, Clock, TrendingUp, TrendingDown,
  Server, Key, Settings2, AlertCircle, PackageCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InfoTooltip } from '../ui/Tooltip';
import { mockMetrics, mockLedgerEntries } from '../../data/mockData';
import { cn, truncateHash, formatNumber, formatTimestamp } from '../../lib/utils';
import type { GateStatus, PipelineStage, UserRole } from '../../types';

// ── Metric Card ──────────────────────────────────────────────
function MetricCard({
  icon: Icon, label, value, subMetrics, trend, trendValue,
}: {
  icon: React.ElementType; label: string; value: string;
  subMetrics: { label: string; value: string; color?: string }[];
  trend?: 'up' | 'down' | 'flat'; trendValue?: string;
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-700' : trend === 'down' ? 'text-rose-700' : 'text-slate-500';

  return (
    <Card className="hover:border-slate-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
          </div>
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 text-[11px] font-medium', trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" strokeWidth={2} />
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-semibold text-slate-900 tabular-nums tracking-tight mb-3">{value}</p>
        <div className="pt-3 border-t border-slate-100 flex gap-5 flex-wrap">
          {subMetrics.map((m, i) => (
            <div key={i}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{m.label}</p>
              <p className={cn('text-xs font-semibold mt-0.5', m.color ?? 'text-slate-700')}>{m.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Status badge map ─────────────────────────────────────────
const gateStatusVariant: Record<GateStatus, 'cleared' | 'flagged' | 'rejected'> = {
  CLEARED: 'cleared', FLAGGED: 'flagged', REJECTED: 'rejected',
};

const stageLabel: Record<PipelineStage, string> = {
  DATA_INGESTION: 'DATA_INGESTION', WEIGHT_SCAN: 'WEIGHT_SCAN', INFERENCE_GATE: 'INFERENCE_GATE',
};

// ── Hash copy cell ────────────────────────────────────────────
function HashCell({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-1.5 group/h">
      <span className="font-mono text-[11px] text-slate-500">{truncateHash(hash, 8)}</span>
      <button
        onClick={() => { navigator.clipboard.writeText(hash).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="opacity-0 group-hover/h:opacity-100 transition-opacity"
      >
        {copied
          ? <Check className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
          : <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" strokeWidth={2} />}
      </button>
    </div>
  );
}

// ── Pipeline ledger table ────────────────────────────────────
function PipelineLedger() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Live Pipeline Ledger</CardTitle>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-medium text-slate-700">LIVE</span>
          </div>
        </div>
        <Button variant="ghost" size="xs" icon={<ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />}>
          Export CSV
        </Button>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['Timestamp', 'Contributor', 'Batch / Asset', 'SHA-256 Digest', 'Stage', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockLedgerEntries.map((entry) => (
              <React.Fragment key={entry.id}>
                <tr
                  className="group/row hover:bg-slate-50/70 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                >
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{entry.contributorId}</td>
                  <td className="px-5 py-3 max-w-[180px]">
                    <span className="text-[12px] text-slate-700 truncate block" title={entry.batchName}>{entry.batchName}</span>
                  </td>
                  <td className="px-5 py-3"><HashCell hash={entry.sha256Digest} /></td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{stageLabel[entry.stage]}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={gateStatusVariant[entry.gateStatus]} dot>{entry.gateStatus}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Button variant="ghost" size="xs" className="opacity-0 group-hover/row:opacity-100 transition-opacity">
                      Details
                    </Button>
                  </td>
                </tr>
                {expandedId === entry.id && entry.notes && (
                  <tr className="bg-amber-50/50">
                    <td colSpan={7} className="px-5 py-2 text-xs text-amber-700 font-mono border-l-2 border-amber-400">
                      <span className="text-slate-400 font-semibold mr-2">NOTE</span>{entry.notes}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── Contributor-specific view ────────────────────────────────
function ContributorView() {
  const batches = [
    { id: 'Batch #104', samples: 4_200,  accepted: 4_180, flagged: 20,  status: 'approved' as const, date: 'Sep 06, 2026' },
    { id: 'Batch #089', samples: 8_100,  accepted: 7_920, flagged: 180, status: 'flagged'  as const, date: 'Sep 02, 2026' },
  ];
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Trust Score */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-1">
          <CardContent className="p-5">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Trust Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold text-slate-900 tabular-nums">88</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '88%' }} />
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-2">+2 pts this week</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardContent className="p-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Accepted Batches</p>
            <p className="text-2xl font-bold text-slate-900 font-mono mt-1">12</p>
            <p className="text-xs text-slate-500 mt-0.5">of 14 total submissions</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardContent className="p-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Samples</p>
            <p className="text-2xl font-bold text-slate-900 font-mono mt-1">42,300</p>
            <p className="text-xs text-emerald-600 mt-0.5">42,100 verified clean</p>
          </CardContent>
        </Card>
      </div>

      {/* My Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
          <Button variant="primary" size="sm" icon={<UploadCloud className="w-3.5 h-3.5" strokeWidth={2} />}>
            Submit New Batch
          </Button>
        </CardHeader>
        <div className="divide-y divide-slate-50">
          {batches.map((b) => (
            <div key={b.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <PackageCheck className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{b.id}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {b.samples.toLocaleString()} samples — {b.accepted.toLocaleString()} accepted · {b.flagged} flagged
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge variant={b.status} dot>{b.status.toUpperCase()}</Badge>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">{b.date}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Upload dropzone */}
        <div className="m-5 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
          <UploadCloud className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
          <p className="text-sm font-medium text-slate-500">Drop .zip or .tar.gz dataset here</p>
          <p className="text-xs text-slate-400">Max 50 GB · Supported: images, annotations, class manifests</p>
          <Button variant="outline" size="sm" className="mt-1">Choose File</Button>
        </div>
      </Card>
    </div>
  );
}

// ── Admin-specific view ──────────────────────────────────────
function AdminView() {
  const workers = [
    { name: 'data-ingest-worker-01', status: 'running', queued: 142, cpu: '62%' },
    { name: 'weight-scan-worker-01', status: 'running', queued: 8,   cpu: '34%' },
    { name: 'inference-gate-01',     status: 'idle',    queued: 0,   cpu: '2%'  },
  ];
  const apiKeys = [
    { name: 'ci-pipeline-key',      lastUsed: '2m ago',  scopes: 'read:pipeline write:ingest' },
    { name: 'auditor-readonly-key', lastUsed: '14m ago', scopes: 'read:all' },
    { name: 'admin-key-alpha',      lastUsed: '1h ago',  scopes: 'admin:*' },
  ];
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Worker throughput */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
              <CardTitle>Worker Throughput</CardTitle>
            </div>
          </CardHeader>
          <div className="divide-y divide-slate-50">
            {workers.map((w) => (
              <div key={w.name} className="px-5 py-3.5 flex items-center gap-3">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', w.status === 'running' ? 'bg-emerald-500' : 'bg-slate-300')} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 font-mono">{w.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{w.queued} jobs queued · CPU {w.cpu}</p>
                </div>
                <Badge variant={w.status === 'running' ? 'approved' : 'neutral'}>{w.status.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
              <CardTitle>Active API Keys</CardTitle>
            </div>
            <Button variant="primary" size="xs">+ New Key</Button>
          </CardHeader>
          <div className="divide-y divide-slate-50">
            {apiKeys.map((k) => (
              <div key={k.name} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Key className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 font-mono">{k.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{k.scopes}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-slate-400 font-mono">{k.lastUsed}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pipeline settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
            <CardTitle>Pipeline Infrastructure Settings</CardTitle>
          </div>
          <Button variant="secondary" size="sm">Save Changes</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Backdoor Scanner Threshold', tooltip: 'Tests model weights to find out if it was secretly trained to trigger a specific target label.', value: '2.0',   unit: 'score' },
              { label: 'Sabotage Detection Threshold', tooltip: 'Scans images for hidden pixel patterns intentionally designed to mislead AI models.', value: '0.35', unit: 'score' },
              { label: 'Replay Protection Window',     tooltip: 'Prevents stale or intercepted predictions from being reused.', value: '30',   unit: 'seconds' },
            ].map(({ label, tooltip, value, unit }) => (
              <div key={label} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <InfoTooltip label={label} tooltip={tooltip} />
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-bold text-slate-900 font-mono">{value}</span>
                  <span className="text-xs text-slate-400">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── View A: Pipeline Overview ────────────────────────────────
export function PipelineOverviewView({ role }: { role: UserRole }) {
  const { samples, modelRegistry, inference, contributorRisk } = mockMetrics;

  if (role === 'contributor') return <ContributorView />;
  if (role === 'admin') return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Database}    label="Contributed Samples" value={formatNumber(samples.total)}
          subMetrics={[{ label: 'Verified', value: `${samples.verifiedPct}%`, color: 'text-emerald-600' }, { label: 'Quarantined', value: `${samples.quarantinedPct}%`, color: 'text-rose-600' }]}
          trend="up" trendValue="+2.4%" />
        <MetricCard icon={BrainCircuit} label="Model Registry" value={String(modelRegistry.totalCheckpoints)}
          subMetrics={[{ label: 'Approved', value: String(modelRegistry.approved), color: 'text-emerald-600' }, { label: 'Quarantined', value: String(modelRegistry.quarantined), color: 'text-rose-600' }]} />
        <MetricCard icon={ShieldCheck}  label="Inference Receipts" value={formatNumber(inference.totalRuns)}
          subMetrics={[{ label: 'Tamper Caught', value: formatNumber(inference.tamperAttemptsCaught), color: 'text-rose-600' }, { label: 'Success', value: `${inference.successRate}%`, color: 'text-emerald-600' }]}
          trend="up" trendValue="+0.3%" />
        <MetricCard icon={Users}        label="Contributor Risk" value={String(contributorRisk.averageReputation)}
          subMetrics={[{ label: 'Contributors', value: formatNumber(contributorRisk.totalContributors) }, { label: 'High Risk', value: String(contributorRisk.highRiskCount), color: 'text-rose-600' }]}
          trend="down" trendValue="-1.2pt" />
      </div>
      <AdminView />
    </div>
  );

  // Auditor view (default)
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Database}    label="Contributed Samples" value={formatNumber(samples.total)}
          subMetrics={[{ label: 'Verified', value: `${samples.verifiedPct}%`, color: 'text-emerald-600' }, { label: 'Quarantined', value: `${samples.quarantinedPct}%`, color: 'text-rose-600' }]}
          trend="up" trendValue="+2.4%" />
        <MetricCard icon={BrainCircuit} label="Model Registry" value={String(modelRegistry.totalCheckpoints)}
          subMetrics={[{ label: 'Approved', value: String(modelRegistry.approved), color: 'text-emerald-600' }, { label: 'Quarantined', value: String(modelRegistry.quarantined), color: 'text-rose-600' }]} />
        <MetricCard icon={ShieldCheck}  label="Inference Receipts" value={formatNumber(inference.totalRuns)}
          subMetrics={[{ label: 'Tamper Caught', value: formatNumber(inference.tamperAttemptsCaught), color: 'text-rose-600' }, { label: 'Success', value: `${inference.successRate}%`, color: 'text-emerald-600' }]}
          trend="up" trendValue="+0.3%" />
        <MetricCard icon={Users}        label="Contributor Risk Agg." value={String(contributorRisk.averageReputation)}
          subMetrics={[{ label: 'Contributors', value: formatNumber(contributorRisk.totalContributors) }, { label: 'High Risk', value: String(contributorRisk.highRiskCount), color: 'text-rose-600' }]}
          trend="down" trendValue="-1.2pt" />
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Sample Integrity', value: Math.round(samples.verifiedPct), barColor: 'bg-emerald-600', sub: `${formatNumber(samples.quarantined)} quarantined`, subColor: 'text-rose-700' },
          { label: 'Model Health', value: Math.round((modelRegistry.approved / modelRegistry.totalCheckpoints) * 100), barColor: 'bg-slate-800', sub: `${modelRegistry.quarantined} backdoor suspects`, subColor: 'text-rose-700' },
          { label: 'Avg. Reputation', value: Math.round(contributorRisk.averageReputation), barColor: 'bg-slate-800', sub: `${contributorRisk.highRiskCount} flagged accounts`, subColor: 'text-amber-800' },
        ].map(({ label, value, barColor, sub, subColor }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                <span className="text-sm font-semibold text-slate-900 tabular-nums">{value}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div className={cn('h-full rounded-full', barColor)} style={{ width: `${value}%` }} />
              </div>
              <p className={cn('text-xs font-medium mt-2', subColor)}>{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <PipelineLedger />
    </div>
  );
}
