import React, { useState } from 'react';
import {
  Filter, AlertTriangle, Tag, Layers, Shuffle, BarChart2,
  Download, CheckSquare, XSquare, ChevronDown, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InfoTooltip } from '../ui/Tooltip';
import { mockFlaggedSamples } from '../../data/mockData';
import { cn } from '../../lib/utils';
import type { AnomalyType, FlaggedSample, UserRole } from '../../types';

const anomalyConfig: Record<AnomalyType, {
  label: string; tooltip: string; icon: React.ElementType;
  color: string; bg: string; border: string;
  badgeBg: string; badgeColor: string;
}> = {
  LABEL_FLIP: {
    label: 'Mislabeled Images',
    tooltip: 'Identifies samples where the human label conflicts with the actual visual content.',
    icon: Tag,
    color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200',
    badgeBg: 'bg-rose-50', badgeColor: 'text-rose-700',
  },
  POISONING_PATCH: {
    label: 'Hidden Sabotage',
    tooltip: 'Scans images for hidden pixel patterns intentionally designed to mislead AI models.',
    icon: AlertTriangle,
    color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200',
    badgeBg: 'bg-rose-50', badgeColor: 'text-rose-700',
  },
  NEAR_DUPLICATE: {
    label: 'Duplicate Spam',
    tooltip: 'Detects identical or slightly cropped photos uploaded multiple times to skew results.',
    icon: Layers,
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
    badgeBg: 'bg-amber-50', badgeColor: 'text-amber-700',
  },
  OUT_OF_DISTRIBUTION: {
    label: 'Irrelevant Data',
    tooltip: 'Catches samples that do not match the expected dataset domain or context.',
    icon: Shuffle,
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
    badgeBg: 'bg-amber-50', badgeColor: 'text-amber-700',
  },
};

const severityVariant: Record<FlaggedSample['severity'], 'rejected' | 'flagged' | 'pending' | 'neutral'> = {
  critical: 'rejected', high: 'flagged', medium: 'pending', low: 'neutral',
};

// ── Realistic image preview thumbnail ─────────────────────────
function SampleThumbnail({ sample }: { sample: FlaggedSample }) {
  const anomalyType = sample.anomalyType;
  return (
    <div className="relative w-full h-28 bg-slate-100 border-b border-slate-200 overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Center placeholder */}
      <div className="flex flex-col items-center gap-1 text-slate-400">
        <BarChart2 className="w-5 h-5 stroke-[1.5] text-slate-400" />
        <span className="text-[10px] font-mono text-slate-400">640 × 480 px</span>
      </div>

      {/* Realistic annotation overlays */}
      {anomalyType === 'POISONING_PATCH' && (
        <div className="absolute bottom-2 right-2 border border-rose-500 bg-rose-50 px-1.5 py-0.5 rounded text-[9px] font-mono text-rose-700">
          patch: 14×14
        </div>
      )}
      {anomalyType === 'LABEL_FLIP' && (
        <div className="absolute top-2 right-2 border border-slate-300 bg-white/95 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-600">
          bbox: [48, 120]
        </div>
      )}
      {anomalyType === 'NEAR_DUPLICATE' && (
        <div className="absolute bottom-2 left-2 border border-amber-400 bg-amber-50 px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-800">
          sim: 0.982
        </div>
      )}

      {/* Anomaly badge */}
      <div className="absolute top-2 left-2">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-xs">
          {anomalyConfig[anomalyType].label}
        </span>
      </div>
    </div>
  );
}

