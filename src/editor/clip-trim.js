export function trimValue(value, key, start, end, duration) {
  const gap = Math.min(.1, duration);
  const number = Number(value);
  if (!Number.isFinite(number)) return key === 'vs' ? start : end;
  return key === 'vs'
    ? Math.max(0, Math.min(end - gap, number))
    : Math.min(duration, Math.max(start + gap, number));
}

export function trimMarkup(duration, label) {
  return `<section class="video-trim" aria-label="Video clip range">
    <div class="video-trim__head"><div><b>Trim clip</b><span>${label(duration)} source</span></div><button type="button" class="video-trim__reset" data-trim-reset>Reset</button></div>
    <div class="video-trim__timeline">
      <div class="video-trim__track"><div class="video-trim__selected"></div>
        <button type="button" class="video-trim__handle" data-trim-handle="vs" role="slider" aria-label="Clip start" aria-orientation="horizontal"><i></i></button>
        <button type="button" class="video-trim__handle" data-trim-handle="ve" role="slider" aria-label="Clip end" aria-orientation="horizontal"><i></i></button>
      </div>
    </div>
    <div class="video-trim__ruler" aria-hidden="true"><span>0:00</span><span>${label(duration/2)}</span><span>${label(duration)}</span></div>
    <div class="video-trim__times">
      <label><span>Start <small>sec</small></span><input type="number" data-k="vs" min="0" max="${duration}" step="0.1" inputmode="decimal" aria-label="Clip start in seconds"></label>
      <div class="video-trim__duration"><output data-trim="duration"></output><span>Selected</span></div>
      <label><span>End <small>sec</small></span><input type="number" data-k="ve" min="0" max="${duration}" step="0.1" inputmode="decimal" aria-label="Clip end in seconds"></label>
    </div>
    <label class="video-trim__speed"><span>Playback speed</span><select data-k="speed" aria-label="Video playback speed">${[.25,.5,.75,1,1.25,1.5,2,3,4].map(rate=>`<option value="${rate}">${rate}×${rate===1?' · Normal':''}</option>`).join('')}</select></label>
  </section>`;
}

export function syncTrim(root, start, end, duration, label, speed = 1) {
  const trim = root.querySelector('.video-trim');
  if (!trim) return;
  trim.style.setProperty('--trim-start', `${start / duration * 100}%`);
  trim.style.setProperty('--trim-end', `${end / duration * 100}%`);
  trim.querySelector('[data-trim="duration"]').textContent = label((end - start) / speed);
  trim.querySelector('[data-trim-reset]').disabled = start === 0 && end === duration;
  trim.querySelectorAll('[data-trim-handle]').forEach(handle => {
    const first = handle.dataset.trimHandle === 'vs';
    handle.setAttribute('aria-valuemin', String(first ? 0 : start + Math.min(.1, duration)));
    handle.setAttribute('aria-valuemax', String(first ? end - Math.min(.1, duration) : duration));
    handle.setAttribute('aria-valuenow', String(first ? start : end));
    handle.setAttribute('aria-valuetext', label(first ? start : end));
  });
  trim.querySelectorAll('input[data-k]').forEach(input => {
    const first = input.dataset.k === 'vs';
    input.min = String(first ? 0 : start + Math.min(.1, duration));
    input.max = String(first ? end - Math.min(.1, duration) : duration);
    if (input !== document.activeElement) input.value = String(Math.round((first ? start : end) * 1000) / 1000);
  });
}

export function bindTrim(root, { listen, getRange, onInput, onCommit }) {
  let drag = null;
  const apply = (key, value) => {
    const range = getRange();
    if (!range) return;
    const next = trimValue(value, key, range.start, range.end, range.duration);
    if (next === (key === 'vs' ? range.start : range.end)) return false;
    onInput(key, next);
    return true;
  };
  listen(root, 'pointerdown', event => {
    const handle = event.target.closest('[data-trim-handle]');
    if (!handle || event.button !== 0 || !getRange()) return;
    drag = { handle, key: handle.dataset.trimHandle, pointer: event.pointerId, changed: false };
    handle.setPointerCapture(event.pointerId);
    handle.focus({ preventScroll: true });
    event.preventDefault();
    event.stopPropagation();
  });
  listen(root, 'pointermove', event => {
    if (!drag || drag.pointer !== event.pointerId) return;
    const range = getRange();
    if (!range || !drag.handle.isConnected) { drag = null; return; }
    const rect = drag.handle.closest('.video-trim__track').getBoundingClientRect();
    if (!rect.width) return;
    const value = Math.round((event.clientX - rect.left) / rect.width * range.duration * 10) / 10;
    drag.changed = apply(drag.key, value) || drag.changed;
  });
  const end = event => {
    if (!drag || drag.pointer !== event.pointerId) return;
    const changed = drag.changed;
    drag = null;
    if (changed) onCommit();
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => listen(root, type, end));
  listen(root, 'keydown', event => {
    const handle = event.target.closest('[data-trim-handle]'), range = getRange();
    if (!handle || !range) return;
    const key = handle.dataset.trimHandle, value = key === 'vs' ? range.start : range.end;
    const step = event.shiftKey ? 1 : .1;
    const next = {
      ArrowLeft: value - step, ArrowDown: value - step,
      ArrowRight: value + step, ArrowUp: value + step,
      Home: key === 'vs' ? 0 : range.start + Math.min(.1, range.duration),
      End: key === 'vs' ? range.end - Math.min(.1, range.duration) : range.duration,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    if (apply(key, next)) onCommit();
  });
  listen(root, 'click', event => {
    if (!event.target.closest('[data-trim-reset]')) return;
    const range = getRange();
    if (!range) return;
    onInput('vs', 0);
    onInput('ve', range.duration);
    onCommit();
  });
  listen(root, 'focusout', event => {
    const input = event.target.closest('.video-trim input[data-k]'), range = getRange();
    if (input && range) input.value = String(Math.round((input.dataset.k === 'vs' ? range.start : range.end) * 1000) / 1000);
  });
}
