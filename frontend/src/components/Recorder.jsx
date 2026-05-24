/**
 * Recorder — live microphone recording panel.
 * Records → converts to 16kHz mono WAV → calls onRecorded(file).
 * The parent (AnalyzeSection) then handles the file just like an upload.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2 } from 'lucide-react';
import { WavRecorder } from '../utils/wavRecorder';
import { useApp } from '../context/AppContext';

// Number of bars in the waveform visualiser
const BAR_COUNT = 20;

export default function Recorder({ onRecorded, disabled }) {
  const { t } = useApp();

  // Three possible states: idle → recording → back to idle
  const [recording,  setRecording]  = useState(false);
  const [preparing,  setPreparing]  = useState(false); // waiting for mic permission
  const [level,      setLevel]      = useState(0);     // microphone volume 0..1
  const [seconds,    setSeconds]    = useState(0);     // elapsed time in seconds
  const [error,      setError]      = useState('');

  // We keep the WavRecorder instance in a ref so it persists between renders
  const recorderRef = useRef(null);

  // Elapsed time counter — only runs while recording
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  // ── Start recording ──────────────────────────────────────────────────────
  const handleStart = async () => {
    setError('');
    setSeconds(0);
    setPreparing(true);
    try {
      const rec = new WavRecorder({ sampleRate: 16000 });
      await rec.start({ onLevel: setLevel });
      recorderRef.current = rec;
      setRecording(true);
    } catch (e) {
      if (e?.name === 'NotAllowedError') setError(t('rec_denied'));
      else setError(t('rec_error'));
    } finally {
      setPreparing(false);
    }
  };

  // ── Stop recording ────────────────────────────────────────────────────────
  const handleStop = async () => {
    const rec = recorderRef.current;
    if (!rec) return;
    setRecording(false);
    setLevel(0);
    try {
      const result = await rec.stop();
      if (result?.blob) {
        // Create a File object (same shape as a file-input upload)
        const file = new File([result.blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        onRecorded(file);
      }
    } catch {
      setError(t('rec_fail'));
    } finally {
      recorderRef.current = null;
    }
  };

  // Format seconds as MM:SS
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="glass-strong relative flex h-full flex-col items-center justify-between gap-6 rounded-3xl p-6 sm:p-8">

      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] dark:text-white/40 text-slate-500">
          {t('rec_chip')}
        </p>
        <h3 className="mt-2 text-xl font-bold dark:text-white text-slate-800">
          {t('rec_title')}
        </h3>
        <p className="mt-1 text-sm dark:text-white/55 text-slate-500">
          {t('rec_subtitle')}
        </p>
      </div>

      {/* Waveform visualiser */}
      <div className="relative flex h-28 w-full items-center justify-center">
        <div className="flex items-center gap-1">
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            // Bars near the center are taller; randomness adds life during recording
            const dist   = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
            const base   = 6 + (1 - dist) * 6;
            const dynamic = recording ? level * (1 - dist) * 60 + Math.random() * 8 : 0;
            return (
              <span
                key={i}
                className="block w-1.5 rounded-full bg-gradient-to-b from-fuchsia-400 via-violet-400 to-cyan-400 transition-[height] duration-100"
                style={{ height: `${base + dynamic}px`, opacity: recording ? 1 : 0.3 }}
              />
            );
          })}
        </div>

        {/* REC badge with pulsing dot — only shown while recording */}
        <AnimatePresence>
          {recording && (
            <motion.div
              key="rec-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-2 top-2 flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300"
            >
              {/* Pulsing dot */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              REC {mm}:{ss}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action button + privacy note */}
      <div className="flex flex-col items-center gap-3">
        {!recording ? (
          // ── Start button ──
          <motion.button
            type="button"
            onClick={handleStart}
            disabled={disabled || preparing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {preparing
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : <Mic     className="h-5 w-5" />
            }
            {preparing ? t('rec_preparing') : t('rec_start')}
          </motion.button>
        ) : (
          // ── Stop button ──
          <motion.button
            type="button"
            onClick={handleStop}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/90
                       px-6 py-3 font-semibold text-white transition hover:bg-red-500
                       shadow-[0_10px_30px_-10px_rgba(239,68,68,0.6)]"
          >
            <Square className="h-4 w-4 fill-white" />
            {t('rec_stop')}
          </motion.button>
        )}

        <p className="text-center text-xs dark:text-white/40 text-slate-400">
          {t('rec_privacy')}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
