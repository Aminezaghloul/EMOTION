import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, AlertTriangle } from 'lucide-react';
import Dropzone    from './Dropzone';
import Recorder    from './Recorder';
import AudioPlayer from './AudioPlayer';
import Loader      from './Loader';
import ResultCard  from './ResultCard';
import { predictEmotion } from '../api/client';
import { isWavFile }      from '../utils/emotions';
import { useApp }         from '../context/AppContext';

export default function AnalyzeSection() {
  const { t } = useApp();

  // ── State ────────────────────────────────────────────────────────────────
  const [file,     setFile]     = useState(null);   // current audio file
  const [loading,  setLoading]  = useState(false);  // waiting for API response?
  const [progress, setProgress] = useState(0);      // upload progress 0-100
  const [result,   setResult]   = useState(null);   // { class_name, confidence }
  const [error,    setError]    = useState('');     // error message to display

  // ── Handle a new file (from Dropzone or Recorder) ────────────────────────
  const handleFile = (f) => {
    if (!isWavFile(f)) { setError(t('drop_error')); return; }
    setError('');
    setResult(null);
    setFile(f);
  };

  // ── Reset everything ─────────────────────────────────────────────────────
  const reset = () => { setFile(null); setResult(null); setError(''); setProgress(0); };

  // ── Send the file to the FastAPI backend ─────────────────────────────────
  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    setProgress(0);
    try {
      const data = await predictEmotion(file, { onProgress: setProgress });
      setResult(data);
    } catch (e) {
      // Show the error message returned by the API, or a default fallback
      const msg =
        e?.response?.data?.error  ||
        e?.response?.data?.detail ||
        e?.message                ||
        t('error_default');
      setError(msg);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <section id="analyze" className="relative mx-auto max-w-7xl px-6 pb-12">

      {/* ── Section header ── */}
      <div className="mb-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="chip mb-3">
            <Wand2 className="h-3.5 w-3.5 text-cyan-300" />
            {t('analyze_chip')}
          </p>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white text-slate-900 sm:text-4xl">
            {t('analyze_title')}
          </h2>
        </div>
        <p className="max-w-md text-sm dark:text-white/55 text-slate-500">
          {t('analyze_subtitle')}
        </p>
      </div>

      {/* ── Main grid: Dropzone (left) + Recorder (right) ── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Left column: file upload */}
        <div className="lg:col-span-3">
          <Dropzone onFile={handleFile} disabled={loading} currentFile={file} />
          <AudioPlayer file={file} />

          {/* Controls row below the dropzone */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs dark:text-white/45 text-slate-400">
              {file ? t('status_file_loaded') : t('status_no_file')}
            </p>
            <div className="flex gap-2">
              {file && (
                <button
                  type="button"
                  onClick={reset}
                  disabled={loading}
                  className="btn-secondary"
                >
                  {t('btn_clear')}
                </button>
              )}
              <button
                type="button"
                onClick={analyze}
                disabled={!file || loading}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                {t('btn_analyze')}
              </button>
            </div>
          </div>
        </div>

        {/* Right column: microphone recording */}
        <div className="lg:col-span-2">
          <Recorder onRecorded={handleFile} disabled={loading} />
        </div>
      </div>

      {/* ── Result area: Loader / Error / ResultCard ── */}
      <div className="mt-10">
        <AnimatePresence mode="wait">

          {/* Loader while API is processing */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Loader progress={progress} />
            </motion.div>
          )}

          {/* Error card */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong flex items-start gap-4 rounded-3xl border border-red-500/30 p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-500/30">
                <AlertTriangle className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <p className="font-semibold text-red-200">{t('error_title')}</p>
                <p className="mt-1 text-sm dark:text-white/70 text-slate-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Prediction result */}
          {!loading && !error && result && (
            <ResultCard result={result} onReset={reset} />
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
