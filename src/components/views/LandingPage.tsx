import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  ChevronDown,
  ShieldCheck,
  FlaskConical,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Database,
  Key,
  Cpu,
  Activity,
  ExternalLink,
  Users,
  ChevronRight,
  Hash,
  Zap,
} from 'lucide-react';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

// ── Animated counter ─────────────────────────────────────────
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      setCount((c) => {
        if (c + step >= target) { clearInterval(timer); return target; }
        return c + step;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

function AnimatedStat({
  target,
  suffix = '',
  label,
  started,
}: {
  target: number;
  suffix?: string;
  label: string;
  started: boolean;
}) {
  const count = useCounter(target, 2200, started);
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  points: string[];
  tag: string;
  tagColor: string;
  tagBg: string;
  delay?: string;
}

function FeatureCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  points,
  tag,
  tagColor,
  tagBg,
  delay = '0ms',
}: FeatureCardProps) {
  return (
    <div
      className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-card card-lift flex flex-col gap-4"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} strokeWidth={1.75} />
        </div>
        <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border', tagColor, tagBg)}>
          {tag}
        </span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>
      </div>
      <ul className="space-y-2 mt-auto">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Nav role dropdown ────────────────────────────────────────
interface RoleDropdownProps {
  onRoleSelect: (role: UserRole) => void;
}

const roleOptions: { role: UserRole; label: string; sublabel: string }[] = [
  { role: 'contributor', label: 'Contributor',   sublabel: 'Data Labeler / Vendor' },
  { role: 'auditor',     label: 'Security Auditor', sublabel: 'MLOps / Reviewer' },
  { role: 'admin',       label: 'System Admin',  sublabel: 'Full Pipeline Access' },
];

function RoleDropdown({ onRoleSelect }: RoleDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        Access Dashboard As
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 bg-white border border-slate-200 rounded-xl shadow-card-md overflow-hidden animate-fade-in">
          {roleOptions.map(({ role, label, sublabel }) => (
            <button
              key={role}
              onClick={() => { onRoleSelect(role); setOpen(false); }}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
            >
              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mini pipeline diagram ────────────────────────────────────
function PipelineDiagram() {
  const stages = [
    { label: 'Ingest', icon: Database,    color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-200' },
    { label: 'Scan',   icon: FlaskConical, color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200' },
    { label: 'Attest', icon: BrainCircuit, color: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-200' },
    { label: 'Gate',   icon: ShieldCheck,  color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ];
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 mb-2">
      {stages.map(({ label, icon: Icon, color, bg, border }, i) => (
        <React.Fragment key={label}>
          <div className={cn('flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border', bg, border)}>
            <Icon className={cn('w-5 h-5', color)} strokeWidth={1.75} />
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{label}</span>
          </div>
          {i < stages.length - 1 && (
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" strokeWidth={2} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Trust Indicators row ─────────────────────────────────────
function TrustIndicators() {
  const items = [
    { icon: Key,      text: 'Ed25519 Signatures' },
    { icon: Hash,     text: 'SHA-256 Digests' },
    { icon: Zap,      text: 'Sub-100ms Gate Latency' },
    { icon: Activity, text: 'Monotonic Anti-Replay' },
    { icon: Cpu,      text: 'ONNX & PyTorch Ready' },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4">
      {items.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Icon className="w-3.5 h-3.5 text-slate-300" strokeWidth={2} />
          {text}
        </div>
      ))}
    </div>
  );
}

// ── Landing Page ─────────────────────────────────────────────
interface LandingPageProps {
  onEnterDashboard: (role: UserRole) => void;
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const navLinks = ['Architecture', 'Data Integrity', 'Model Scanner', 'Inference Verifier', 'Docs'];

  const features: FeatureCardProps[] = [
    {
      icon: FlaskConical,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      title: 'Training-Data Diagnostics',
      subtitle: 'Confident learning and spectral signatures catch corrupted batches before a single GPU cycle is wasted.',
      tag: 'Data Layer',
      tagColor: 'text-rose-700',
      tagBg: 'border-rose-200 bg-rose-50',
      points: [
        'Label flip detection via multi-class disagreement',
        'BadNets-style spectral patch anomaly scoring',
        'DINOv2 cosine similarity for near-duplicate flooding',
        'Mahalanobis OOD distance scoring',
      ],
    },
    {
      icon: BrainCircuit,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50',
      title: 'Weight & Checkpoint Auditing',
      subtitle: 'Neural Cleanse trigger inversion and per-class anomaly indices expose backdoors invisible to standard validation.',
      tag: 'Model Layer',
      tagColor: 'text-violet-700',
      tagBg: 'border-violet-200 bg-violet-50',
      points: [
        'Per-class Neural Cleanse anomaly index (threshold 2.0)',
        'SHA-256 model weight digest pinning',
        'SBOM validation with license gap detection',
        'Signed attestation certificate generation (Ed25519)',
      ],
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      title: 'Cryptographic Inference Receipts',
      subtitle: 'Every prediction is signed, nonce-protected, and verifiable — from edge inference to cloud-side audit.',
      tag: 'Inference Layer',
      tagColor: 'text-emerald-700',
      tagBg: 'border-emerald-200 bg-emerald-50',
      points: [
        'Ed25519 payload signatures bound to model checkpoint',
        'Anti-replay protection via monotonic nonce window',
        'Tamper-evident JSON receipt format (schema v2.1)',
        'DID-based issuer authority verification',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <Lock className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-900">SpectraAssure</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right: role dropdown */}
          <div className="ml-auto flex-shrink-0">
            <RoleDropdown onRoleSelect={onEnterDashboard} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Zero-Trust Assurance for Computer Vision
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-5">
            Cryptographic Integrity for{' '}
            <span className="gradient-text">Multi-Contributor</span>{' '}
            Vision Pipelines
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-8">
            Detect poisoning attacks, eliminate label flipping, stress-test weights for backdoors,
            and cryptographically attest every inference prediction — across any contributor network.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onEnterDashboard('auditor')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              Launch Auditor Portal
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onEnterDashboard('admin')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
            >
              View Live Verifier
              <ExternalLink className="w-4 h-4 text-slate-400" strokeWidth={2} />
            </button>
          </div>

          {/* Pipeline Diagram */}
          <PipelineDiagram />
          <TrustIndicators />
        </section>

        {/* Stats Counter Strip */}
        <section
          ref={statsRef}
          className="border-y border-slate-200 bg-white py-10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-8">
              Pipeline metrics — live
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <AnimatedStat target={4218334}  label="Samples Verified"       started={statsVisible} />
              <AnimatedStat target={18294012} label="Inference Receipts"      started={statsVisible} />
              <AnimatedStat target={1847}     label="Tamper Attempts Caught"  started={statsVisible} />
              <AnimatedStat target={147}      label="Model Checkpoints"       started={statsVisible} />
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Three-Layer Assurance
            </p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Every layer of your CV pipeline, covered
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={`${i * 80}ms`} />
            ))}
          </div>
        </section>

        {/* Role portal cards */}
        <section className="bg-white border-t border-slate-200 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Access Control</p>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Role-tailored dashboards</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  role: 'contributor' as UserRole,
                  title: 'Contributor Portal',
                  subtitle: 'Submit datasets, track trust scores, monitor your batch acceptance rate.',
                  icon: Users,
                  color: 'text-emerald-700',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-200',
                  btnClass: 'bg-emerald-600 hover:bg-emerald-700',
                },
                {
                  role: 'auditor' as UserRole,
                  title: 'Auditor Portal',
                  subtitle: 'Full risk queue, backdoor anomaly charts, and approve/quarantine controls.',
                  icon: ShieldCheck,
                  color: 'text-amber-700',
                  bg: 'bg-amber-50',
                  border: 'border-amber-200',
                  btnClass: 'bg-amber-600 hover:bg-amber-700',
                },
                {
                  role: 'admin' as UserRole,
                  title: 'Admin Console',
                  subtitle: 'System throughput, API key management, and pipeline infrastructure settings.',
                  icon: Cpu,
                  color: 'text-indigo-700',
                  bg: 'bg-indigo-50',
                  border: 'border-indigo-200',
                  btnClass: 'bg-indigo-600 hover:bg-indigo-700',
                },
              ].map(({ role, title, subtitle, icon: Icon, color, bg, border, btnClass }) => (
                <div key={role} className={cn('rounded-xl border p-5 flex flex-col gap-4', bg, border)}>
                  <div className={cn('w-9 h-9 rounded-lg bg-white border flex items-center justify-center shadow-sm', border)}>
                    <Icon className={cn('w-4.5 h-4.5', color)} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subtitle}</p>
                  </div>
                  <button
                    onClick={() => onEnterDashboard(role)}
                    className={cn(
                      'mt-auto w-full py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm',
                      btnClass
                    )}
                  >
                    Enter as {title.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-slate-600">SpectraAssure</span>
            <span className="text-xs text-slate-400">v2.4.1</span>
          </div>
          <p className="text-xs text-slate-400">
            Zero-Trust Pipeline Assurance for Vision Datasets, Model Weights, and Inference Receipts
          </p>
        </div>
      </footer>
    </div>
  );
}
