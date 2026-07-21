import { useEffect } from 'react';
import { useScriptStore } from './store/useScriptStore';
import { Header } from './components/layout/Header';
import { LiveCallView } from './components/live/LiveCallView';
import { BuilderView } from './components/builder/BuilderView';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const loadScripts = useScriptStore((s) => s.loadScripts);
  const mode = useScriptStore((s) => s.mode);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

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
