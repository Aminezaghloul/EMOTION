/**
 * WavRecorder — records microphone audio and exports a .wav file.
 *
 * WHY a custom encoder?
 *   The browser's built-in MediaRecorder produces .webm or .ogg files.
 *   Our backend only accepts .wav, so we capture raw PCM samples and
 *   build the WAV file ourselves.
 *
 * HOW it works:
 *   1. Ask the browser for microphone access (getUserMedia).
 *   2. Feed audio samples through Web Audio API's ScriptProcessorNode.
 *   3. On stop: merge all samples → downsample to 16kHz → write WAV header + data.
 *   4. Return a Blob of type "audio/wav".
 *
 * Usage:
 *   const rec = new WavRecorder();
 *   await rec.start({ onLevel: (v) => setLevel(v) });  // v is 0..1
 *   const { blob } = await rec.stop();
 *   const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
 */
export class WavRecorder {
  constructor({ sampleRate = 16000 } = {}) {
    this.targetSampleRate = sampleRate; // output sample rate (what the model expects)
    this.recording = false;
    this.chunks = [];       // raw Float32 audio buffers collected during recording
    this.onLevel = null;    // callback for visualising the microphone level

    // These are set when recording starts
    this.audioContext = null;
    this.sourceNode   = null;
    this.processor    = null;
    this.stream       = null;
  }

  // ── Start recording ────────────────────────────────────────────────────────
  async start({ onLevel } = {}) {
    if (this.recording) return;
    this.onLevel = onLevel ?? null;

    // Request microphone access
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.audioContext     = new AudioCtx();
    this.sourceSampleRate = this.audioContext.sampleRate; // usually 44100 or 48000
    this.sourceNode       = this.audioContext.createMediaStreamSource(this.stream);

    // ScriptProcessorNode delivers raw audio samples every 4096 frames
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.chunks    = [];

    this.processor.onaudioprocess = (e) => {
      if (!this.recording) return;
      const samples = e.inputBuffer.getChannelData(0);
      this.chunks.push(new Float32Array(samples)); // save a copy

      // Compute RMS level (0..1) and send to the UI for the waveform animation
      if (this.onLevel) {
        let sum = 0;
        for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
        this.onLevel(Math.min(1, Math.sqrt(sum / samples.length) * 4));
      }
    };

    this.sourceNode.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
    this.recording = true;
  }

  // ── Stop recording and return the WAV blob ─────────────────────────────────
  async stop() {
    if (!this.recording) return null;
    this.recording = false;

    // Disconnect audio nodes and stop the microphone stream
    try { this.processor?.disconnect(); this.sourceNode?.disconnect(); } catch {}
    this.stream?.getTracks().forEach((t) => t.stop());

    // Build the WAV file from the collected chunks
    const merged      = _mergeBuffers(this.chunks);
    const downsampled = _downsample(merged, this.sourceSampleRate, this.targetSampleRate);
    const wavBlob     = _encodeWav(downsampled, this.targetSampleRate);

    // Clean up the AudioContext
    try { await this.audioContext?.close(); } catch {}
    this.audioContext = null;
    this.sourceNode   = null;
    this.processor    = null;
    this.stream       = null;
    this.chunks       = [];

    return { blob: wavBlob };
  }
}

// ── Helper functions (private, not exported) ───────────────────────────────────

// Concatenate all Float32Array chunks into one long array
function _mergeBuffers(chunks) {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out   = new Float32Array(total);
  let offset  = 0;
  for (const c of chunks) { out.set(c, offset); offset += c.length; }
  return out;
}

// Reduce sample rate by averaging consecutive samples
function _downsample(buffer, fromRate, toRate) {
  if (toRate >= fromRate) return buffer;
  const ratio     = fromRate / toRate;
  const newLength = Math.round(buffer.length / ratio);
  const result    = new Float32Array(newLength);
  let rIdx = 0, bIdx = 0;
  while (rIdx < newLength) {
    const next = Math.round((rIdx + 1) * ratio);
    let sum = 0, count = 0;
    for (let i = bIdx; i < next && i < buffer.length; i++) { sum += buffer[i]; count++; }
    result[rIdx++] = count > 0 ? sum / count : 0;
    bIdx = next;
  }
  return result;
}

// Write a standard WAV file header followed by 16-bit PCM audio data
function _encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view   = new DataView(buffer);

  // RIFF chunk descriptor
  _writeStr(view, 0,  'RIFF');
  view.setUint32(4,  36 + samples.length * 2, true);
  _writeStr(view, 8,  'WAVE');
  // fmt sub-chunk
  _writeStr(view, 12, 'fmt ');
  view.setUint32(16, 16, true);           // sub-chunk size
  view.setUint16(20,  1, true);           // PCM format
  view.setUint16(22,  1, true);           // mono
  view.setUint32(24, sampleRate,      true);
  view.setUint32(28, sampleRate * 2,  true); // byte rate
  view.setUint16(32,  2, true);           // block align
  view.setUint16(34, 16, true);           // bits per sample
  // data sub-chunk
  _writeStr(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Convert Float32 (-1..1) → Int16 (-32768..32767)
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function _writeStr(view, offset, str) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
