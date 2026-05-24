import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function AudioPlayer({ file }) {
  const audioRef = useRef(null);
  const [url,      setUrl]      = useState('');
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);     // 0–100
  const [duration, setDuration] = useState(0);     // total seconds
  const [current,  setCurrent]  = useState(0);     // current second

  // Create an object URL whenever the file changes, revoke the old one on cleanup
  useEffect(() => {
    if (!file) { setUrl(''); return; }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    setPlaying(false);
    setProgress(0);
    setCurrent(0);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !url) return null;

  // Toggle play / pause
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else          { a.pause(); setPlaying(false); }
  };

  // Restart from the beginning
  const restart = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play();
    setPlaying(true);
  };

  // Format seconds as M:SS
  const fmt = (s) => {
    if (!Number.isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  return (
    <div className="glass mt-4 flex items-center gap-4 rounded-2xl px-5 py-4">
      {/* Hidden <audio> element — all playback is controlled through the ref */}
      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setCurrent(t);
          setProgress(duration ? (t / duration) * 100 : 0);
        }}
        onEnded={() => { setPlaying(false); setProgress(100); }}
      />

      {/* Play / Pause button */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                   bg-gradient-to-br from-violet-500 to-cyan-400 text-white
                   shadow-[0_10px_30px_-10px_rgba(124,58,237,0.6)] transition hover:scale-105"
      >
        {playing
          ? <Pause className="h-5 w-5" />
          : <Play  className="ml-0.5 h-5 w-5" />
        }
      </button>

      {/* Progress bar + timestamps */}
      <div className="flex-1">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full dark:bg-white/10 bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-medium dark:text-white/50 text-slate-400">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Restart button */}
      <button
        type="button"
        onClick={restart}
        aria-label="Restart"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition
                   dark:border-white/10 border-slate-200 dark:text-white/70 text-slate-500
                   dark:hover:border-white/25 hover:border-slate-400 dark:hover:text-white hover:text-slate-900"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
