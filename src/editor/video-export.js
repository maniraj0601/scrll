const VIDEO_TYPES = [
  // Canvas encoders may update H.264 parameter sets; avc3 permits this without aborting MP4 recording.
  ['video/mp4;codecs=avc3.420034,mp4a.40.2', 'mp4', 'MP4'],
  ['video/mp4;codecs=avc1.420034,mp4a.40.2', 'mp4', 'MP4'],
  ['video/mp4', 'mp4', 'MP4'],
  ['video/webm;codecs=vp8,opus', 'webm', 'WebM'],
  ['video/webm;codecs=vp9,opus', 'webm', 'WebM'],
  ['video/webm', 'webm', 'WebM'],
];

const videoFormats = (scope = globalThis) =>
  !scope.MediaRecorder || !scope.HTMLCanvasElement?.prototype.captureStream ? [] :
    VIDEO_TYPES.filter(([mime]) => scope.MediaRecorder.isTypeSupported(mime))
      .map(([mime, extension, label]) => ({ mime, extension, label }));

export const videoFormat = (scope = globalThis) => videoFormats(scope)[0] || null;

const encodingError = cause => Object.assign(
  new Error('The video encoder could not record at the selected size.', { cause }),
  { name: 'VideoEncodingError' },
);

export function videoLayers(doc, index, media) {
  const left = index * doc.W;
  return doc.els.filter(e => {
    if (e.type !== 'img' || media.get(e.k)?.type !== 'video' || e.o === 0) return false;
    const a = (e.r || 0) * Math.PI / 180;
    const w = Math.abs(Math.cos(a)) * e.w + Math.abs(Math.sin(a)) * e.h;
    const h = Math.abs(Math.sin(a)) * e.w + Math.abs(Math.cos(a)) * e.h;
    const x = e.x + e.w / 2, y = e.y + e.h / 2;
    return x + w / 2 > left && x - w / 2 < left + doc.W && y + h / 2 > 0 && y - h / 2 < doc.H;
  });
}

export const videoSpeed = e => Number.isFinite(e.speed) ? Math.min(4, Math.max(.25, e.speed)) : 1;

export function videoRange(e, media) {
  const duration = media.duration;
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('A video has no valid duration. Replace it with a playable MP4 or MOV.');
  const start = Math.max(0, Math.min(duration, Number.isFinite(e.vs) ? e.vs : 0));
  const end = Math.max(start, Math.min(duration, Number.isFinite(e.ve) ? e.ve : duration));
  if (end <= start) throw new Error('A video has an empty trim range. Adjust its start and end.');
  return { start, end, duration: end - start };
}

function mediaEvent(video, event, signal, action) {
  return new Promise((resolve, reject) => {
    const clean = () => {
      clearTimeout(timer);
      video.removeEventListener(event, done);
      video.removeEventListener('error', fail);
      signal.removeEventListener('abort', abort);
    };
    const done = () => { clean(); resolve(); };
    const fail = () => { clean(); reject(new Error('A video could not be decoded for export. Try an MP4 or MOV.')); };
    const abort = () => { clean(); reject(signal.reason); };
    const timer = setTimeout(fail, 15000);
    video.addEventListener(event, done, { once: true });
    video.addEventListener('error', fail, { once: true });
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    else { try { action(); } catch (error) { clean(); reject(error); } }
  });
}

export function webmHeaderEnd(bytes) {
  const element = at => {
    const read = (offset, id) => {
      const first = bytes[offset];
      if (!first) return null;
      let mask = 128, width = 1;
      while (!(first & mask) && width < 8) { mask >>= 1; width++; }
      if (offset + width > bytes.length) return null;
      let value = id ? first : first & (mask - 1), unknown = !id && value === mask - 1;
      for (let n = 1; n < width; n++) { value = value * 256 + bytes[offset + n]; unknown = unknown && bytes[offset + n] === 255; }
      return { value, width, unknown };
    };
    const id = read(at, true);
    if (!id) return null;
    const size = read(at + id.width, false);
    return size && { id: id.value, size: size.value, unknown: size.unknown, data: at + id.width + size.width };
  };
  let at = 0, segment = false;
  while (at < bytes.length) {
    const e = element(at);
    if (!e) break;
    if (e.id === 0x18538067 && e.unknown) { segment = true; at = e.data; continue; }
    if (segment && e.id === 0x1f43b675) return at;
    if (e.unknown || !Number.isSafeInteger(e.size)) break;
    at = e.data + e.size;
  }
  return null;
}

