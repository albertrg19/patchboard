import { useEffect } from 'react';
import { useScriptStore } from './store/useScriptStore';
import { Header } from './components/layout/Header';
import { LiveCallView } from './components/live/LiveCallView';
import { BuilderView } from './components/builder/BuilderView';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const loadScripts = useScriptStore((s) => s.loadScripts);
  const mode = useScriptStore((s) => s.mode);
  const isLoading = useScriptStore((s) => s.isLoading);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0f1114] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-[#00f0ff]"></div>
          <p className="font-mono text-sm text-slate-400 tracking-wider">CONNECTING TO DATABASE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <AnimatePresence mode="wait">
          {mode === 'live' ? (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="app__view"
            >
              <LiveCallView />
            </motion.div>
          ) : (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="app__view"
            >
              <BuilderView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
