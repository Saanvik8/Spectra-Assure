import React from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  BrainCircuit,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Lock,
  Settings,
  Activity,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ViewId } from '../../App';

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Pipeline Overview', icon: LayoutDashboard },
  { id: 'data-diagnostic', label: 'Data Diagnostics', icon: FlaskConical, badge: '4' },
  { id: 'model-scanner', label: 'Weights Scanner', icon: BrainCircuit, badge: '1' },
  { id: 'inference-verifier', label: 'Inference Verifier', icon: ShieldCheck },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  onGoToLanding: () => void;
}

export function Sidebar({ collapsed, onToggle, activeView, onViewChange, onGoToLanding }: SidebarProps) {
  return (
    <aside
      className={cn(
        'relative flex flex-col bg-white border-r border-slate-200 flex-shrink-0',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Wordmark */}
      <div className={cn(
        'flex items-center border-b border-slate-200 h-14 flex-shrink-0 overflow-hidden',
        collapsed ? 'px-3 justify-center' : 'px-4 gap-2.5'
      )}>
        <div className="flex-shrink-0 w-7 h-7 rounded bg-slate-900 flex items-center justify-center">
          <Lock className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-sm font-semibold text-slate-900 tracking-tight block truncate">SpectraAssure</span>
            <span className="text-[11px] text-slate-500 block -mt-0.5">Pipeline Security</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden px-2">
        {!collapsed && (
          <p className="px-2 pb-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Pipeline
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center rounded-md transition-colors group',
                collapsed ? 'justify-center p-2.5' : 'px-2.5 py-2 gap-2.5',
                isActive
                  ? 'bg-slate-100 text-slate-900 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon
                className={cn(
                  'flex-shrink-0 w-4 h-4 transition-colors',
                  isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {!collapsed && (
                <>
                  <span className="text-xs flex-1 text-left truncate">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-medium min-w-[18px] h-4 flex items-center justify-center rounded px-1.5 bg-slate-100 text-slate-600 border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-2 space-y-0.5">
        <button
          onClick={onGoToLanding}
          title={collapsed ? 'Sign Out' : undefined}
          className={cn(
            'w-full flex items-center gap-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all text-xs font-medium',
            collapsed ? 'justify-center p-2.5' : 'px-2.5 py-2'
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          {!collapsed && 'Sign Out'}
        </button>
        {[
          { icon: Activity, label: 'Audit Log' },
          { icon: Settings, label: 'Settings' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={collapsed ? label : undefined}
            className={cn(
              'w-full flex items-center gap-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all text-xs font-medium',
              collapsed ? 'justify-center p-2.5' : 'px-2.5 py-2'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            {!collapsed && label}
          </button>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-card flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" strokeWidth={2} />
          : <ChevronLeft className="w-3 h-3" strokeWidth={2} />}
      </button>
    </aside>
  );
}