// ── Sample card ──────────────────────────────────────────────
function SampleCard({ sample, selected, onToggle }: { sample: FlaggedSample; selected: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const config = anomalyConfig[sample.anomalyType];
  const Icon = config.icon;

  return (
    <div
      onClick={onToggle}
      className={cn(
        'rounded-lg border overflow-hidden transition-colors cursor-pointer bg-white',
        selected ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 shadow-card hover:border-slate-300'
      )}
    >
      <SampleThumbnail sample={sample} />
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', config.color)} strokeWidth={2} />
            <span className="text-xs font-semibold text-slate-900 truncate">{sample.assignedLabel}</span>
          </div>
          <Badge variant={severityVariant[sample.severity]}>{sample.severity.toUpperCase()}</Badge>
        </div>

        {/* Anomaly stats */}
        {sample.anomalyType === 'LABEL_FLIP' && sample.flaggedLabel && (
          <div className={cn('rounded-lg px-2.5 py-2 space-y-1.5', config.bg)}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Auto-Detected Issue</span>
              <span className="text-[10px] font-mono text-rose-600 font-bold">{sample.confidence}% conf.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 line-through">{sample.assignedLabel}</span>
              <span className="text-[10px] text-slate-400">→</span>
              <span className="text-xs font-semibold font-mono text-rose-700">{sample.flaggedLabel}</span>
            </div>
            <div className="progress-track h-1">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${sample.confidence}%` }} />
            </div>
          </div>
        )}

        {sample.anomalyType === 'POISONING_PATCH' && sample.spectralAnomalyScore !== undefined && (
          <div className={cn('rounded-lg px-2.5 py-2 space-y-1.5', config.bg)}>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Sabotage Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-rose-700">{sample.spectralAnomalyScore}</span>
              <span className="text-[10px] text-slate-400">vs threshold {sample.spectralThreshold}</span>
            </div>
            <div className="progress-track h-1 relative">
              <div className="h-full bg-slate-300 rounded-full absolute" style={{ width: `${(sample.spectralThreshold! / 1) * 100}%` }} />
              <div className="h-full bg-rose-500 rounded-full absolute" style={{ width: `${sample.spectralAnomalyScore * 100}%` }} />
            </div>
          </div>
        )}

        {sample.anomalyType === 'NEAR_DUPLICATE' && sample.similarityScore !== undefined && (
          <div className={cn('rounded-lg px-2.5 py-2 space-y-1.5', config.bg)}>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Duplicate Match Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-amber-700">{sample.similarityScore}</span>
              <span className="text-[10px] text-slate-400">across {sample.clusterSize?.toLocaleString()} samples</span>
            </div>
            <div className="progress-track h-1">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${sample.similarityScore! * 100}%` }} />
            </div>
          </div>
        )}

        {sample.anomalyType === 'OUT_OF_DISTRIBUTION' && (
          <div className={cn('rounded-lg px-2.5 py-2', config.bg)}>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Irrelevant Data Detection</span>
            <p className="text-xs font-mono text-amber-700 mt-1">Statistical distance: 4.8σ from expected distribution</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">{sample.contributorId}</span>
          <button
            className="text-slate-300 hover:text-slate-600 transition-colors"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} strokeWidth={2} />
          </button>
        </div>

        {expanded && (
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-50 rounded-lg p-2 border border-slate-100">
            {sample.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Filter bar ────────────────────────────────────────────────
function FilterBar({ active, onToggle }: { active: AnomalyType[]; onToggle: (t: AnomalyType) => void }) {
  const allTypes: AnomalyType[] = ['LABEL_FLIP', 'POISONING_PATCH', 'NEAR_DUPLICATE', 'OUT_OF_DISTRIBUTION'];
  return (
    <div className="flex flex-wrap items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg shadow-card">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium px-1">
        <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
        Filter By Issue
      </div>
      <div className="w-px h-4 bg-slate-200" />
      {allTypes.map((type) => {
        const cfg = anomalyConfig[type];
        const Icon = cfg.icon;
        const isActive = active.includes(type);
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors',
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            )}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

// ── View B ────────────────────────────────────────────────────
export function DataDiagnosticView({ role }: { role: UserRole }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeFilters, setActiveFilters] = useState<AnomalyType[]>([
    'LABEL_FLIP', 'POISONING_PATCH', 'NEAR_DUPLICATE', 'OUT_OF_DISTRIBUTION',
  ]);

  const toggleFilter = (t: AnomalyType) =>
    setActiveFilters((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  const toggleSelect = (id: string) =>
    setSelectedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = mockFlaggedSamples.filter((s) => activeFilters.includes(s.anomalyType));

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Info banner */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold">{filtered.length} flagged samples</span> require review.
          {role === 'contributor'
            ? ' Your submitted samples are under review. Contact support if you believe a flag is incorrect.'
            : ' Select samples to apply batch actions. All actions are logged to the audit trail.'}
        </p>
      </div>

      <FilterBar active={activeFilters} onToggle={toggleFilter} />

      {/* Batch toolbar */}
      {selectedIds.size > 0 && role !== 'contributor' && (
        <div className="flex items-center gap-2 p-2.5 bg-slate-900 text-white rounded-lg shadow-card-md animate-fade-in">
          <span className="text-xs font-medium px-2">{selectedIds.size} selected</span>
          <div className="flex-1" />
          <Button variant="danger"  size="xs" icon={<XSquare     className="w-3.5 h-3.5" strokeWidth={2} />}>Quarantine</Button>
          <Button variant="success" size="xs" icon={<CheckSquare className="w-3.5 h-3.5" strokeWidth={2} />}>Approve Override</Button>
          <Button variant="secondary" size="xs" icon={<Download  className="w-3.5 h-3.5" strokeWidth={2} />}>Export Manifest</Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((s) => (
          <SampleCard
            key={s.id}
            sample={s}
            selected={selectedIds.has(s.id)}
            onToggle={() => toggleSelect(s.id)}
          />
        ))}
      </div>
    </div>
  );
}
