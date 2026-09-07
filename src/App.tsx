import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/views/LandingPage';
import { AuthScreen } from './components/views/AuthScreen';
import { PipelineOverviewView } from './components/views/PipelineOverview';
import { DataDiagnosticView } from './components/views/DataDiagnostic';
import { ModelScannerView } from './components/views/ModelScanner';
import { InferenceVerifierView } from './components/views/InferenceVerifier';
import type { UserRole, AuthUser } from './types';

export type ViewId =
  | 'overview'
  | 'data-diagnostic'
  | 'model-scanner'
  | 'inference-verifier';

const STORAGE_KEY = 'spectra_auth_user';

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.name && parsed.role) {
      return parsed as AuthUser;
    }
  } catch {
    // corrupted — ignore
  }
  return null;
}

function App() {
  const [user,              setUser]              = useState<AuthUser | null>(loadStoredUser);
  const [activeView,        setActiveView]        = useState<ViewId>('overview');
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false);

  // Called by AuthScreen on successful sign-in
  const handleAuthenticate = (authUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    setActiveView('overview');
  };

  // Sign-out → clear session → back to AuthScreen
  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setActiveView('overview');
  };

  // ── Auth gate ──────────────────────────────────
  if (user === null) {
    return <AuthScreen onAuthenticate={handleAuthenticate} />;
  }

  // ── Dashboard ──────────────────────────────────
  const renderView = () => {
    switch (activeView) {
      case 'overview':           return <PipelineOverviewView  role={user.role} />;
      case 'data-diagnostic':    return <DataDiagnosticView    role={user.role} />;
      case 'model-scanner':      return <ModelScannerView      role={user.role} />;
      case 'inference-verifier': return <InferenceVerifierView role={user.role} />;
      default:                   return <PipelineOverviewView  role={user.role} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        activeView={activeView}
        onViewChange={setActiveView}
        onGoToLanding={handleSignOut}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          activeView={activeView}
          user={user}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6 max-w-screen-2xl mx-auto">
            {renderView()}
          </div>
        </main>

        {/* Status bar */}
        <footer className="h-7 flex-shrink-0 flex items-center px-5 gap-4 border-t border-slate-200 bg-white">
          <span className="text-[11px] text-slate-500">
            SpectraAssure v2.4.1 · Enterprise CV Pipeline Security
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Pipeline: Operational
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              2 alerts pending
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-rose-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              1 critical: Weight Scan Rejected
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
