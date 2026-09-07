import React, { useState } from 'react';
import { Lock, Shield, Eye, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { UserRole, AuthUser } from '../../types';

type AuthTab = 'admin' | 'auditor' | 'contributor';

interface AuthScreenProps {
  onAuthenticate: (user: AuthUser) => void;
}

const tabConfig: Record<AuthTab, {
  label: string;
  icon: React.ElementType;
}> = {
  admin: {
    label: 'Admin',
    icon: Shield,
  },
  auditor: {
    label: 'Security Auditor',
    icon: Eye,
  },
  contributor: {
    label: 'Contributor',
    icon: Users,
  },
};

const demoCredentials: Record<AuthTab, Record<string, string>> = {
  admin: {
    username: 'admin_root',
    masterKey: 'ADM-9942-SEC',
  },
  auditor: {
    auditorId: 'AUD-7701',
    passcode: 'secure123',
  },
  contributor: {
    email: 'jdoe@labteam.ai',
    password: 'secure123',
    teamBatchId: 'BATCH-CV-2026-Q3',
  },
};

// ── Validation logic ───────────────────────────────
function validateAdmin(data: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.username?.trim()) errors.username = 'Username is required.';
  if (!data.masterKey?.trim()) {
    errors.masterKey = 'Admin key is required.';
  } else if (!/^ADM-\d{4}-SEC$/.test(data.masterKey.trim())) {
    errors.masterKey = 'Invalid format. Expected ADM-XXXX-SEC.';
  }
  return errors;
}

function validateAuditor(data: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.auditorId?.trim()) {
    errors.auditorId = 'Auditor ID is required.';
  } else if (!data.auditorId.trim().startsWith('AUD-')) {
    errors.auditorId = 'ID must start with AUD-.';
  }
  if (!data.passcode?.trim()) {
    errors.passcode = 'Passcode is required.';
  } else if (data.passcode.trim().length < 6) {
    errors.passcode = 'Passcode must be at least 6 characters.';
  }
  return errors;
}

function validateContributor(data: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!data.password?.trim()) {
    errors.password = 'Password is required.';
  } else if (data.password.trim().length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (!data.teamBatchId?.trim()) {
    errors.teamBatchId = 'Team / Batch ID is required.';
  }
  return errors;
}

const validators: Record<AuthTab, (data: Record<string, string>) => Record<string, string>> = {
  admin: validateAdmin,
  auditor: validateAuditor,
  contributor: validateContributor,
};

function buildUser(tab: AuthTab, data: Record<string, string>): AuthUser {
  switch (tab) {
    case 'admin':
      return { id: 'adm-1', name: 'Master Admin', role: 'admin' };
    case 'auditor':
      return { id: 'aud-7701', name: 'MLOps Auditor', role: 'auditor' };
    case 'contributor': {
      const emailName = (data.email || '').split('@')[0] || 'contributor';
      return { id: 'contrib-04', name: emailName, role: 'contributor' };
    }
  }
}

// ── Component ──────────────────────────────────────
export function AuthScreen({ onAuthenticate }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>('admin');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contribMode, setContribMode] = useState<'signin' | 'register'>('signin');

  const fillDemo = () => {
    setFormData({ ...demoCredentials[activeTab] });
    setErrors({});
  };

  const handleSignIn = () => {
    const validationErrors = validators[activeTab](formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsTransitioning(true);
    const user = buildUser(activeTab, formData);
    setTimeout(() => {
      onAuthenticate(user);
    }, 350);
  };

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setFormData({});
    setErrors({});
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change
    if (errors[key]) {
      setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  const cfg = tabConfig[activeTab];

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center bg-[#F8FAFC]',
        isTransitioning ? 'opacity-0' : 'opacity-100'
      )}
      style={{ transition: 'opacity 0.35s ease' }}
    >
      <div className="relative w-full max-w-md mx-4 animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-slate-900 mb-3">
            <Lock className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            SpectraAssure
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise CV Pipeline Security
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {(Object.keys(tabConfig) as AuthTab[]).map((tab) => {
              const tc = tabConfig[tab];
              const Icon = tc.icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors border-b-2 -mb-px',
                    isActive
                      ? 'text-slate-900 border-slate-900 bg-white'
                      : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {tc.label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Demo autofill link */}
            <button
              onClick={fillDemo}
              className="w-full text-center text-xs text-slate-600 hover:text-slate-900 font-medium mb-5 underline underline-offset-2 transition-colors"
            >
              Fill demo {cfg.label} credentials
            </button>

            {/* Contributor mode toggle */}
            {activeTab === 'contributor' && (
              <div className="flex mb-5 bg-slate-100 rounded-lg p-0.5">
                {(['signin', 'register'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setContribMode(mode)}
                    className={cn(
                      'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all',
                      contribMode === mode
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    {mode === 'signin' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>
            )}

            {/* Fields */}
            <div className="space-y-4">
              {activeTab === 'admin' && (
                <>
                  <FieldInput
                    label="Username"
                    placeholder="admin_root"
                    value={formData.username || ''}
                    onChange={(v) => updateField('username', v)}
                    error={errors.username}
                    mono
                  />
                  <FieldInput
                    label="Master Admin Key"
                    placeholder="ADM-9942-SEC"
                    value={formData.masterKey || ''}
                    onChange={(v) => updateField('masterKey', v)}
                    error={errors.masterKey}
                    mono
                  />
                </>
              )}
              {activeTab === 'auditor' && (
                <>
                  <FieldInput
                    label="Auditor ID"
                    placeholder="AUD-7701"
                    value={formData.auditorId || ''}
                    onChange={(v) => updateField('auditorId', v)}
                    error={errors.auditorId}
                    mono
                  />
                  <FieldInput
                    label="Passcode"
                    placeholder="••••••••"
                    value={formData.passcode || ''}
                    onChange={(v) => updateField('passcode', v)}
                    error={errors.passcode}
                    type="password"
                  />
                </>
              )}
              {activeTab === 'contributor' && (
                <>
                  <FieldInput
                    label="Email Address"
                    placeholder="jdoe@labteam.ai"
                    value={formData.email || ''}
                    onChange={(v) => updateField('email', v)}
                    error={errors.email}
                    type="email"
                  />
                  <FieldInput
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password || ''}
                    onChange={(v) => updateField('password', v)}
                    error={errors.password}
                    type="password"
                  />
                  <FieldInput
                    label="Team / Batch ID"
                    placeholder="BATCH-CV-XXXX-QX"
                    value={formData.teamBatchId || ''}
                    onChange={(v) => updateField('teamBatchId', v)}
                    error={errors.teamBatchId}
                    mono
                  />
                </>
              )}
            </div>

            {/* Sign In button */}
            <button
              onClick={handleSignIn}
              className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
            >
              {activeTab === 'contributor' && contribMode === 'register'
                ? 'Create Account'
                : `Sign In as ${cfg.label}`}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          SpectraAssure v2.4.1 · Enterprise CV Pipeline Security
        </p>
      </div>
    </div>
  );
}

/* ── Field Input Component ─────────────────────── */

interface FieldInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  mono?: boolean;
  error?: string;
}

function FieldInput({ label, placeholder, value, onChange, type = 'text', mono, error }: FieldInputProps) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 rounded-md border bg-white text-sm text-slate-900',
          'placeholder:text-slate-400 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800',
          error ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300',
          mono && 'font-mono text-xs'
        )}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-700 font-medium">
          <AlertCircle className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
          {error}
        </p>
      )}
    </div>
  );
}