// Separate media elements keep export timing and audio independent of editor/preview playback.
export async function recordSlide(options) {
  const formats = videoFormats(), preferred = options.format;
  const attempts = preferred ? [preferred, ...formats.filter(f => f.mime !== preferred.mime)] : formats;
  if (!attempts.length) throw new Error('This browser cannot export video. Use a current Chrome, Edge or Safari.');
  for (let i = 0; i < attempts.length; i++) {
    options.signal.throwIfAborted();
    const format = attempts[i], recovery = format.extension !== 'mp4';
    if (i) options.onRetry?.({ ...format, label: recovery ? 'MP4 recovery' : 'MP4' });
    let blob;
    try {
      blob = await recordAttempt({
        ...options, format,
        onProgress: p => options.onProgress?.(p * (recovery ? .85 : 1)),
      });
    }
    catch (error) {
      options.signal.throwIfAborted();
      if (error?.name !== 'VideoEncodingError') throw error;
      if (i === attempts.length - 1) {
        throw new Error(`All available video encoders failed at ${options.canvas.width} × ${options.canvas.height}. Choose a smaller export size or try another browser.`, { cause: error });
      }
      continue;
    }
    // WebM is only an intermediate recording, never the downloaded format.
    return recovery ? toMp4(blob, options) : blob;
  }
}

// Chromium's WebCodecs implementation very commonly ships H.264 *video* encoding but not AAC
// *audio* encoding (this is a known, well-documented gap, especially on Chrome/Linux) — mediabunny
// would otherwise silently discard the audio track and report the conversion as invalid, which is
// exactly the "MP4 export could not finish" failure this was throwing for videos with audio.
// @mediabunny/aac-encoder is a ~260KB WASM AAC-LC encoder built for precisely this gap; it's only
// loaded (and the capability probe only run) the first time it's actually needed in a session.
let aacFallbackReady = null;
async function ensureAacEncoder(canEncodeAudio) {
  if (!aacFallbackReady) {
    aacFallbackReady = canEncodeAudio('aac').then(async native => {
      if (native) return;
      const { registerAacEncoder } = await import('@mediabunny/aac-encoder');
      registerAacEncoder();
    });
  }
  return aacFallbackReady;
}

// H.264 has hard, level-based limits on how many macroblocks it can encode per frame (e.g. level
// 5.1 tops out around 3840x2160) and devices frequently support less than the spec's ceiling. A
// "Maximum" export at something like 3072x3840 can exceed every level a given browser/GPU
// implements, which made the H.264 re-encode fail outright even though the WebM recording itself
// succeeded. Step the resolution down until the device reports it can actually encode it, instead
// of failing — downscaling only ever kicks in on devices that truly can't do the requested size.
const VIDEO_SCALE_LADDER = [1, 0.75, 0.5, 0.375, 0.25, 0.1875, 0.125];
async function resolveVideoSize(canEncodeVideo, width, height) {
  for (const scale of VIDEO_SCALE_LADDER) {
    const w = Math.max(2, Math.round(width * scale / 2) * 2);
    const h = Math.max(2, Math.round(height * scale / 2) * 2);
    if (await canEncodeVideo('avc', { width: w, height: h })) return { width: w, height: h };
  }
  return null;
}

