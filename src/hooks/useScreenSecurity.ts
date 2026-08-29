import { useEffect, useRef, useState } from 'react';
import { apiClient } from '../services/apiClient';

interface UseScreenSecurityOptions {
  enabled?: boolean;
  onViolation?: (type: string) => void;
  preventShortcuts?: boolean;
  preventContextMenu?: boolean;
  blurOnHidden?: boolean;
}

export function useScreenSecurity({
  enabled = true,
  onViolation,
  preventShortcuts = true,
  preventContextMenu = true,
  blurOnHidden = true,
}: UseScreenSecurityOptions = {}) {
  const [isScreenHidden, setIsScreenHidden] = useState(false);
  const lastLogTimeRef = useRef<Record<string, number>>({});

  const logSecurityEvent = async (eventType: 'screen_hidden' | 'tab_changed' | 'context_menu_prevented' | 'copy_attempted') => {
    const now = Date.now();
    const lastTime = lastLogTimeRef.current[eventType] || 0;

    // Throttle duplicate events to at most once every 10 seconds per type
    if (now - lastTime < 10000) {
      return;
    }

    lastLogTimeRef.current[eventType] = now;

    if (onViolation) {
      onViolation(eventType);
    }

    try {
      await apiClient.post('/security/activity-log', {
        event_type: eventType,
        metadata: {
          path: typeof window !== 'undefined' ? window.location.pathname : '',
          timestamp: new Date().toISOString(),
        },
      });
    } catch {
      // Ignore background logging errors
    }
  };

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // 1. Prevent Right Click / Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      if (preventContextMenu) {
        e.preventDefault();
        logSecurityEvent('context_menu_prevented');
      }
    };

    // 2. Prevent Common Copy / Print / Devtools Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!preventShortcuts) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Print: Ctrl+P / Cmd+P
      if (cmdOrCtrl && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        logSecurityEvent('copy_attempted');
      }

      // Save: Ctrl+S / Cmd+S
      if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }

      // PrintScreen key
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        logSecurityEvent('screen_hidden');
      }
    };

    // 3. Visibility Change (Tab Switching or Minimizing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (blurOnHidden) setIsScreenHidden(true);
        logSecurityEvent('screen_hidden');
      } else {
        if (blurOnHidden) setIsScreenHidden(false);
      }
    };

    // 4. Window Blur / Focus
    const handleWindowBlur = () => {
      if (blurOnHidden) setIsScreenHidden(true);
      logSecurityEvent('tab_changed');
    };

    const handleWindowFocus = () => {
      if (blurOnHidden) setIsScreenHidden(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [enabled, preventShortcuts, preventContextMenu, blurOnHidden]);

  return {
    isScreenHidden,
  };
}
