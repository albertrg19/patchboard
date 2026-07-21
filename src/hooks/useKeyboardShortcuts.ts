import { useEffect } from 'react';

export function useKeyboardShortcuts(
  onSelectResponse: (index: number) => void,
  onRestart: () => void,
  responseCount: number,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Number keys 1-9 to select responses
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9 && num <= responseCount) {
        e.preventDefault();
        onSelectResponse(num - 1);
        return;
      }

      // Escape to restart
      if (e.key === 'Escape') {
        e.preventDefault();
        onRestart();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectResponse, onRestart, responseCount, enabled]);
}
