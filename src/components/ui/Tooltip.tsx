import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InfoTooltipProps {
  label: string;
  tooltip: string;
  className?: string;
}

/**
 * Renders a label followed by a small HelpCircle icon.
 * Hovering the icon shows a tooltip with a plain-language explanation.
 */
export function InfoTooltip({ label, tooltip, className }: InfoTooltipProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {label}
      <TooltipPrimitive.Provider delayDuration={200}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              <HelpCircle className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="top"
              align="center"
              sideOffset={6}
              className={cn(
                'z-50 max-w-xs px-3 py-2 rounded-lg',
                'bg-slate-900 text-white text-[11px] leading-relaxed',
                'shadow-lg border border-slate-700',
                'animate-fade-in'
              )}
            >
              {tooltip}
              <TooltipPrimitive.Arrow className="fill-slate-900" width={10} height={5} />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    </span>
  );
}