async function toMp4(blob, { signal, onFinalize = () => {}, onResize = () => {} }) {
  signal.throwIfAborted();
  onFinalize();
  const { Input, BlobSource, WEBM, Output, Mp4OutputFormat, BufferTarget, Conversion, canEncodeAudio, canEncodeVideo } = await import('mediabunny');
  signal.throwIfAborted();
  await ensureAacEncoder(canEncodeAudio);
  signal.throwIfAborted();
  const input = new Input({ source: new BlobSource(blob), formats: [WEBM] });
  const output = new Output({ format: new Mp4OutputFormat({ fastStart: 'in-memory' }), target: new BufferTarget() });
  let conversion;
  const abort = () => { void conversion?.cancel().catch(() => {}); };
  signal.addEventListener('abort', abort, { once: true });
  try {
    const videoTrack = await input.getPrimaryVideoTrack();
    signal.throwIfAborted();
    const video = { codec: 'avc' };
    if (videoTrack) {
      const size = await resolveVideoSize(canEncodeVideo, videoTrack.displayWidth, videoTrack.displayHeight);
      signal.throwIfAborted();
      if (!size) throw new Error('H.264 video encoding is unavailable on this device.');
      if (size.width !== videoTrack.displayWidth || size.height !== videoTrack.displayHeight) {
        Object.assign(video, size, { fit: 'fill' });
        onResize(size.width, size.height);
      }
    }
    conversion = await Conversion.init({
      input, output, video, audio: { codec: 'aac' }, showWarnings: false,
    });
    signal.throwIfAborted();
    // Never "succeed" after silently dropping audio or video unsupported by the device.
    if (!conversion.isValid || conversion.discardedTracks.length) {
      const dropped = conversion.discardedTracks.map(t => `${t.track.type} (${t.reason})`).join(', ');
      throw new Error(dropped ? `Could not encode: ${dropped}` : 'H.264 video or AAC audio encoding is unavailable.');
    }
    conversion.onProgress = p => onFinalize(p);
    await conversion.execute();
    signal.throwIfAborted();
    return new Blob([output.target.buffer], { type: 'video/mp4' });
  } catch (error) {
    signal.throwIfAborted();
    throw new Error(`MP4 export could not finish on this device (${error?.message || 'unknown reason'}). Try a smaller export size or a current Chrome, Edge or Safari. No WebM file was downloaded.`, { cause: error });
  } finally {
    signal.removeEventListener('abort', abort);
    if (output.state !== 'finalized') await output.cancel().catch(() => {});
    input.dispose();
  }
}

