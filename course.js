/* UAE Labour Law Course — player engine.
   Reads window.COURSE (course-content.js): builds the menu, handles Back/Next,
   locking, progress, narration and video, and draws each page type.
   Course text belongs in course-content.js, not here. */
(function () {
  'use strict';

  const C = window.COURSE;
  const SET = Object.assign({ lockNavigation: true, reviewMode: false, minAnswerLength: 10 }, C.settings);
  if (/[?&]review\b/.test(location.search)) SET.reviewMode = true;

  const STORE_KEY = 'uae-labour-law-v2';
  // Opening the course with ?reset at the end of the address wipes saved progress (for testing).
  if (/[?&]reset\b/.test(location.search)) {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* storage unavailable */ }
    // take "reset" out of the address so refreshing later doesn't wipe progress again
    try {
      const q = location.search.slice(1).split('&').filter(x => x && x !== 'reset').join('&');
      history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
    } catch (e) { /* ignore */ }
  }
  const SPEEDS = ['0.75x', '1x', '1.25x', '1.5x'];

  /* ---------- Pages ---------- */

  const pages = [];
  C.modules.forEach((m, mi) => m.pages.forEach(p => {
    p.module = mi;
    p.path = m.path || null;
    pages.push(p);
  }));
  const indexOfId = id => pages.findIndex(p => p.id === id);

  /* ---------- State (saved in this browser) ---------- */

  const state = {
    index: 0,
    visited: [],
    ps: {},                 // per-page activity state
    learner: { name: '', path: null },
    responses: {},          // typed reflections
    quiz: null,             // assessment questions, answers, result
    speed: '1x', cc: true, muted: false, volume: 0.8,
    menuOpen: false, openModules: {}
  };
  const SAVED = ['index', 'visited', 'ps', 'learner', 'responses', 'quiz', 'speed', 'cc', 'muted', 'volume'];

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved) SAVED.forEach(k => { if (k in saved) state[k] = saved[k]; });
    } catch (e) { /* storage unavailable: start fresh */ }
  }
  function save() {
    try {
      const out = {};
      SAVED.forEach(k => { out[k] = state[k]; });
      localStorage.setItem(STORE_KEY, JSON.stringify(out));
    } catch (e) { /* storage unavailable: progress lasts for this visit only */ }
  }

  const ps = p => state.ps[p.id] || (state.ps[p.id] = {});
  function addSeen(s, key, val) {
    s[key] = s[key] || [];
    if (!s[key].includes(val)) s[key].push(val);
  }
  const seenCount = (s, key) => (s[key] || []).length;

  /* ---------- Paths and locking ---------- */

  const chosenPath = () => state.learner.path;
  const onPath = p => !p.path || p.path === (chosenPath() || 'A');

  // Has the learner done what this page asks before moving on?
  function complete(p) {
    if (SET.reviewMode || !SET.lockNavigation || p.lock === false) return true;
    const s = ps(p);
    switch (p.type) {
      case 'newspaper': case 'resources': case 'organiser': case 'scene':
        return !!s.narrated;
      case 'summary': return !!s.narrated && (!(p.recall && p.recall.followUp) || written(p.id));
      case 'objectives': return !!s.narrated && seenCount(s, 'opened') >= p.lists.length;
      case 'choosePath': return !!(chosenPath() && state.learner.name.trim());
      case 'iconLayers': return seenCount(s, 'seen') >= p.icons.length;
      case 'video': return !!s.watched && (!p.reflection || written(p.id));
      case 'flipCards': return seenCount(s, 'flipped') >= p.cards.length;
      case 'whoWins': case 'reveal': return !!s.submitted;
      case 'mcq': return !!s.submitted && p.correct.includes(s.choice);
      case 'accordion': return seenCount(s, 'seen') >= p.panels.length;
      case 'tabs': return seenCount(s, 'seen') >= p.tabs.length;
      case 'hotspots': return !!s.narrated && seenCount(s, 'seen') >= p.spots.length;
      case 'zoomScene': return !!s.zoomed;
      case 'assessment': return !!(state.quiz && state.quiz.passed);
      default: return true;
    }
  }

  // typed answers must reach a minimum length so they can't be skipped with a key press
  function written(id) { return (state.responses[id] || '').trim().length >= SET.minAnswerLength; }
  function charHint(id) {
    const n = (state.responses[id] || '').trim().length;
    return n >= SET.minAnswerLength ? '' : `Write at least ${SET.minAnswerLength} characters to continue (${n}/${SET.minAnswerLength}).`;
  }

  function step(from, dir) {
    let j = from + dir;
    while (j >= 0 && j < pages.length && !onPath(pages[j])) j += dir;
    return j >= 0 && j < pages.length ? j : -1;
  }

  // Furthest page the learner may open: everything up to the first unfinished page
  function furthest() {
    for (let i = 0; i < pages.length; i++) {
      if (onPath(pages[i]) && !complete(pages[i])) return i;
    }
    return pages.length - 1;
  }
  const canVisit = i => i >= 0 && onPath(pages[i]) && (i <= furthest() || state.visited.includes(pages[i].id));

  /* ---------- Helpers ---------- */

  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cur = () => pages[state.index];
  const root = () => $('#stage .pg');

  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const ICON = {
    speaker: '<svg viewBox="0 0 96 96" aria-hidden="true"><path class="w3" d="M73.5 22 69.6 25.9C82 38.3 82 58.5 69.6 70.9L73.5 74.8C88.1 60.3 88.1 36.6 73.5 22Z"/><path class="w2" d="M65.6 29.8 61.7 33.7C69.8 41.8 69.8 54.9 61.7 63.1L65.6 67C75.9 56.7 75.9 40.1 65.6 29.8Z"/><path class="w1" d="M57.9 37.8 54 41.7C57.8 45.5 57.8 51.6 54 55.4L57.9 59.3C63.9 53.3 63.9 43.7 57.9 37.8Z"/><path d="M3.5 34.6 3.5 61.4 22.9 61.4 48 82 48 14 22.9 34.6Z"/></svg>',
    barSpeaker: '<svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 7h2.8L10 3.4v11.2L5.8 11H3z" fill="currentColor"/><path class="wave" d="M12.4 6.2a4 4 0 0 1 0 5.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path class="wave" d="M14.4 4.2a7 7 0 0 1 0 9.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path class="x" d="M12.6 6.6 16 11m0-4.4L12.6 11" stroke="#C0392B" stroke-width="1.6" stroke-linecap="round"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M8.5 2.5 4 7l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5.5 2.5 10 7l-4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 1.5 7.5 6 3 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tick: '<svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1.5 5.2 4 7.5 8.5 2.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="2" y="5.5" width="8" height="5.5" rx="1.2" fill="currentColor"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" stroke-width="1.4"/></svg>',
    close: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    closeRed: '<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M83.4 21.1 74.9 12.6 48 39.5 21.1 12.6 12.6 21.1 39.5 48 12.6 74.9 21.1 83.4 48 56.5 74.9 83.4 83.4 74.9 56.5 48Z" fill="#E00000"/></svg>',
    cloud: '<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M55.5 35 39.5 35 39.5 59 27 59 47.5 83 68 59 55.5 59Z" fill="#94962A" stroke="#2b2b10" stroke-width="1"/><path d="M80.6 37.9C79.8 33 77.1 28.6 73.1 25.7 69 22.8 63.8 21.7 58.8 22.7 53.9 15.2 44.8 11.5 36.1 13.6 27.6 15.8 21.2 22.9 19.9 31.6 14.3 31.8 9 34.5 5.6 39 1.6 44.6 0.9 51.9 3.7 58.2 6.6 64.4 12.6 68.5 19.4 68.9L26.7 68.9 24 65.6 21.5 62.7 19.7 62.7C15.2 62.4 11.2 59.7 9.2 55.6 7.3 51.4 7.8 46.6 10.5 42.8 13.2 39.1 17.7 37.3 22.3 38L25.8 38.6 25.8 34.7C25.8 27.6 30.6 21.4 37.5 19.7 44.4 18 51.5 21.4 54.7 27.7L55.9 30.1 58.4 29.2C62.2 27.9 66.3 28.5 69.6 30.8 72.8 33.2 74.7 36.9 74.8 40.9L74.8 44 78.9 44C84 44.2 88 48.4 87.9 53.4 87.9 58.5 83.8 62.6 78.8 62.7L73.6 62.7 71 65.6 68.2 69 78.8 69C86.9 68.8 93.5 62.4 94 54.3 94.5 46.2 88.6 39.1 80.6 37.9Z" fill="#94962A" stroke="#2b2b10" stroke-width="1"/></svg>',
    // visited hotspot: same gold disc as the plus, with a tick instead
    spotDone: '<svg class="spot-done" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="37" fill="#D3AF37" stroke="#FFFFFF" stroke-width="4"/><path d="M31 49 43 61 66 36" fill="none" stroke="#1A1A1A" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 49 43 61 66 36" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M47.986 10C27.0108 10 10.007 27.0038 10.007 47.979 10.007 68.9542 27.0108 85.958 47.986 85.958 68.9612 85.958 85.965 68.9542 85.965 47.979 85.965 47.9777 85.965 47.9763 85.965 47.975 85.9722 27.0092 68.9818 10.0072 48.016 10 48.006 9.99999 47.996 9.99999 47.986 10ZM66.605 51.36 51.367 51.36 51.367 66.594 44.605 66.594 44.605 51.356 29.367 51.356 29.367 44.594 44.605 44.594 44.605 29.356 51.367 29.356 51.367 44.594 66.605 44.594Z" fill="#D3AF37" stroke="#FFFFFF" stroke-width="3"/></svg>',
    arrow: '<svg viewBox="0 0 108 100" aria-hidden="true"><path d="M88 6 L102 20 L44 78 L60 94 L6 94 L6 40 L22 56 Z" fill="#D3AF37" stroke="#FFF6CC" stroke-width="4" stroke-linejoin="round"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7.3 5.6 10.2 11.5 3.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const BUBBLE = {
    centre: 'M19 3H121A16 16 0 0 1 137 19V55A16 16 0 0 1 121 71H52L41 88L30 71H19A16 16 0 0 1 3 55V19A16 16 0 0 1 19 3Z',
    left: 'M19 3H121A16 16 0 0 1 137 19V55A16 16 0 0 1 121 71H46L22 89L28 71H19A16 16 0 0 1 3 55V19A16 16 0 0 1 19 3Z'
  };

  function speakerBtn(p, extra) {
    if (!p.narration) return '';
    const s = ps(p);
    const cls = extra || '';
    // Speech-bubble outline from the prototype: rounded box with a pointer below
    const shape = !/\bbubble\b/.test(cls) ? '' : `<svg class="bubble-shape" viewBox="0 0 140 92" preserveAspectRatio="none" aria-hidden="true"><path d="${/\btail-centre\b/.test(cls) ? BUBBLE.centre : BUBBLE.left}"/></svg>`;
    return `<button class="speaker${s.narrated ? '' : ' pulse'}${cls ? ' ' + cls : ''}" data-action="narrate" aria-label="Play narration">${shape}<span class="spk">${ICON.speaker}</span></button>`;
  }

  function linkBtn(l, cls, icon) {
    if (!l) return '';
    const inner = `${icon || ''}<span>${l.label}</span>`;
    return l.url
      ? `<a class="${cls}" href="${esc(l.url)}" target="_blank" rel="noopener">${inner}</a>`
      : `<span class="${cls} todo" title="Add this link in course-content.js">${inner}<small>Link to be added</small></span>`;
  }

  function videoBlock(p) {
    const v = p.video || {};
    const s = ps(p);
    if (v.src) {
      return `<div class="vid-frame is-paused"><video src="${esc(v.src)}" ${v.poster ? `poster="${esc(v.poster)}"` : ''} controls playsinline></video><button class="vid-play" data-action="vid-play" aria-label="Play video"><i aria-hidden="true"></i></button></div>`;
    }
    return `<div class="vid-frame"><button class="vid-ph${s.watched ? ' watched' : ''}" data-action="video-ph" aria-label="Video placeholder: select to mark as watched">
      <i aria-hidden="true"></i><span>Video to be added</span><small>${s.watched ? 'Marked as watched' : 'Select to mark as watched'}</small>
    </button></div>`;
  }

  // [[visible text|tooltip]] → underlined term with a hover/tap explanation
  const terms = t => String(t).replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,
    (m, a, b) => `<span class="term" tabindex="0" role="button" aria-expanded="false" data-action="term">${a}<span class="term-tip" role="tooltip">${b}</span></span>`);

  /* ---------- Page renderers ---------- */
  // Each returns the page HTML. `fresh` is false when a page redraws after a
  // click, so entrance animations don't replay.

  const R = {};

  R.title = p => `
    <img class="ts-bg" src="${esc(p.background)}" alt="">
    <div class="ts-content">
      <h1 class="ts-title serif">${p.heading || C.title}</h1>
      <button class="btn-enter" data-action="next">${p.button || 'Enter'}</button>
    </div>`;

  R.newspaper = p => `
    <div class="np">
      <img class="np-spin" src="${esc(p.image)}" alt="${esc(p.alt || '')}">
      ${speakerBtn(p, 'bubble np-speaker')}<div class="np-tools"><button class="btn-ghost" data-action="replay">Replay animation</button></div>
    </div>`;

  R.objectives = p => {
    const s = ps(p);
    const col = (l, i) => {
      const open = (s.opened || []).includes(i);
      return `<div class="obj-col${open ? ' open' : ''}" data-col="${i}">
        <button class="obj-btn after-narration" data-action="obj" data-i="${i}" aria-expanded="${open}">${l.label}</button>
        <div class="obj-list">${l.intro ? `<p>${l.intro}</p>` : ''}<ul>${l.items.map(t => `<li>${t}</li>`).join('')}</ul></div>
      </div>`;
    };
    return `<div class="obj">
      ${col(p.lists[0], 0)}
      <div class="obj-centre">${speakerBtn(p, 'bubble tail-centre')}<p class="hint before-narration">Select the speaker to begin.</p><img src="${esc(p.image)}" alt="Sarah, thinking"></div>
      ${col(p.lists[1], 1)}
    </div>`;
  };

  R.choosePath = p => {
    const path = chosenPath();
    // the signpost is split into layers (sign-base, sign-arrow-a, ...) so each path can lift on its own
    const sign = part => p.image.replace(/[^/]*$/, 'sign-' + part + '.png');
    const panel = (d, key) => `
      <div class="cp-panel cp-${key.toLowerCase()}${path === key ? ' show' : ''}">
        <h2 class="cp-label">${d.label}</h2>
        <div class="cp-img">${d.image ? `<img src="${esc(d.image)}" alt="Preview of ${esc(d.label)}">` : '<div class="slot">Image placeholder</div>'}</div>
        <p>${d.text}</p>
      </div>`;
    return `<div class="cp">
      ${panel(p.pathA, 'A')}
      <div class="cp-centre">
        <div class="sign"${path ? ` data-pick="${path}"` : ''}>
          ${['A', 'B'].map(k => `
          <button class="sign-hit arrow ${k.toLowerCase()}" data-action="pick-path" data-path="${k}" aria-pressed="${path === k}" aria-label="Choose Path ${k}"><span class="serif">Path ${k}</span></button>
          <button class="sign-hit stones ${k.toLowerCase()}" data-action="pick-path" data-path="${k}" tabindex="-1" aria-hidden="true"></button>`).join('')}
          <img class="lay" src="${esc(sign('base'))}" alt="Signpost with two paths">
          <img class="lay a" src="${esc(sign('stones-a'))}" alt="">
          <img class="lay b" src="${esc(sign('stones-b'))}" alt="">
          <img class="lay a" src="${esc(sign('arrow-a'))}" alt="">
          <img class="lay b" src="${esc(sign('arrow-b'))}" alt="">
        </div>
        <div class="cp-form">
          <label><span>Name</span><input id="learner-name" type="text" placeholder="Insert name here" autocomplete="name" value="${esc(state.learner.name)}"></label>
          <div class="cp-row"><span>Path</span><strong id="path-out">${path ? 'Path ' + path : '—'}</strong></div>
        </div>
      </div>
      ${panel(p.pathB, 'B')}
      <div class="corner-speaker">
        <p class="before-narration">Select the speaker first</p>
        <svg class="cs-arrow before-narration" viewBox="0 0 48 32" aria-hidden="true"><path d="M2 12h28V3l16 13-16 13v-9H2z"/></svg>
        ${speakerBtn(p, 'lifted')}
      </div>
    </div>`;
  };

  function splitScene(p, side) {
    return `<div class="split">
      <div class="split-scene"><img src="${esc(p.scene)}" alt="Sarah at her desk">${speakerBtn(p, 'bubble at-scene')}</div>
      <div class="split-side">${side}</div>
    </div>`;
  }

  R.iconLayers = p => {
    const s = ps(p);
    const btns = p.icons.map(ic => `
      <button class="icon-btn icon-${ic.id}${(s.seen || []).includes(ic.id) ? ' seen' : ''}" data-action="layer-open" data-id="${ic.id}">
        <img src="${esc(ic.icon)}" alt=""><span class="icon-label">${ic.label}</span><span class="seen-tick">${ICON.tick}</span>
      </button>`).join('');
    const layers = p.icons.map(ic => {
      const L = ic.layer;
      return `<div class="layer" id="layer-${ic.id}" role="dialog" aria-label="${esc(ic.label)}" hidden>
        <button class="layer-close" data-action="layer-close" aria-label="Close">${ICON.closeRed}</button>
        <div class="layer-grid">
          <div class="layer-main"><img class="layer-logo" src="${esc(L.image)}" alt=""><p>${L.text}</p>
            <div class="layer-links">${(L.links || []).map(l => linkBtn(l, 'chip-link')).join('')}</div></div>
          <div class="layer-shots">${(L.screenshots || []).map(src => `<img src="${esc(src)}" alt="Screenshot">`).join('')}</div>
        </div>
      </div>`;
    }).join('');
    return `<div class="pg-wrap">${splitScene(p, `<span class="tag">${p.prompt}</span><div class="icon-grid">${btns}</div>`)}${layers}</div>`;
  };

  R.resources = p => splitScene(p, `
    <div class="res">
      <div class="res-item">
        <img class="res-cover" src="${esc(p.download.image)}" alt="Federal Decree-Law No. 33 of 2021 cover">
        ${linkBtn({ label: p.download.label, url: p.download.url }, 'cloud-link', ICON.cloud)}
      </div>
      <div class="res-item">
        <img class="res-globe" src="assets/icons/website.svg" alt="">
        ${linkBtn(p.website, 'tag-link')}
      </div>
    </div>`);

  R.organiser = p => `
    <div class="org">
      <div class="org-art"><img class="after-start" src="${esc(p.image)}" alt="${esc(p.alt || '')}"><p class="hint before-narration">Select the speaker to see what this module covers.</p></div>
      <div class="org-char"><img src="${esc(p.character)}" alt="Sarah">${speakerBtn(p, 'bubble')}</div>
    </div>`;

  R.speech = p => `
    <div class="speech">
      <img class="speech-char" src="${esc(p.character)}" alt="Sarah">
      <div class="speech-main">
        <div class="speech-bubble fade-up${p.bubble.length > 140 ? ' long' : ''}">${p.bubble}</div>
        ${p.download ? linkBtn(p.download, 'cloud-link', ICON.cloud) : ''}
      </div>
    </div>`;

  R.flipCards = p => {
    const s = ps(p);
    const cards = p.cards.map((c, i) => {
      const flipped = (s.flipped || []).includes(i);
      const front = p.style === 'number'
        ? `<span class="num">${c.front}</span>`
        : `<span class="icon-card"><img src="${esc(c.icon)}" alt="${esc(c.alt || '')}"></span>`;
      const back = p.style === 'number'
        ? `<span class="flip-top"><strong>${c.heading}</strong>${c.sub ? `<small>${c.sub}</small>` : ''}</span><span class="flip-label">${c.label}</span><span class="flip-text">${c.text}</span>`
        : `<span class="flip-text">${c.text}</span>`;
      return `<button class="flip flip-${p.style}${flipped ? ' flipped' : ''}" data-action="flip" data-i="${i}" aria-pressed="${flipped}" aria-label="${p.style === 'number' ? 'Step ' + c.front : esc(c.alt || 'Card ' + (i + 1))}">
        <span class="flip-inner"><span class="face front">${front}</span><span class="face back">${back}</span></span>
      </button>`;
    }).join('');
    return `<div class="page-pad">
      <p class="lead">${p.intro}</p>
      <div class="flip-row">${cards}</div>
      ${p.download ? `<div class="dl-row">${linkBtn(p.download, 'cloud-link', ICON.cloud)}</div>` : ''}
    </div>`;
  };

  R.scene = p => `
    <div class="scene-wrap">
      <div class="scene">
        ${p.morph && p.morph.split ? `
        <div class="scene-half left" style="width:${p.morph.split}%"><img src="${esc(p.image)}" alt="${esc(p.alt || '')}" style="width:${(10000 / p.morph.split).toFixed(2)}%"></div>
        <div class="scene-half right" style="width:${100 - p.morph.split}%"><img src="${esc(p.image)}" alt="" style="width:${(10000 / (100 - p.morph.split)).toFixed(2)}%"></div>`
        : `<img class="scene-img" src="${esc(p.image)}" alt="${esc(p.alt || '')}">`}
        ${p.avatar ? `<img class="scene-avatar" src="${esc(p.avatar)}" alt="Sarah">` : ''}
        <div class="scene-speaker" style="left:${p.speaker.x}%;--sy:${p.speaker.y}%">${speakerBtn(p, 'bubble')}</div>
        ${p.tile ? `<div class="scene-tile serif">${p.tile}</div>` : ''}
      </div>
    </div>`;

  // Outline of each layer in assets/images/pyramid.png (1168 x 1014), used for the clickable areas and the glow
  const TIERS = [
    'M13 18 L1153 18 L1043 291 L128 291 Z',
    'M165 351 L998 348 L911 568 L263 568 Z',
    'M300 624 L873 624 L783 824 L393 824 Z',
    'M403 858 L763 856 L701 996 L468 996 Z'
  ];

  function tierInfo(p, i) {
    if (i == null) return `<p class="pyr-prompt">${p.prompt}</p>`;
    const t = p.tiers[i];
    return `<div class="fade-up"><h2 class="pyr-title">${t.title}</h2><p>${t.text}</p></div>`;
  }

  R.pyramid = p => {
    const s = ps(p);
    const pick = s.pick == null ? null : s.pick;
    const glow = TIERS.map((d, i) => `<path class="tier-glow${pick === i ? ' on' : ''}" d="${d}"/>`).join('');
    const hits = TIERS.map((d, i) => `<path class="tier${pick === i ? ' on' : ''}" d="${d}" data-action="tier" data-i="${i}" role="button" tabindex="0" aria-pressed="${pick === i}" aria-label="${esc(p.tiers[i].title)}"/>`).join('');
    return `<div class="pyr${p.morph ? ' morph' : ''}">
      <div class="pyr-side">
        <div class="pyr-head"><img class="avatar" src="${esc(p.avatar)}" alt="Sarah">${speakerBtn(p, 'bubble')}</div>
        <div class="pyr-info" aria-live="polite">${tierInfo(p, pick)}</div>
      </div>
      <div class="pyr-monitor"><div class="pyr-band"><div class="pyr-screen">
        <img src="${esc(p.monitor)}" alt="">
        <svg class="pyr-svg" viewBox="0 0 1168 1014" aria-label="Upside-down pyramid with four layers">${glow}
          <image href="${esc(p.pyramid)}" width="1168" height="1014"/>${hits}
        </svg>
      </div></div></div>
    </div>`;
  };

  R.whoWins = p => {
    const s = ps(p);
    const opts = p.options.map((o, i) => {
      const cls = ['ww-opt', s.choice === i ? 'picked' : '', s.submitted && i === p.correct ? 'right' : ''].join(' ');
      return `<button class="${cls}" data-action="ww-pick" data-i="${i}" aria-pressed="${s.choice === i}" ${s.submitted ? 'disabled' : ''}>
        <strong>${o.title}</strong><em>${o.text}</em></button>`;
    }).join('');
    const right = s.choice === p.correct;
    const foot = s.submitted
      ? `<div class="feedback ${right ? 'good' : 'bad'} fade-up" role="status"><strong>Feedback: ${right ? 'That’s right.' : 'Not quite.'}</strong><p>${right ? p.feedbackCorrect : p.feedbackWrong}</p><p class="takeaway">${p.takeaway}</p></div>`
      : `<button class="btn-gold" data-action="ww-submit" ${s.choice == null ? 'disabled' : ''}>Submit</button>`;
    return `<div class="page-pad ww">
      <p class="q-label">${p.label}</p><p class="q-text">${p.question}</p>
      <div class="ww-opts">${opts}</div>
      <div class="ww-foot">${foot}</div>
    </div>`;
  };

  function accPanel(p, panel, i) {
    let body = '';
    if (panel.kind === 'translation') {
      body = `<div class="acc-trans"><img src="${esc(panel.image)}" alt="A page of the Labour Law in Arabic"><p>${panel.text}</p></div>`;
    } else if (panel.kind === 'journey') {
      const s = ps(p);
      body = `<p>${panel.text}</p><div class="journey">${panel.items.map((it, k) => {
        const open = (s.journey || []).includes(k);
        return `<div class="jr${open ? ' open' : ''} ${k % 2 ? 'ind' : 'gld'}">
          <button class="jr-btn" data-action="journey" data-k="${k}" aria-expanded="${open}">
            <img src="${esc(it.icon)}" alt=""><span><strong>${it.label}</strong><small>(${it.articles})</small></span>
          </button>
          <div class="jr-detail"><strong>${it.question}</strong> ${it.detail}</div>
        </div>`;
      }).join('')}</div>${panel.tip ? `<p class="sarah-tip">${panel.tip}</p>` : ''}`;
    } else if (panel.kind === 'boxes') {
      body = panel.boxes.map(b => `<div class="gold-box"><strong>${b.heading}</strong><p>${b.text}</p></div>`).join('');
    } else if (panel.kind === 'people') {
      body = `<p>${panel.text}</p><div class="people">${panel.people.map(pp => `<figure><img src="${esc(pp.image)}" alt=""><figcaption>${pp.label}</figcaption></figure>`).join('')}
        <div class="remember-callout">${panel.remember}</div></div>`;
    } else if (panel.kind === 'shields') {
      body = `<p>${panel.text}</p><div class="shields">
        <div class="shield" style="background-image:url('${esc(panel.shields[0])}')"><div class="shield-in"><ul>${panel.grounds.map(g => `<li>${g}</li>`).join('')}</ul></div></div>
        <div class="shield" style="background-image:url('${esc(panel.shields[1])}')"><div class="shield-in"><p>${panel.note}</p></div></div>
      </div>`;
    }
    return `<div class="acc-panel acc-${panel.kind}" id="acc-panel-${i}" role="region" aria-label="${esc(panel.title)}"><div class="acc-body"><h2>${panel.title}</h2>${body}</div></div>`;
  }

  R.accordion = p => {
    const s = ps(p);
    const open = s.open == null ? -1 : s.open;
    const items = p.panels.map((panel, i) => `
      <button class="acc-strip${(s.seen || []).includes(i) ? ' seen' : ''}" data-action="acc" data-i="${i}" aria-expanded="${open === i}" aria-controls="acc-panel-${i}"
        style="--i:${i}"><img class="acc-img" src="${esc(p.stripImage)}" alt=""><span class="acc-num">${i + 1}</span><span class="acc-name">${panel.title}</span></button>
      ${accPanel(p, panel, i)}`).join('');
    return `<div class="acc" data-open="${open}">
      <div class="acc-panel acc-intro"><div class="acc-body">
        <p>${p.intro.lead}</p>${p.intro.questions.map(q => `<p><em>${q}</em></p>`).join('')}<p class="green-strong">${p.intro.prompt}</p>
      </div></div>
      ${items}
    </div>`;
  };

  R.video = p => `
    <div class="page-pad vid-page">
      ${p.reflection
        ? videoBlock(p).replace(/<\/div>$/, `<button class="vid-enlarge" data-action="vid-back" aria-label="Watch the video again"><i aria-hidden="true"></i><span>Watch again</span></button></div>`)
        : videoBlock(p)}
      ${p.reflection ? `<button class="btn-gold vid-ask" data-action="vid-ask">Go to the question</button>` : ''}
      ${p.reflection ? `<div class="reflection">
        <p class="q-text">${p.reflection.question}</p>
        <label for="reflect-${p.id}">${p.reflection.prompt}</label>
        <textarea id="reflect-${p.id}" data-reflect="${p.id}" rows="3" placeholder="Type your answer here">${esc(state.responses[p.id] || '')}</textarea>
        <p class="char-hint" data-count-for="${p.id}">${charHint(p.id)}</p>
        <p class="hint">Your answer is saved. You will see it again at the end of the mystery.</p>
      </div>` : ''}
    </div>`;

  R.zoomScene = p => `
    <div class="zs">
      <div class="zs-char"><img src="${esc(p.character)}" alt="Sarah">${speakerBtn(p, 'bubble')}</div>
      <div class="zs-city"><img src="${esc(p.image)}" alt="A city full of companies">
        ${p.tower ? `<img class="zs-tower" src="${esc(p.tower)}" alt="">
        <button class="zs-tower-hit after-start" data-action="zoom" aria-label="Zoom in on this company"></button>` : ''}
        <button class="zs-arrow after-start" data-action="zoom" aria-label="Zoom in on one company">${ICON.arrow}</button>
      </div>
      <p class="zs-prompt"><span class="before-narration">Select the speaker to begin.</span><span class="after-start">${p.prompt}</span></p>
    </div>`;

  R.stack = p => `
    <div class="stack" style="background-image:url('${esc(p.image)}')">
      <div class="stack-boxes">${p.boxes.map(b => `<div class="brown-box"><strong>${b.heading}</strong><span>${b.text}</span></div>`).join('')}</div>
      ${p.download ? `<div class="dl-row">${linkBtn(p.download, 'cloud-link', ICON.cloud)}</div>` : ''}
    </div>`;

  R.reveal = p => {
    const s = ps(p);
    return `<div class="page-pad rv">
      <p class="lead strong">${p.intro}</p>
      <div class="ww-opts static">${p.boxes.map(b => `<div class="ww-opt"><strong>${b.title}</strong><em>${terms(b.text)}</em></div>`).join('')}</div>
      ${s.submitted
        ? `<div class="feedback neutral fade-up" role="status"><p>${p.answer}</p><p class="takeaway">${p.takeaway}</p></div>${p.followUp ? `<p class="follow-up">${p.followUp}</p>` : ''}`
        : `<div class="rv-q"><div>${p.questions.map(q => `<p>${q}</p>`).join('')}</div><button class="btn-gold" data-action="reveal">${p.button}</button></div>`}
    </div>`;
  };

  function tabContent(t) {
    if (t.steps) {
      return `<p>${t.intro}</p>${t.steps.map((st, i) => `<p class="step-in" style="animation-delay:${0.25 + i * 0.55}s"><strong>${st.heading}</strong><br>${st.text}</p>`).join('')}`;
    }
    return t.html;
  }

  R.tabs = p => {
    const s = ps(p);
    const active = s.active == null ? -1 : s.active;
    return `<div class="tb">
      <div class="tb-char"><img src="${esc(p.character)}" alt="Sarah"><p class="tb-prompt">${p.prompt}</p></div>
      <div class="tb-tabs" role="tablist">${p.tabs.map((t, i) => `<button class="tb-tab${active === i ? ' on' : ''}${(s.seen || []).includes(i) ? ' seen' : ''}" role="tab" id="tab-${i}" aria-selected="${active === i}" aria-controls="tab-panel" data-action="tab" data-i="${i}">${t.label}</button>`).join('')}</div>
      <div class="tb-panel" id="tab-panel" role="tabpanel" aria-live="polite">${active === -1 ? '<p class="hint">Select a tab to read about each part of the contract.</p>' : `<div class="fade-up">${tabContent(p.tabs[active])}</div>`}</div>
    </div>`;
  };

  function spotBubble(p, i) {
    if (i == null) return '';
    const sp = p.spots[i];
    const pos = [sp.x < 50 ? `left:${Math.max(sp.x - 6, 1)}%` : `right:${Math.max(100 - sp.x - 6, 1)}%`,
      sp.y < 70 ? `top:calc(${sp.y}% + 34px)` : `bottom:calc(${100 - sp.y}% + 34px)`].join(';');
    return `<div class="hs-bubble fade-up" style="${pos}" role="status">${sp.text}</div>`;
  }

  R.hotspots = p => {
    const s = ps(p);
    const open = s.open == null ? null : s.open;
    return `<div class="hs">
      <div class="hs-img">
        <img src="${esc(p.image)}" alt="${esc(p.alt || '')}">
        <div class="hs-avatar"><img class="avatar" src="${esc(p.avatar)}" alt="Sarah">${speakerBtn(p, 'bubble')}</div>
        ${p.spots.map((sp, i) => `<button class="hs-spot${open === i ? ' on' : ''}${(s.seen || []).includes(i) ? ' seen' : ''}" style="left:${sp.x}%;top:${sp.y}%" data-action="spot" data-i="${i}" aria-expanded="${open === i}" aria-label="Hotspot ${i + 1}">${ICON.plus}${ICON.spotDone}</button>`).join('')}
      </div>
      <div class="hs-bubble-host">${spotBubble(p, open)}</div>
      <p class="hint hs-hint">Select each plus symbol to find out more.</p>
    </div>`;
  };

  R.mcq = p => {
    const s = ps(p);
    const right = s.submitted && p.correct.includes(s.choice);
    const letters = 'ABC';
    return `<div class="page-pad mcq">
      <div class="mcq-main">
        <p class="q-text strong">${p.question}</p>
        <div class="radios" role="radiogroup" aria-label="${esc(p.question)}">${p.options.map((o, i) => `
          <button class="radio${s.choice === i ? ' on' : ''}" role="radio" aria-checked="${s.choice === i}" data-action="mcq-pick" data-i="${i}" ${s.submitted ? 'disabled' : ''}>
            <span class="dot" aria-hidden="true"></span><span><span class="sr-only">${letters[i]}. </span>${o}</span></button>`).join('')}</div>
        ${s.submitted ? (right ? '' : `<button class="btn-gold mcq-retry" data-action="mcq-retry">Retry</button>`) : `<button class="btn-gold" data-action="mcq-submit" ${s.choice == null ? 'disabled' : ''}>Submit</button>`}
      </div>
      <div class="mcq-side">${s.submitted
        ? `<div class="feedback ${right ? 'good' : 'bad'} gif-box fade-up" role="status"><p>${right ? p.feedbackCorrect : p.feedbackWrong}</p><img src="${esc(right ? p.gifCorrect : p.gifWrong)}" alt="Sarah"></div>`
        : `<img class="mcq-img" src="${esc(p.image)}" alt="${esc(p.alt || '')}">`}</div>
    </div>`;
  };

  R.summary = p => `
    <div class="sum">
      <div class="sum-img"><img src="${esc(p.image)}" alt="Sarah at her desk">${speakerBtn(p, 'bubble')}${p.recall && p.recall.keyPoints ? `<div id="sum-feedback" class="sum-fb-card" aria-live="polite">${sumFeedback(p)}</div>` : ''}</div>
      <div class="sum-text">
        <p class="hint before-narration">Select the speaker to hear Sarah’s summary of the case.</p>
        <div class="sum-believed"><strong>${p.believed.heading}</strong><ul>${p.believed.items.map(t => `<li>${t}</li>`).join('')}</ul></div>
        <div class="sum-law"><strong>${p.law.heading}</strong><blockquote>${p.law.quote}</blockquote><p>${p.law.source}</p></div>
        ${p.recall ? `<div class="sum-recall"><strong>${p.recall.heading}</strong><p class="sum-answer">${(state.responses[p.recall.from] || '').trim() ? esc(state.responses[p.recall.from].trim()) : p.recall.empty}</p>
          ${p.recall.followUp ? `<label class="sum-follow" for="reflect-${p.id}">${p.recall.followUp}</label>
          <textarea id="reflect-${p.id}" data-reflect="${p.id}" rows="3" placeholder="Type your answer here">${esc(state.responses[p.id] || '')}</textarea>
          <p class="char-hint" data-count-for="${p.id}">${charHint(p.id)}</p>
          ${p.recall.keyPoints ? `<button class="btn-gold sum-check" data-action="sum-check">Check my answer</button><div class="sum-fb-below" aria-live="polite">${sumFeedback(p)}</div>` : ''}` : ''}</div>` : ''}
      </div>
    </div>`;

  /* Case Summary "Check my answer": spot law-linked words, praise what's there, nudge if nothing is,
     then show the key points (ticked where the learner made them) */
  function sumFeedback(p) {
    const s = ps(p), R = p.recall, fb = R.feedback;
    if (!s.checked) return '';
    const text = (state.responses[p.id] || '').toLowerCase();
    if (!text.trim()) return `<p class="sum-fb nudge">${fb.empty}</p>`;
    const hit = R.keyPoints.map(k => k.words.some(w => text.includes(w)));
    const list = (show) => `<p class="sum-keys-title">Points a strong answer would include:</p>
      <ul class="sum-keys">${R.keyPoints.map((k, i) => `<li class="${hit[i] ? 'hit' : ''}">${k.label}</li>`).join('')}</ul>`;
    if (!hit.some(Boolean)) {
      return `<p class="sum-fb nudge">${fb.none}</p>` +
        (s.showKeys ? list() : `<button class="link-btn" data-action="sum-keys">Show the key points</button>`);
    }
    const got = R.keyPoints.filter((k, i) => hit[i]).map(k => k.short);
    const said = got.length > 1 ? got.slice(0, -1).join(', ') + ' and ' + got[got.length - 1] : got[0];
    return `<p class="sum-fb good">${fb.good} You pointed out that ${said}.</p>${list()}`;
  }

  // {{words|page-id(:section)}} in assessment hints -> link that takes the learner back to review that page
  function hintLinks(text) {
    return text.replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, (m, words, target) =>
      `<button class="review-link" data-action="review" data-target="${esc(target)}">${words}</button>`);
  }

  /* Assessment: pick questions once per learner, keep them on every retry */
  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }
  function ensureQuiz(p) {
    const bankIds = p.bank.map(q => q.id);
    const q = state.quiz;
    if (q && q.ids && q.ids.length === p.pick && q.ids.every(id => bankIds.includes(id))) return q;
    // At least two critical-thinking questions, the rest random
    const apply = shuffle(p.bank.filter(x => x.type === 'apply'));
    const rest = shuffle(p.bank.filter(x => !apply.slice(0, 2).includes(x)));
    const ids = shuffle(apply.slice(0, 2).concat(rest.slice(0, p.pick - 2))).map(x => x.id);
    const order = {};
    ids.forEach(id => { order[id] = shuffle([0, 1, 2]); });
    state.quiz = { ids, order, answers: {}, result: {}, attempts: 0, passed: false };
    save();
    return state.quiz;
  }

  R.assessment = p => {
    const q = ensureQuiz(p);
    const byId = Object.fromEntries(p.bank.map(x => [x.id, x]));
    const allAnswered = q.ids.every(id => q.answers[id] != null);
    const checked = Object.keys(q.result).length > 0;
    const nRight = q.ids.filter(id => q.result[id] === true).length;
    const cards = q.ids.map((id, n) => {
      const item = byId[id];
      const res = q.result[id];
      const locked = res === true || (checked && !q.retrying) || q.passed;
      return `<fieldset class="aq${res === true ? ' right' : res === false ? ' wrong' : ''}">
        <legend><span class="aq-n">Question ${n + 1}</span>${item.q}</legend>
        <div class="radios">${q.order[id].map(oi => `
          <button class="radio${q.answers[id] === oi ? ' on' : ''}" role="radio" aria-checked="${q.answers[id] === oi}" data-action="aq-pick" data-id="${id}" data-o="${oi}" ${locked ? 'disabled' : ''}>
            <span class="dot" aria-hidden="true"></span><span>${item.options[oi]}</span></button>`).join('')}</div>
        ${res === true ? `<p class="aq-fb good">${ICON.check} <strong>Correct.</strong> ${item.explain}</p>` : ''}
        ${res === false ? `<p class="aq-fb bad"><strong>Not quite.</strong> <span>${hintLinks(item.hint)}</span></p>` : ''}
      </fieldset>`;
    }).join('');
    let foot;
    if (q.passed) {
      foot = `<div class="feedback good fade-up" role="status"><strong>Well done${state.learner.name ? ', ' + esc(state.learner.name.trim()) : ''}!</strong> You answered all three correctly. Select Next to continue.</div>`;
    } else if (checked && !q.retrying) {
      foot = `<div class="aq-foot"><p role="status"><strong>${nRight} of ${q.ids.length} correct.</strong> Read the feedback, then try the same questions again.</p><button class="btn-gold" data-action="aq-retry">Try again</button></div>`;
    } else {
      foot = `<div class="aq-foot"><button class="btn-gold" data-action="aq-submit" ${allAnswered ? '' : 'disabled'}>Submit</button></div>`;
    }
    return `<div class="page-pad aq-page"><p class="lead">${p.intro}</p>${cards}${foot}</div>`;
  };

  R.checklist = p => {
    const s = ps(p);
    return `<div class="ck" style="background-image:url('${esc(p.image)}')"><ul class="ck-list">${p.items.map((t, i) => {
      const on = (s.checked || []).includes(i);
      return `<li><button class="ck-item${on ? ' on' : ''}" role="checkbox" aria-checked="${on}" data-action="check" data-i="${i}"><span class="box" aria-hidden="true">${ICON.check}</span><span>${t}</span></button></li>`;
    }).join('')}</ul></div>`;
  };

  R.comingSoon = p => `
    <div class="soon">
      <img src="assets/images/sarah-standing.png" alt="">
      <div><h2 class="serif">${p.heading}</h2><p>${p.text}</p><button class="btn-gold" data-action="goto-id" data-id="choose-path">Choose a different path</button></div>
    </div>`;

  /* ---------- Narration and captions ---------- */

  let audio = null;
  let speaking = false;

  function rate() { return parseFloat(state.speed) || 1; }

  function narrate(p) {
    const n = p.narration;
    if (!n) return;
    stopAudio();
    showCaption(n.text, !n.audio);
    if (n.audio) {
      audio = new Audio(n.audio);
      audio.playbackRate = rate();
      audio.muted = state.muted;
      audio.volume = state.volume;
      const a = audio;
      setSpeaking(true);
      // Storyboard: on most pages Next unlocks as soon as the speaker is selected
      // and the audio starts; pages with untilEnd wait for the voice-over to finish.
      a.addEventListener('playing', () => { if (!n.untilEnd) markNarrated(p); });
      a.addEventListener('ended', () => { if (audio === a) setSpeaking(false); markNarrated(p); });
      // A missing or broken file must never trap the learner on the page
      a.addEventListener('error', () => { if (audio === a) setSpeaking(false); markNarrated(p); });
      // Autoplay blocked (e.g. page opened directly): the speaker keeps pulsing to be selected
      a.play().catch(err => { if (audio === a) setSpeaking(false); if (err && err.name !== 'NotAllowedError' && err.name !== 'AbortError') markNarrated(p); });
    } else {
      // No audio yet: selecting the speaker counts as hearing it
      setSpeaking(true);
      markNarrated(p);
      later(() => setSpeaking(false), 1200);
    }
  }
  function stopAudio() {
    if (audio) { audio.pause(); audio = null; }
    setSpeaking(false);
  }
  function setSpeaking(on) {
    speaking = on;
    const r = root();
    if (r) r.classList.toggle('speaking', on);
    if (on && r) r.classList.add('narration-started');
  }
  function markNarrated(p) {
    const s = ps(p);
    if (!s.narrated) { s.narrated = true; refresh(); }
    $$('#stage .speaker').forEach(b => b.classList.remove('pulse'));
  }

  function showCaption(text, placeholder) {
    const cap = $('#caption');
    cap.innerHTML = `<p>${text}</p>${placeholder ? '<small>Narration audio to be added</small>' : ''}<button class="cap-close" data-action="cap-close" aria-label="Hide captions">${ICON.close}</button>`;
    cap.hidden = !state.cc;
    cap.dataset.has = '1';
  }
  function hideCaption() {
    const cap = $('#caption');
    cap.hidden = true;
    cap.dataset.has = '';
  }

  /* ---------- Chrome: bar and menu ---------- */

  function renderBar(p) {
    // speed, sound and captions also control the video on video pages
    const offAudio = !p.narration && !(p.video && p.video.src) ? ' off' : '';
    const prev = step(state.index, -1), nxt = step(state.index, 1);
    const ok = complete(p);
    const back = `<button class="nav-btn" data-action="back" aria-label="Back" ${prev === -1 ? 'disabled' : ''}>${ICON.back}</button>`;
    const nextOff = p.nextButton === false;
    const next = `<button class="nav-btn next" data-action="next" aria-label="${ok && !nextOff ? 'Next' : 'Next (complete the activity first)'}" ${nxt === -1 || !ok || nextOff ? 'disabled' : ''}>${ICON.next}</button>`;
    const cc = `<button class="cc${state.cc ? ' on' : ''}" data-action="cc" aria-pressed="${state.cc}" aria-label="Closed captions">CC</button>`;
    const mute = `<button class="mute" data-action="mute" aria-pressed="${state.muted}" aria-label="${state.muted ? 'Unmute narration' : 'Mute narration'}">${ICON.barSpeaker}</button>`;
    const hint = nextOff && p.nextHint ? `<span class="lock-hint">${ICON.lock} ${p.nextHint}</span>`
      : !ok ? `<span class="lock-hint">${ICON.lock} Complete the activity to continue</span>` : '';
    const ret = state.returnTo && state.returnTo !== p.id ? `<button class="return-btn" data-action="return-to">Back to the assessment</button>` : '';
    const bar = $('#bar');
    bar.classList.toggle('is-muted', state.muted);
    bar.innerHTML = `
      <div class="bar-wide">
        <div class="audio audio-left${offAudio}">
          <div class="speeds" role="group" aria-label="Narration speed">
            ${SPEEDS.map(sp => `<button class="speed${state.speed === sp ? ' on' : ''}" data-action="speed" data-speed="${sp}" aria-pressed="${state.speed === sp}">${sp}</button>`).join('')}
          </div>
          ${cc}
        </div>
        <div class="bar-right">
          ${ret}${hint}
          <div class="audio${offAudio}">${mute}<div class="vol" style="--v:${Math.round(state.volume * 100)}%"><i></i><b></b><input class="vol-range" type="range" min="0" max="100" step="5" value="${Math.round(state.volume * 100)}" aria-label="Volume"></div></div>
          <div class="nav">
            <div class="tip-wrap">${back}<span class="tip tip-above">Back</span></div>
            <div class="tip-wrap">${next}<span class="tip tip-above">${ok && !nextOff ? 'Next' : 'Locked'}</span></div>
          </div>
        </div>
      </div>
      <div class="bar-mobile">
        <div class="m-audio audio${offAudio}">
          ${mute}
          <button class="m-speed${state.speed !== '1x' ? ' changed' : ''}" data-action="speed-cycle" aria-label="Narration speed ${state.speed}">${state.speed}</button>
          ${cc}
        </div>
        <div class="m-nav">${back}${ret || hint}${next}</div>
      </div>`;
  }

  // pages that count towards course progress (flat menu sections like the Introduction don't)
  function relevantPages() { return pages.filter(p => onPath(p) && !C.modules[p.module].flat); }

  function renderMenu() {
    const curP = cur();
    const rel = relevantPages();
    const doneN = rel.filter(p => state.visited.includes(p.id) && complete(p)).length;
    const pct = Math.round(doneN / rel.length * 100);
    if (!(curP.module in state.openModules)) state.openModules[curP.module] = true;

    const mods = C.modules.map((m, mi) => {
      if (m.flat) {
        return `<div class="mod-flat">${m.pages.filter(p => p.menu !== false).map(p => {
          const i = indexOfId(p.id), isCur = i === state.index, allowed = canVisit(i);
          return `<button class="pg-link${isCur ? ' current' : ''}" data-action="goto" data-index="${i}" ${allowed ? '' : 'disabled'} ${isCur ? 'aria-current="page"' : ''}>${p.title}</button>`;
        }).join('')}</div>`;
      }
      const offPath = m.path && m.path !== (chosenPath() || 'A');
      if (m.single) {
        const idx = m.pages.map(p => indexOfId(p.id));
        const isCur = idx.includes(state.index);
        const done = !offPath && m.pages.every(p => state.visited.includes(p.id) && complete(p));
        const allowed = canVisit(idx[0]);
        const st = isCur ? 'current' : done ? 'done' : allowed ? '' : 'locked';
        return `<div class="mod mod-single${offPath ? ' off-path' : ''}">
          <button class="pg-btn ${st}" data-action="goto" data-index="${isCur ? state.index : idx[0]}" ${allowed ? '' : 'disabled'} ${isCur ? 'aria-current="page"' : ''}>
            <span class="pg-dot">${st === 'done' || (isCur && done) ? ICON.tick : st === 'locked' ? ICON.lock : ''}</span>
            <span class="pg-title">${m.title}</span>${m.path ? `<span class="mod-path">Path ${m.path}</span>` : ''}
          </button></div>`;
      }
      const allDone = !offPath && m.pages.every(p => state.visited.includes(p.id) && complete(p));
      const open = !!state.openModules[mi];
      return `
        <div class="mod${open ? ' open' : ''}${offPath ? ' off-path' : ''}">
          <button class="mod-btn" data-action="toggle-module" data-module="${mi}" aria-expanded="${open}">
            ${ICON.chevron}<span class="mod-title">${m.title}</span>
            ${m.path && m.pathTag !== false ? `<span class="mod-path">Path ${m.path}</span>` : ''}${allDone ? '<span class="mod-done">Complete</span>' : ''}
          </button>
          <div class="mod-pages">
            ${m.pages.map(p => {
              const grp = (m.menuGroups || []).find(g => g.pages.includes(p.id));
              if (grp) {
                if (grp.pages[0] !== p.id) return '';
                const idx = grp.pages.map(indexOfId);
                const gCur = idx.includes(state.index);
                const gDone = grp.pages.every(id => state.visited.includes(id) && complete(pages[indexOfId(id)]));
                const li = indexOfId(grp.link);
                const earlierDone = !grp.lockUntilDone || SET.reviewMode || relevantPages().filter(q => indexOfId(q.id) < idx[0]).every(q => state.visited.includes(q.id) && complete(q));
                const gAllowed = canVisit(li) && earlierDone;
                const gst = gCur ? 'current' : gDone ? 'done' : gAllowed ? '' : 'locked';
                // a locked line with a note stays focusable/tappable (aria-disabled) so the note can show on hover, focus or tap
                const tip = gst === 'locked' && grp.lockedTip;
                return `
                <button class="pg-btn ${gst}${tip ? ' has-tip' : ''}" data-action="${tip ? 'locked-tip' : 'goto'}" data-index="${li}" ${gAllowed ? '' : tip ? 'aria-disabled="true"' : 'disabled'} ${gCur ? 'aria-current="page"' : ''}>
                  <span class="pg-dot">${gst === 'done' || (gCur && gDone) ? ICON.tick : gst === 'locked' ? ICON.lock : ''}</span>
                  <span class="pg-title">${grp.label}</span>
                  ${tip ? `<span class="lock-tip" role="tooltip">${grp.lockedTip}</span>` : ''}
                </button>`;
              }
              const i = indexOfId(p.id);
              const isCur = i === state.index;
              const done = state.visited.includes(p.id) && complete(p);
              const allowed = canVisit(i);
              const st = isCur ? 'current' : done ? 'done' : allowed ? '' : 'locked';
              return `
                <button class="pg-btn ${st}" data-action="goto" data-index="${i}" ${allowed ? '' : 'disabled'} ${isCur ? 'aria-current="page"' : ''}>
                  <span class="pg-dot">${st === 'done' ? ICON.tick : st === 'locked' ? ICON.lock : ''}</span>
                  <span class="pg-title">${p.menuTitle || p.title}</span>
                </button>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');

    $('#menu').innerHTML = `
      <div class="menu-brand">
        <img class="menu-logo" src="assets/images/nama-logo.png" alt="NAMA Academy">
        <button class="menu-close" data-action="menu-close" aria-label="Close menu">${ICON.close}</button>
      </div>
      <div class="menu-head">
        <div class="menu-title-row">
          <span class="menu-title serif">Course menu</span>
        </div>
        ${state.learner.name.trim() ? `<p class="menu-learner">${esc(state.learner.name.trim())}${chosenPath() ? ' · Path ' + chosenPath() : ''}</p>` : ''}
        <div class="progress-row"><span>Course progress</span><b>${pct}%</b></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <nav class="menu-nav">${mods}</nav>
      <div class="menu-foot">
        <button class="exit" data-action="exit">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M9.5 2.5H4a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 4 13.5h5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 5.5 13.5 8 11 10.5M13.5 8H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Exit course
        </button>
      </div>`;
  }

  function setMenu(open, returnFocus = true) {
    if (open === state.menuOpen) return;
    state.menuOpen = open;
    $('#player').classList.toggle('menu-open', open);
    $('#menu').setAttribute('aria-hidden', String(!open));
    if (open) {
      renderMenu();
      const btn = $('#menu .menu-close');
      if (btn) btn.focus();
    } else if (returnFocus) {
      const burger = $('.burger');
      if (burger && !$('#player').hidden) burger.focus();
    }
  }

  // Re-check locks and page classes after the learner does something
  function refresh() {
    const p = cur();
    const r = root();
    if (r) {
      const s = ps(p);
      r.classList.toggle('is-narrated', !!s.narrated);
      if (s.narrated) r.classList.add('narration-started');
      r.classList.toggle('is-watched', !!s.watched);
    }
    renderBar(p);
    if (state.menuOpen) renderMenu();
    save();
  }

  /* ---------- Drawing and navigation ---------- */

  function draw(fresh) {
    const p = cur();
    const titleEl = $('#title-screen'), playerEl = $('#player');
    document.title = p.type === 'title' ? C.title : `${p.title} · ${C.title}`;

    if (p.type === 'title') {
      playerEl.hidden = true;
      titleEl.hidden = false;
      titleEl.innerHTML = R.title(p);
      return;
    }
    titleEl.hidden = true;
    titleEl.innerHTML = '';
    playerEl.hidden = false;
    $('#page-title').innerHTML = p.title;

    const stage = $('#stage');
    const prevScroll = !fresh && root() ? root().scrollTop : 0;
    const s = ps(p);
    const cls = ['pg', 'pg-' + p.type, fresh ? 'fresh' : '', s.narrated ? 'is-narrated narration-started was-narrated' : '', s.watched ? 'is-watched' : '', askId === p.id ? 'ask' : ''].join(' ');
    stage.innerHTML = `<div class="${cls}">${(R[p.type] || R.speech)(p, fresh)}</div>`;
    if (prevScroll) root().scrollTop = prevScroll;
    afterDraw(p, fresh);
    renderBar(p);
    if (state.menuOpen) renderMenu();
  }

  function afterDraw(p, fresh) {
    const s = ps(p);
    const vid = $('#stage video');
    if (vid) setupVideo(vid, p, s);
    if (!fresh) return;
    // Narration that starts by itself
    if (p.type === 'newspaper') later(() => narrate(p), 3900);
    if (p.narration && p.narration.auto && !s.narrated) later(() => narrate(p), 600);
  }

  /* ---------- Video: captions, speed and no skipping ahead ---------- */

  function setupVideo(vid, p, s) {
    vid.playbackRate = rate();
    vid.defaultPlaybackRate = rate();
    vid.muted = state.muted;
    vid.volume = state.volume;
    // Captions come from assets/video/captions.js (built from the .srt files),
    // added here so they also work when the course is opened by double-click.
    const cues = (window.COURSE_CAPTIONS || {})[p.id];
    if (cues && cues.length && window.VTTCue) {
      const track = vid.addTextTrack('captions', 'English', 'en');
      cues.forEach(([a, b, t]) => track.addCue(new VTTCue(a, b, t)));
      track.mode = state.cc ? 'showing' : 'hidden';
    }
    // Storyboard: Next unlocks at the end of the video. On a first viewing the
    // learner can rewind but not jump ahead; once watched, seeking is free.
    let furthest = 0;
    vid.addEventListener('timeupdate', () => {
      if (!vid.seeking && vid.currentTime > furthest && vid.currentTime - furthest < 1.5) furthest = vid.currentTime;
    });
    vid.addEventListener('seeking', () => {
      if (!s.watched && !SET.reviewMode && vid.currentTime > furthest + 0.5) vid.currentTime = furthest;
    });
    vid.addEventListener('ended', () => {
      s.watched = true;
      if (p.reflection) showQuestion(p);
      refresh();
    });
    vid.addEventListener('play', stopAudio);
    // big gold play button in the middle whenever the video is not playing
    const frame = vid.closest('.vid-frame');
    const paused = () => frame && frame.classList.toggle('is-paused', vid.paused);
    ['play', 'playing', 'pause', 'ended'].forEach(e => vid.addEventListener(e, paused));
  }
  // Pages with a question after the video: the video shows large on its own,
  // and the question replaces it once the video has ended.
  let askId = null;
  function showQuestion(p) {
    askId = p.id;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    const r = root();
    if (r) r.classList.add('ask');
    const v = $('#stage video');
    if (v) v.pause();
    const ta = $('#stage .reflection textarea');
    if (ta) setTimeout(() => ta.focus({ preventScroll: true }), 450);
  }
  function syncVideos() {
    $$('#stage video').forEach(v => {
      v.playbackRate = rate(); v.defaultPlaybackRate = rate(); v.muted = state.muted; v.volume = state.volume;
      [...v.textTracks].forEach(t => { t.mode = state.cc ? 'showing' : 'hidden'; });
    });
  }

  function go(i) {
    if (i < 0 || i >= pages.length) return;
    askId = null;
    const from = cur();
    timers.forEach(clearTimeout); timers = [];
    stopAudio();
    hideCaption();
    state.index = i;
    const id = pages[i].id;
    if (state.returnTo === id) state.returnTo = null;
    if (!state.visited.includes(id)) state.visited.push(id);
    save();
    if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
    const fromMenu = state.menuOpen;
    setMenu(false, false);
    // pages paired with `morph` glide into each other (View Transitions); the header and bar just switch
    const morph = from.morph && from.morph.to === id && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (morph) document.startViewTransition(() => draw(true));
    else draw(true);
    if (fromMenu && pages[i].type !== 'title') {
      const stage = $('#stage');
      stage.setAttribute('tabindex', '-1');
      stage.focus({ preventScroll: true });
    }
  }

  // viaPage: the page's own control (e.g. the zoom hotspot) moving on, allowed even where the Next button is off
  function goNext(viaPage) {
    const p = cur();
    if (!complete(p) || (p.nextButton === false && !viaPage)) return;
    go(step(state.index, 1));
  }

  /* ---------- Events ---------- */

  const A = {
    next: el => { const inBar = !!el.closest('#bar'); goNext(); if (inBar) keepBarFocus('next'); },
    back: el => { const inBar = !!el.closest('#bar'); go(step(state.index, -1)); if (inBar) keepBarFocus('back'); },
    goto: el => { const i = +el.dataset.index; if (canVisit(i)) go(i); },
    'locked-tip': el => { el.classList.add('show-tip'); clearTimeout(el._tipT); el._tipT = setTimeout(() => el.classList.remove('show-tip'), 2500); },
    'goto-id': el => go(indexOfId(el.dataset.id)),
    // jump back from the assessment to review a page (opening the right tab/panel), with a button to return
    review: el => {
      const [id, sec] = el.dataset.target.split(':');
      const i = indexOfId(id); if (i < 0) return;
      if (sec != null) { const tp = pages[i], ts = ps(tp); if (tp.type === 'tabs') { ts.active = +sec; addSeen(ts, 'seen', +sec); } else if (tp.type === 'accordion') { ts.open = +sec; addSeen(ts, 'seen', +sec); } }
      state.returnTo = cur().id;
      go(i);
    },
    'return-to': () => { const id = state.returnTo; state.returnTo = null; go(indexOfId(id)); },
    'menu-open': () => setMenu(true),
    'menu-close': () => setMenu(false),
    'toggle-module': el => {
      const mi = +el.dataset.module;
      state.openModules[mi] = !state.openModules[mi];
      renderMenu();
      const btn = $(`#menu [data-action="toggle-module"][data-module="${mi}"]`);
      if (btn) btn.focus();
    },
    // on-page box (browser pop-ups are blocked in some places, e.g. inside an LMS)
    exit: () => {
      if ($('#exit-box')) return;
      const box = document.createElement('div');
      box.id = 'exit-box';
      box.className = 'exit-box';
      box.innerHTML = `<div class="exit-card" role="alertdialog" aria-modal="true" aria-labelledby="exit-title">
        <h2 id="exit-title" class="serif">Exit the course?</h2>
        <p>Your progress is saved, so you can carry on from where you left off next time.</p>
        <div class="exit-btns"><button class="btn-ghost" data-action="exit-stay">Stay in the course</button><button class="btn-gold" data-action="exit-yes">Exit</button></div>
      </div>`;
      document.body.appendChild(box);
      box.addEventListener('click', e => { if (e.target === box) box.remove(); });
      box.querySelector('[data-action="exit-stay"]').focus();
    },
    'exit-stay': () => { const b = $('#exit-box'); if (b) b.remove(); $('#menu .exit') && $('#menu .exit').focus(); },
    'exit-yes': () => {
      const b = $('#exit-box'); if (b) b.remove();
      setMenu(false);
      go(0);
    },
    speed: el => { state.speed = el.dataset.speed; if (audio) audio.playbackRate = rate(); syncVideos(); save(); renderBar(cur()); },
    'speed-cycle': () => { state.speed = SPEEDS[(SPEEDS.indexOf(state.speed) + 1) % SPEEDS.length]; if (audio) audio.playbackRate = rate(); syncVideos(); save(); renderBar(cur()); },
    cc: () => {
      state.cc = !state.cc;
      const cap = $('#caption');
      if (cap.dataset.has) cap.hidden = !state.cc;
      syncVideos();
      save(); renderBar(cur());
    },
    'cap-close': () => { $('#caption').hidden = true; },
    mute: () => { state.muted = !state.muted; if (!state.muted && state.volume === 0) state.volume = 0.5; if (audio) { audio.muted = state.muted; audio.volume = state.volume; } syncVideos(); save(); renderBar(cur()); },

    narrate: () => narrate(cur()),
    replay: () => { timers.forEach(clearTimeout); timers = []; stopAudio(); hideCaption(); draw(true); },
    'vid-ask': () => showQuestion(cur()),
    // small video above the question: back to the large video, from the start
    'vid-play': el => {
      const v = el.closest('.vid-frame').querySelector('video');
      if (v) { if (v.ended) v.currentTime = 0; v.play().catch(() => {}); v.focus(); }
    },
    'vid-back': () => {
      askId = null;
      const r = root();
      if (r) r.classList.remove('ask');
      const v = $('#stage video');
      if (v) { v.currentTime = 0; v.play().catch(() => {}); v.focus(); }
    },
    'video-ph': el => {
      ps(cur()).watched = true;
      el.classList.add('watched');
      el.querySelector('small').textContent = 'Marked as watched';
      refresh();
    },

    obj: el => {
      const p = cur(), s = ps(p), i = +el.dataset.i;
      const col = el.closest('.obj-col');
      const open = !col.classList.contains('open');
      col.classList.toggle('open', open);
      el.setAttribute('aria-expanded', open);
      if (open) addSeen(s, 'opened', i);
      refresh();
    },

    'pick-path': el => {
      const path = el.dataset.path;
      state.learner.path = path;
      $('.sign').dataset.pick = path;
      $$('.sign-hit.arrow').forEach(b => b.setAttribute('aria-pressed', b.dataset.path === path));
      $$('.cp-panel').forEach(pn => pn.classList.toggle('show', pn.classList.contains('cp-' + path.toLowerCase())));
      $('#path-out').textContent = 'Path ' + path;
      refresh();
    },

    'layer-open': el => {
      const p = cur(), s = ps(p), id = el.dataset.id;
      $$('#stage .layer').forEach(l => { l.hidden = l.id !== 'layer-' + id; });
      addSeen(s, 'seen', id);
      el.classList.add('seen');
      const close = $(`#layer-${id} .layer-close`);
      if (close) close.focus();
      refresh();
    },
    'layer-close': el => {
      const layer = el.closest('.layer');
      layer.hidden = true;
      const btn = $(`#stage [data-action="layer-open"][data-id="${layer.id.replace('layer-', '')}"]`);
      if (btn) btn.focus();
    },

    flip: el => {
      const p = cur(), s = ps(p), i = +el.dataset.i;
      const on = !el.classList.contains('flipped');
      el.classList.toggle('flipped', on);
      el.setAttribute('aria-pressed', on);
      addSeen(s, 'flipped', i);
      refresh();
    },

    tier: el => {
      const p = cur(), s = ps(p), i = +el.dataset.i;
      s.pick = s.pick === i ? null : i;
      $$('#stage .tier').forEach(t => { const on = +t.dataset.i === s.pick; t.classList.toggle('on', on); t.setAttribute('aria-pressed', on); });
      $$('#stage .tier-glow').forEach((g, k) => g.classList.toggle('on', k === s.pick));
      $('#stage .pyr-info').innerHTML = tierInfo(p, s.pick);
      if (s.pick != null) addSeen(s, 'seen', i);
      refresh();
    },

    'ww-pick': el => { const s = ps(cur()); if (s.submitted) return; s.choice = +el.dataset.i; draw(false); refocus(`[data-action="ww-pick"][data-i="${s.choice}"]`); },
    'ww-submit': () => { const s = ps(cur()); if (s.choice == null) return; s.submitted = true; draw(false); refresh(); refocus('#stage .feedback'); },

    acc: el => {
      const p = cur(), s = ps(p), i = +el.dataset.i;
      s.open = s.open === i ? -1 : i;
      const acc = $('#stage .acc');
      acc.dataset.open = s.open;
      $$('#stage .acc-strip').forEach(b => b.setAttribute('aria-expanded', +b.dataset.i === s.open));
      if (s.open !== -1) { addSeen(s, 'seen', i); el.classList.add('seen'); }
      refresh();
    },
    journey: el => {
      const p = cur(), s = ps(p), k = +el.dataset.k;
      const item = el.closest('.jr');
      const open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      el.setAttribute('aria-expanded', open);
      if (open) addSeen(s, 'journey', k);
      save();
    },

    zoom: el => {
      const p = cur(), s = ps(p);
      const zs = el.closest('.zs');
      zs.classList.add('zooming');
      later(() => { s.zoomed = true; save(); goNext(true); }, 950);
    },

    // feedback is drawn twice: on the picture (laptop) and under the button (phone); CSS shows one
    'sum-check': () => {
      const p = cur(), s = ps(p);
      s.checked = true;
      save();
      $$('#sum-feedback, .sum-fb-below').forEach(b => { b.innerHTML = sumFeedback(p); });
      refresh();
    },
    'sum-keys': () => { const p = cur(), s = ps(p); s.showKeys = true; save(); $$('#sum-feedback, .sum-fb-below').forEach(b => { b.innerHTML = sumFeedback(p); }); },

    reveal: () => { ps(cur()).submitted = true; draw(false); refresh(); refocus('#stage .feedback'); },

    tab: el => {
      const p = cur(), s = ps(p), i = +el.dataset.i;
      s.active = i;
      addSeen(s, 'seen', i);
      $$('#stage .tb-tab').forEach(t => { const on = +t.dataset.i === i; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
      el.classList.add('seen');
      $('#tab-panel').innerHTML = `<div class="fade-up">${tabContent(p.tabs[i])}</div>`;
      refresh();
    },

    spot: el => {
      const p = cur(), s = ps(p), i = +el.dataset.i;
      s.open = s.open === i ? null : i;
      $$('#stage .hs-spot').forEach(b => { const on = +b.dataset.i === s.open; b.classList.toggle('on', on); b.setAttribute('aria-expanded', on); });
      $('#stage .hs-bubble-host').innerHTML = spotBubble(p, s.open);
      if (s.open != null) { addSeen(s, 'seen', i); el.classList.add('seen'); }
      refresh();
    },

    'mcq-pick': el => { const s = ps(cur()); if (s.submitted) return; s.choice = +el.dataset.i; draw(false); refocus(`[data-action="mcq-pick"][data-i="${s.choice}"]`); },
    // wrong answer: clear it so they can choose again (Next stays locked until they get it right)
    'mcq-retry': () => { const s = ps(cur()); s.submitted = false; s.choice = null; draw(false); refresh(); refocus('#stage [data-action="mcq-pick"]'); },
    'mcq-submit': () => { const s = ps(cur()); if (s.choice == null) return; s.submitted = true; draw(false); refresh(); refocus('#stage .feedback'); },

    'aq-pick': el => {
      const q = state.quiz;
      q.answers[el.dataset.id] = +el.dataset.o;
      save(); draw(false);
      refocus(`[data-action="aq-pick"][data-id="${el.dataset.id}"][data-o="${el.dataset.o}"]`);
    },
    'aq-submit': () => {
      const p = cur(), q = state.quiz;
      const byId = Object.fromEntries(p.bank.map(x => [x.id, x]));
      q.ids.forEach(id => { q.result[id] = q.answers[id] === byId[id].correct; });
      q.attempts += 1;
      q.retrying = false;
      q.passed = q.ids.every(id => q.result[id]);
      draw(false); refresh();
      refocus(q.passed ? '#stage .feedback' : '#stage .aq-foot p');
    },
    'aq-retry': () => {
      const q = state.quiz;
      q.ids.forEach(id => { if (!q.result[id]) { delete q.answers[id]; delete q.result[id]; } });
      q.retrying = true;
      save(); draw(false);
      refocus('#stage .aq.wrong .radio, #stage .aq:not(.right) .radio');
    },

    check: el => {
      const p = cur(), s = ps(p), i = +el.dataset.i;
      s.checked = s.checked || [];
      const on = !s.checked.includes(i);
      s.checked = on ? s.checked.concat(i) : s.checked.filter(x => x !== i);
      el.classList.toggle('on', on);
      el.setAttribute('aria-checked', on);
      save();
    },

    term: el => {
      const open = !el.classList.contains('open');
      $$('#stage .term.open').forEach(t => { t.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); });
      el.classList.toggle('open', open);
      el.setAttribute('aria-expanded', open);
    },

    noop: () => {}
  };

  // The bar is redrawn on every page, so put focus back on the visible Back/Next
  function keepBarFocus(action) {
    const btn = $$(`#bar [data-action="${action}"]`).find(b => b.offsetParent && !b.disabled);
    if (btn) btn.focus({ preventScroll: true });
  }
  function refocus(sel) {
    const el = document.querySelector(sel);
    if (el && el.focus) {
      if (!el.matches('button, a, input, textarea, [tabindex]')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: false });
    }
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = A[el.dataset.action];
    if (!fn) return;
    if (el.tagName === 'A') e.preventDefault();
    fn(el);
  });

  // volume slider: changes narration and video loudness while dragging
  function setVolume(t) {
    const v = Math.max(0, Math.min(100, +t.value || 0));
    state.volume = v / 100;
    const vol = t.closest('.vol');
    if (vol) vol.style.setProperty('--v', v + '%');
    // dragging the slider up unmutes; dragging it to zero mutes
    const muted = v === 0;
    if (muted !== state.muted) {
      state.muted = muted;
      $('#bar').classList.toggle('is-muted', muted);
      $$('#bar .mute').forEach(b => { b.setAttribute('aria-pressed', muted); b.setAttribute('aria-label', muted ? 'Unmute narration' : 'Mute narration'); });
    }
    if (audio) { audio.volume = state.volume; audio.muted = state.muted; }
    syncVideos();
  }
  document.addEventListener('change', e => { if (e.target.classList && e.target.classList.contains('vol-range')) { setVolume(e.target); save(); } });

  document.addEventListener('input', e => {
    const t = e.target;
    if (t.classList && t.classList.contains('vol-range')) { setVolume(t); return; }
    if (t.id === 'learner-name') {
      state.learner.name = t.value;
      refresh();
    } else if (t.dataset && t.dataset.reflect) {
      state.responses[t.dataset.reflect] = t.value;
      save();
      const hint = $(`[data-count-for="${t.dataset.reflect}"]`);
      if (hint) hint.textContent = charHint(t.dataset.reflect);
      refresh();
    }
  });

  document.addEventListener('keydown', e => {
    const t = e.target;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if (e.key === 'Escape' && $('#exit-box')) { $('#exit-box').remove(); return; }
    if (e.key === 'Escape') {
      if (state.menuOpen) { setMenu(false); return; }
      const layer = $('#stage .layer:not([hidden])');
      if (layer) { A['layer-close'](layer.querySelector('.layer-close')); return; }
    }
    // SVG shapes acting as buttons respond to Enter and Space
    if ((e.key === 'Enter' || e.key === ' ') && t && t.namespaceURI === 'http://www.w3.org/2000/svg' && t.dataset && t.dataset.action) {
      e.preventDefault();
      const fn = A[t.dataset.action];
      if (fn) fn(t);
      return;
    }
    if (typing || state.menuOpen || e.altKey || e.ctrlKey || e.metaKey || cur().type === 'title') return;
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') go(step(state.index, -1));
  });

  window.addEventListener('hashchange', () => {
    const i = indexOfId(location.hash.slice(1));
    if (i !== -1 && i !== state.index && canVisit(i)) go(i);
  });

  /* ---------- Start ---------- */

  $('#brand-text').innerHTML = C.brand || C.title;
  $('#menu').setAttribute('aria-hidden', 'true');

  load();
  const fromHash = indexOfId(location.hash.slice(1));
  const start = fromHash !== -1 && canVisit(fromHash) ? fromHash : Math.min(state.index, pages.length - 1);
  go(canVisit(start) ? start : 0);
})();
