import { useEffect } from 'react';

export function useKioskLock() {
  useEffect(() => {
    // 1. Prevent accidentally closing tab
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Legacy Chrome
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 2. Trap Back Button (Push state so back button stays on page)
    // We strictly want to prevent leaving the domain via back button history
    // First, push a state so we have something to pop
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
        // When back is pressed, just push the state again to stay here
        window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
}
