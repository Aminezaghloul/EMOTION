import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileAudio2 } from 'lucide-react';
import { isWavFile, formatBytes } from '../utils/emotions';
import { useApp } from '../context/AppContext';

export default function Dropzone({ onFile, disabled, currentFile }) {
  const { t } = useApp();
  const [hover, setHover] = useState(false);  // dragging a file over the zone?
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Maximum allowed file size: 5 MB (in bytes)
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 × 1024 × 1024 = 5 242 880 bytes

  // Validate the file and pass it up to the parent if it passes all checks
  const handleFiles = useCallback((files) => {
    setError('');
    const file = files?.[0];
    if (!file) return;

    // Check 1: must be a .wav file
    if (!isWavFile(file)) {
      setError(t('drop_error'));
      return;
    }

    // Check 2: must not exceed 5 MB
    if (file.size > MAX_SIZE_BYTES) {
      setError(t('drop_size_error'));
      return;
    }

    onFile(file);
  }, [onFile, t]);

  // Drag & drop handlers
  const onDrop = (e) => {
    e.preventDefault();
    setHover(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
    >
      {/* ── Drop zone button ── */}
      <motion.button
        type="button"
        onClick={() => !disabled && inputRef.current?.click()}
        whileHover={{ scale: disabled ? 1 : 1.005 }}
        whileTap={  { scale: disabled ? 1 : 0.995 }}
        className={[
          'group relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-dashed px-8 py-14 text-center transition-all',
          hover
            ? 'border-fuchsia-400/60 bg-fuchsia-400/5'
            : 'dark:border-white/15 border-slate-300 dark:bg-white/[0.03] bg-white/60 dark:hover:border-white/25 hover:border-slate-400',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        ].join(' ')}
      >
        {/* Radial glow on hover */}
        <div
          className={['absolute inset-0 -z-10 opacity-0 transition-opacity duration-500',
            hover ? 'opacity-100' : 'group-hover:opacity-60'].join(' ')}
          style={{
            background: 'radial-gradient(40% 60% at 50% 0%, rgba(168,85,247,0.18), transparent 70%), radial-gradient(50% 50% at 50% 100%, rgba(34,211,238,0.14), transparent 70%)',
          }}
        />

        {/* Upload icon with glow */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/40 to-cyan-400/40 blur-xl" />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl dark:bg-ink-900/80 bg-white/80 ring-1 dark:ring-white/10 ring-slate-200">
            <UploadCloud className="h-7 w-7 dark:text-white text-slate-700" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-lg font-semibold dark:text-white text-slate-800">
            {t('drop_title')}{' '}
            <span className="gradient-text font-bold">{t('drop_ext')}</span>{' '}
            {t('drop_hint')}
          </p>
          <p className="text-sm dark:text-white/55 text-slate-500">
            max 5 MB
          </p>
        </div>

        {/* Format chip */}
        <span className="chip">
          <FileAudio2 className="h-3.5 w-3.5" />
          {t('drop_format')}
        </span>

        {/* Hidden file input — restricted to .wav */}
        <input
          ref={inputRef}
          type="file"
          accept=".wav,audio/wav,audio/x-wav,audio/wave"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </motion.button>

      {/* ── Selected file preview ── */}
      {currentFile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mt-4 flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
              <FileAudio2 className="h-5 w-5 text-white" />
            </div>
            <div className="truncate">
              <p className="truncate text-sm font-semibold dark:text-white text-slate-800">
                {currentFile.name}
              </p>
              <p className="text-xs dark:text-white/50 text-slate-500">
                {formatBytes(currentFile.size)} · {t('drop_ready')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Validation error ── */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