async function recordAttempt({ layers, media, canvas, render, format, audio, signal, onProgress = () => {} }) {
  const sources = new Map(), clips = [], nodes = [], chunks = [];
  let stream, recorder, timer, destination, silence, durationMs = 0;
  try {
    if (!format) throw new Error('This browser cannot export video. Use a current Chrome, Edge or Safari.');
    if (!audio) throw new Error('Audio export is unavailable in this browser.');
    await audio.resume();
    if (audio.state !== 'running') throw new Error('Allow audio playback and try exporting again.');
    destination = audio.createMediaStreamDestination();
    silence = audio.createConstantSource();
    silence.offset.value = 0;
    silence.connect(destination);
    silence.start();
    const audible = Math.max(1, layers.filter(e => !e.mute).length);
    for (const e of layers) {
      signal.throwIfAborted();
      const m = media.get(e.k), range = videoRange(e, m), video = document.createElement('video');
      video.preload = 'auto';
      video.playsInline = true;
      video.playbackRate = videoSpeed(e);
      video.preservesPitch = true;
      clips.push({ video, restarting: false, ...range });
      await mediaEvent(video, 'loadeddata', signal, () => { video.src = m.url; video.load(); });
      video.playbackRate = videoSpeed(e);
      if (range.start > 0) await mediaEvent(video, 'seeked', signal, () => { video.currentTime = range.start; });
      const node = audio.createMediaElementSource(video);
      const gain = audio.createGain();
      gain.gain.value = e.mute ? 0 : 1 / audible;
      node.connect(gain);
      gain.connect(destination);
      nodes.push(node, gain);
      sources.set(e.id, video);
    }
    const duration = clips.length ? Math.max(...clips.map(c => c.duration / c.video.playbackRate)) : 5;
    render(sources);
    stream = canvas.captureStream(30);
    for (const track of destination.stream.getAudioTracks()) stream.addTrack(track);
    const bitrate = Math.min(40_000_000, Math.max(8_000_000, canvas.width * canvas.height * 6));
    try { recorder = new MediaRecorder(stream, { mimeType: format.mime, videoBitsPerSecond: bitrate, audioBitsPerSecond: 192000 }); }
    catch (error) { throw encodingError(error); }
    await new Promise((resolve, reject) => {
      let start, settled = false;
      const fail = error => { if (settled) return; settled = true; clean(); clearTimeout(timer); reject(error); };
      const abort = () => fail(signal.reason);
      const visibility = () => { if (document.hidden) fail(new Error('Keep this tab visible while exporting video, then try again.')); };
      const clean = () => {
        signal.removeEventListener('abort', abort);
        document.removeEventListener('visibilitychange', visibility);
      };
      signal.addEventListener('abort', abort, { once: true });
      document.addEventListener('visibilitychange', visibility);
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = event => fail(encodingError(event.error));
      recorder.onstop = () => {
        if (settled) return;
        if (performance.now() - start < duration * 1000 - 100) { fail(encodingError()); return; }
        settled = true; durationMs = performance.now() - start; clean(); resolve();
      };
      const frame = () => {
        try {
          if (settled) return;
          signal.throwIfAborted();
          const elapsed = (performance.now() - start) / 1000;
          if (elapsed >= duration) { recorder.stop(); return; }
          // Restarting a looping clip means seeking it, which can take a while on a large/4K
          // source — run it in the background instead of awaiting it here. Blocking this tick
          // would freeze the ENTIRE canvas (every layer, not just the looping clip) until the
          // seek resolves, which is what produced the severe stutter/freezes in longer exports.
          for (const clip of clips) {
            if (!clip.restarting && (clip.video.currentTime >= clip.end - .015 || clip.video.ended)) {
              clip.restarting = true;
              mediaEvent(clip.video, 'seeked', signal, () => { clip.video.currentTime = clip.start; })
                .then(() => clip.video.play())
                .catch(error => { if (signal.aborted) return; fail(error); })
                .finally(() => { clip.restarting = false; });
            }
          }
          render(sources);
          onProgress(Math.min(1, elapsed / duration));
          timer = setTimeout(frame, 1000 / 30);
        } catch (error) { clean(); fail(error); }
      };
      if (signal.aborted || document.hidden) { clean(); fail(signal.reason || new Error('Keep this tab visible while exporting video.')); return; }
      Promise.all(clips.map(c => c.video.play())).then(() => {
        if (settled) return;
        if (signal.aborted) { clean(); fail(signal.reason); return; }
        try { recorder.start(1000); } catch (error) { fail(encodingError(error)); return; }
        start = performance.now();
        frame();
      }).catch(error => { clean(); fail(error); });
    });
    if (!chunks.length) throw encodingError();
    const blob = new Blob(chunks, { type: recorder.mimeType || format.mime });
    if (format.extension === 'webm') {
      const { fixWebmDuration } = await import('@fix-webm-duration/fix');
      // Repair only metadata: reserializing unknown-sized clusters can nest later clusters.
      const headerEnd = webmHeaderEnd(new Uint8Array(await blob.slice(0, 1024 * 1024).arrayBuffer()));
      const header = headerEnd === null ? blob : blob.slice(0, headerEnd, blob.type);
      const fixed = await fixWebmDuration(header, durationMs, { logger: false });
      signal.throwIfAborted();
      return headerEnd === null ? fixed : new Blob([fixed, blob.slice(headerEnd)], { type: blob.type });
    }
    return blob;
  } finally {
    clearTimeout(timer);
    if (recorder?.state === 'recording') recorder.stop();
    stream?.getTracks().forEach(track => track.stop());
    destination?.stream.getTracks().forEach(track => track.stop());
    silence?.stop();
    silence?.disconnect();
    nodes.forEach(node => node.disconnect());
    clips.forEach(({ video }) => { video.pause(); video.removeAttribute('src'); video.load(); });
  }
}
