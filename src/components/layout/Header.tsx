import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AuthUser, UserRole } from '../../types';
import type { ViewId } from '../../App';

const viewLabels: Record<ViewId, string> = {
  'overview':           'Pipeline Overview',
  'data-diagnostic':    'Training-Data Diagnostics',
  'model-scanner':      'Model Weights & Backdoor Scanner',
  'inference-verifier': 'Inference Security Verifier',
};

const roleConfig: Record<UserRole, { label: string; color: string; bg: string; border: string }> = {
  contributor: {
    label:    'Contributor',
    color:    'text-slate-700',
    bg:       'bg-slate-100',
    border:   'border-slate-200',
  },
  auditor: {
    label:    'Security Auditor',
    color:    'text-slate-700',
    bg:       'bg-slate-100',
    border:   'border-slate-200',
  },
  admin: {
    label:    'System Admin',
    color:    'text-slate-700',
    bg:       'bg-slate-100',
    border:   'border-slate-200',
  },
};

interface HeaderProps {
  activeView: ViewId;
  user: AuthUser;
  onSignOut: () => void;
}

export function Header({ activeView, user, onSignOut }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  });

  const notifications = [
    { id: 1, Icon: XCircle,       color: 'text-rose-500',    msg: 'Weight Scan Rejected: yolov9 — Backdoor detected (score 3.47)', time: '6m ago' },
    { id: 2, Icon: AlertTriangle,  color: 'text-amber-500',   msg: 'Data Ingestion Flagged: traffic_sign_v7 — Mislabeled images detected', time: '11m ago' },
    { id: 3, Icon: CheckCircle2,   color: 'text-emerald-500', msg: 'Inference Gate Cleared: receipt_7743 passed all security checks', time: '18m ago' },
  ];

  const rc = roleConfig[user.role];

  return (
    <header className="h-14 flex-shrink-0 flex items-center px-5 border-b border-slate-200 bg-white gap-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs flex-1 min-w-0">
        <span className="text-slate-400">SpectraAssure</span>
        <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" strokeWidth={2} />
        <span className="text-slate-700 font-medium truncate">{viewLabels[activeView]}</span>
      </nav>

      {/* Live session */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block" />
        <span className="text-[11px] font-mono text-slate-600">
          {timeStr} <span className="text-slate-400">UTC</span>
        </span>
      </div>

      {/* Notifications */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-11 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-card-md overflow-hidden animate-fade-in">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">Alerts</span>
              <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">3 new</span>
            </div>
            <div className="divide-y divide-slate-50">
              {notifications.map(({ id, Icon, color, msg, time: t }) => (
                <div key={id} className="px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <Icon className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', color)} strokeWidth={2} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-700 leading-relaxed">{msg}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{t}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User identity & role badge */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <User className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
        </div>
        <div className="hidden sm:block min-w-0">
          <p className="text-xs font-semibold text-slate-900 truncate leading-tight">{user.name}</p>
          <span className={cn(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border mt-0.5',
            rc.bg, rc.color, rc.border
          )}>
            {rc.label}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

      {/* Sign Out */}
      <button
        onClick={onSignOut}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-200"
      >
        <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </header>
  );
}
