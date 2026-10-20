/* Målagården — Prisguiden ("Underlaget avgör priset").
   Jobb → underlag → storlek → vem är du → resultat (Målagårdens egna priser om de visas, annars "pris efter att vi sett underlaget")
   → ROT-räknare (Skatteverkets regler) → förfrågan med bilder till Kontrolpanelen (/api/mg/offert).
   Inga priser finns i koden: de hämtas från /api/mg/priser, där Målagården själva fyller i dem. */
import { JOBB, KUNDTYP, jobb as findJobb, rotFor, rotAvdrag, uppskatta, kr, tomPris, ROT } from './pg-def.js';

const root = document.getElementById('pg'), sumEl = document.getElementById('pg-sum');
const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const TEL = '072-001 01 79', WA = 'https://wa.me/46720010179';
let PRIS = tomPris();
const val = { jobb: '', underlag: '', delar: [], storlek: '', vetEj: false, kundtyp: '', agare: 1, beskrivning: '' };
const bilder = []; // { name, type, data (dataURL), w, h }
const t0 = Date.now();

function h(tag, attrs, kids) {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k]; if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'text') el.textContent = v; else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
  }
  (kids || []).forEach(c => { if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c)); });
  return el;
}
const clear = el => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

/* ---------- small illustrations of the surface ("underlag") ---------- */
const S = (inner) => `<svg viewBox="0 0 72 52" aria-hidden="true"><rect x="2" y="2" width="68" height="48" rx="6" fill="var(--bg2)" stroke="var(--line)"/>${inner}</svg>`;
const IKON = {
  slat: S('<rect x="10" y="10" width="52" height="32" rx="3" fill="var(--bg)" stroke="var(--line)"/><path d="M16 36h22" stroke="var(--gold-deep)" stroke-width="3" stroke-linecap="round"/>'),
  hal: S('<rect x="10" y="10" width="52" height="32" rx="3" fill="var(--bg)" stroke="var(--line)"/><circle cx="24" cy="22" r="2.6" fill="var(--muted)"/><circle cx="46" cy="30" r="2" fill="var(--muted)"/><path d="M34 12l-3 8 4 5-3 7" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linecap="round"/>'),
  ojamn: S('<path d="M10 20c8-6 14 4 22-2s14 6 30-2" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M10 32c10 5 16-5 26 1s16-4 26 1" fill="none" stroke="var(--muted)" stroke-width="2"/>'),
  tapet: S('<g stroke="var(--gold-deep)" stroke-width="2" opacity=".7"><path d="M16 10v32M26 10v32M36 10v32M46 10v22M56 10v18"/></g><path d="M44 30c6 0 12 4 16 12H44Z" fill="var(--bg)" stroke="var(--muted)"/>'),
  gips: S('<rect x="10" y="10" width="25" height="32" fill="var(--bg)" stroke="var(--muted)"/><rect x="37" y="10" width="25" height="32" fill="var(--bg)" stroke="var(--muted)"/><path d="M36 10v32" stroke="var(--gold-deep)" stroke-width="3"/><g fill="var(--muted)"><circle cx="14" cy="14" r="1"/><circle cx="31" cy="14" r="1"/><circle cx="14" cy="38" r="1"/><circle cx="31" cy="38" r="1"/></g>'),
  flagnar: S('<rect x="10" y="10" width="52" height="32" rx="3" fill="var(--gold)" opacity=".55"/><path d="M20 18l6 2-3 5-5-2Z M40 26l8 1-2 6-7-3Z M30 34l4 1-1 4-4-1Z" fill="var(--bg)" stroke="var(--muted)" stroke-width="1"/>'),
  pavaxt: S('<rect x="10" y="10" width="52" height="32" rx="3" fill="var(--bg)" stroke="var(--line)"/><g fill="#7c9a6a" opacity=".75"><circle cx="18" cy="36" r="5"/><circle cx="26" cy="39" r="4"/><circle cx="52" cy="16" r="4"/><circle cx="46" cy="38" r="3"/></g>'),
  tra: S('<g stroke="var(--muted)" stroke-width="1.5"><path d="M10 12h52M10 22h52M10 32h52M10 42h52"/></g><path d="M40 24c3 2 6 1 8 4s-2 5 1 8" fill="none" stroke="var(--bad)" stroke-width="2" stroke-linecap="round"/>'),
  riva: S('<path d="M10 34h52v8H10z" fill="var(--bg3)"/><path d="M12 30l10-6 8 5 10-7 8 4 12-6" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linejoin="round"/><path d="M14 18l6-6M50 16l6 4" stroke="var(--gold-deep)" stroke-width="2" stroke-linecap="round"/>'),
  jord: S('<path d="M8 30c10-4 20 2 30-2s18 2 26 0v16H8Z" fill="#a98a63" opacity=".55"/><g stroke="#6d8c5a" stroke-width="2" stroke-linecap="round"><path d="M16 26v-6M20 27v-8M48 25v-6M53 25v-9"/></g>'),
  plattor: S('<g fill="var(--bg)" stroke="var(--muted)"><rect x="10" y="14" width="16" height="12"/><rect x="28" y="14" width="16" height="12"/><rect x="46" y="14" width="16" height="12"/><rect x="10" y="28" width="16" height="12"/><rect x="46" y="28" width="16" height="12"/></g><rect x="28" y="30" width="16" height="12" fill="var(--gold)" opacity=".6" transform="rotate(-12 36 36)"/>'),
  lutning: S('<path d="M8 40L64 26v18H8Z" fill="var(--bg3)" stroke="var(--muted)"/><path d="M14 22h44" stroke="var(--gold-deep)" stroke-width="2" stroke-dasharray="4 3"/>'),
  kalender: S('<rect x="20" y="12" width="32" height="30" rx="4" fill="var(--bg)" stroke="var(--muted)"/><path d="M20 20h32M28 9v6M44 9v6" stroke="var(--muted)" stroke-width="2"/><path d="M28 30l4 4 8-8" fill="none" stroke="var(--gold-deep)" stroke-width="2.4" stroke-linecap="round"/>'),
  spade: S('<path d="M36 10v20" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/><path d="M28 30h16l-2 10c-1 3-11 3-12 0Z" fill="var(--gold)" opacity=".8"/><path d="M14 44h44" stroke="#6d8c5a" stroke-width="2"/>'),
  vetej: S('<text x="36" y="34" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="22" fill="var(--muted)">?</text>'),
};

/* ---------- steps ---------- */
const steps = {};
function step(n, title, sub) {
  const box = h('section', { class: 'pg-step', 'data-n': n, 'aria-labelledby': 'pg-h' + n });
  box.append(h('div', { class: 'pg-step-head' }, [h('span', { class: 'pg-n', text: String(n) }), h('div', null, [h('h2', { id: 'pg-h' + n, text: title }), sub ? h('p', { text: sub }) : null])]));
  const body = h('div', { class: 'pg-step-body' });
  box.append(body); root.append(box); steps[n] = { box, body };
  return body;
}
function lock() {
  const ok1 = !!val.jobb, j = findJobb(val.jobb);
  const ok2 = ok1 && !!val.underlag;
  const ok3 = ok2 && (!j || !j.enhet || val.vetEj || Number(val.storlek) > 0) && !!val.kundtyp;
  steps[2].box.classList.toggle('locked', !ok1);
  steps[3].box.classList.toggle('locked', !ok2);
  steps[4].box.classList.toggle('locked', !ok3);
  steps[5].box.classList.toggle('locked', !ok3);
  [2, 3, 4, 5].forEach(n => { const l = steps[n].box.classList.contains('locked'); steps[n].box.inert = l; steps[n].box.setAttribute('aria-disabled', l ? 'true' : 'false'); });
}
const go = n => { const el = steps[n] && steps[n].box; if (!el) return; setTimeout(() => el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }), 60); };

/* 1. job */
function renderJobb() {
  const b = clear(steps[1].body);
  const grid = h('div', { class: 'pg-jobs', role: 'radiogroup', 'aria-labelledby': 'pg-h1' });
  JOBB.forEach(j => {
    const id = 'pgj-' + j.id;
    const inp = h('input', { type: 'radio', name: 'pg-jobb', id, value: j.id, class: 'sr' });
    if (val.jobb === j.id) inp.checked = true;
    inp.addEventListener('change', () => { val.jobb = j.id; val.underlag = ''; val.delar = []; val.storlek = ''; val.vetEj = false; renderUnderlag(); renderStorlek(); update(); go(2); });
    grid.append(h('label', { class: 'pg-job', for: id }, [inp,
      h('span', { class: 'pg-job-img' }, [h('img', { src: `/img/${j.bild}-480.webp`, alt: '', loading: 'lazy', width: 480, height: 360 })]),
      h('span', { class: 'pg-job-t' }, [h('b', { text: j.namn }), h('small', { text: j.kort })])]));
  });
  b.append(grid);
}

/* 2. underlag */
function renderUnderlag() {
  const b = clear(steps[2].body), j = findJobb(val.jobb);
  if (!j) { b.append(h('p', { class: 'pg-hint', text: 'Välj först vad du vill få gjort.' })); return; }
  const grid = h('div', { class: 'pg-opts', role: 'radiogroup', 'aria-labelledby': 'pg-h2' });
  [...j.underlag, { id: 'vetej', t: 'Vet inte', s: 'Skicka bilder, så bedömer vi underlaget åt dig.', ikon: 'vetej' }].forEach(u => {
    const id = 'pgu-' + u.id;
    const inp = h('input', { type: 'radio', name: 'pg-underlag', id, value: u.id, class: 'sr' });
    if (val.underlag === u.id) inp.checked = true;
    inp.addEventListener('change', () => { val.underlag = u.id; update(); if (!steps[3].box.dataset.seen) { steps[3].box.dataset.seen = 1; go(3); } });
    grid.append(h('label', { class: 'pg-opt', for: id }, [inp, h('span', { class: 'pg-ikon', html: IKON[u.ikon] || IKON.slat }), h('span', { class: 'pg-opt-t' }, [h('b', { text: u.t }), h('small', { text: u.s })])]));
  });
  b.append(grid);
  if (j.delar && j.delar.length) {
    const fs = h('fieldset', { class: 'pg-delar' }, [h('legend', { text: j.id === 'golv' ? 'Vilket golv?' : j.id === 'mark' || j.id === 'service' ? 'Vad gäller det?' : 'Vad ska göras?' })]);
    j.delar.forEach((d, i) => {
      const id = 'pgd-' + i;
      const inp = h('input', { type: 'checkbox', id, value: d });
      inp.checked = val.delar.includes(d);
      inp.addEventListener('change', () => { val.delar = [...fs.querySelectorAll('input:checked')].map(x => x.value); update(); });
      fs.append(h('label', { class: 'pg-check', for: id }, [inp, h('span', { text: d })]));
    });
    b.append(fs);
  }
}

/* 3. size + who */
function renderStorlek() {
  const b = clear(steps[3].body), j = findJobb(val.jobb);
  if (!j) return;
  if (j.enhet) {
    const wrap = h('div', { class: 'pg-size' });
    wrap.append(h('p', { class: 'pg-label', text: `Ungefär hur stort? (${j.enhetLang})` }));
    const chips = h('div', { class: 'pg-chips' });
    const num = h('input', { type: 'number', inputmode: 'numeric', min: 1, max: 5000, step: 1, id: 'pg-m2', class: 'pg-num', value: val.storlek || '', 'aria-label': `Storlek i ${j.enhetLang}` });
    const vet = h('input', { type: 'checkbox', id: 'pg-vetej' }); vet.checked = val.vetEj;
    j.storlekar.forEach(s => chips.append(h('button', { type: 'button', class: 'chip', 'aria-pressed': String(Number(val.storlek) === s.v), onclick: () => { val.storlek = String(s.v); val.vetEj = false; num.value = s.v; vet.checked = false; syncChips(); update(); } }, [h('b', { text: s.t }), ' ', h('span', { text: s.s })])));
    const syncChips = () => chips.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', String(Number(val.storlek) === j.storlekar[i].v)));
    num.addEventListener('input', () => { val.storlek = num.value; if (num.value) { val.vetEj = false; vet.checked = false; } syncChips(); update(); });
    vet.addEventListener('change', () => { val.vetEj = vet.checked; if (vet.checked) { val.storlek = ''; num.value = ''; } syncChips(); update(); });
    wrap.append(chips, h('div', { class: 'pg-numrow' }, [h('label', { for: 'pg-m2', class: 'sr', text: 'Antal ' + j.enhetLang }), num, h('span', { class: 'pg-unit', text: j.enhet }),
      h('label', { class: 'pg-check', for: 'pg-vetej' }, [vet, h('span', { text: 'Vet inte, ni får mäta på plats' })])]));
    b.append(wrap);
  } else {
    const ta = h('textarea', { id: 'pg-besk', rows: 3, maxlength: 1500, placeholder: 'Till exempel: klippa häcken två gånger per år, eller plantera thujor längs tomtgränsen.' });
    ta.value = val.beskrivning;
    ta.addEventListener('input', () => { val.beskrivning = ta.value; update(); });
    b.append(h('div', { class: 'pg-field' }, [h('label', { for: 'pg-besk', text: 'Beskriv kort vad du behöver hjälp med' }), ta]));
  }
  b.append(h('p', { class: 'pg-label', text: 'Vem är du?' }));
  const kt = h('div', { class: 'pg-kund', role: 'radiogroup', 'aria-label': 'Vem är du?' });
  KUNDTYP.forEach(k => {
    const id = 'pgk-' + k.id;
    const inp = h('input', { type: 'radio', name: 'pg-kund', id, value: k.id, class: 'sr' });
    if (val.kundtyp === k.id) inp.checked = true;
    inp.addEventListener('change', () => { val.kundtyp = k.id; renderAgare(); update(); });
    kt.append(h('label', { class: 'pg-k', for: id }, [inp, h('b', { text: k.t }), h('small', { text: k.s })]));
  });
  b.append(kt, h('div', { id: 'pg-agare' }));
  renderAgare();
}
function renderAgare() {
  const el = document.getElementById('pg-agare'); if (!el) return; clear(el);
  if (rotFor(val.jobb, val.kundtyp).svar !== 'ja') return;
  el.append(h('p', { class: 'pg-label', text: 'Hur många äger bostaden?' }));
  const row = h('div', { class: 'pg-chips' });
  [1, 2].forEach(n => row.append(h('button', { type: 'button', class: 'chip', 'aria-pressed': String(val.agare === n), onclick: () => { val.agare = n; row.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', String(i + 1 === n))); update(); } }, [n === 1 ? 'En ägare' : 'Två ägare'])));
  el.append(row, h('p', { class: 'pg-hint', text: 'ROT-avdraget är högst 50 000 kr per person och år. Är ni två ägare kan ni dela på avdraget.' }));
}

/* 4. result + ROT calculator */
let rotInput = null;
function countTo(el, to) {
  if (reduce) { el.textContent = kr(to); return; }
  const from = Number(el.dataset.v || 0), start = performance.now(), ms = 700;
  el.dataset.v = to;
  const tick = now => { const t = Math.min(1, (now - start) / ms), e = 1 - Math.pow(1 - t, 3); el.textContent = kr(from + (to - from) * e); if (t < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function renderResultat() {
  const b = clear(steps[4].body), j = findJobb(val.jobb);
  if (!j) return;
  const u = j.underlag.find(x => x.id === val.underlag);
  const est = uppskatta(PRIS, val);
  const card = h('div', { class: 'pg-result' });
  if (est) {
    card.append(h('p', { class: 'pg-eyebrow', text: 'Ungefärligt pris för ' + j.namn.toLowerCase() }),
      h('p', { class: 'pg-price' }, [h('span', { 'data-v': 0, class: 'pg-a' }), h('span', { class: 'pg-dash', text: ' – ' }), h('span', { 'data-v': 0, class: 'pg-b' })]));
    if (est.rot) card.append(h('p', { class: 'pg-after' }, ['Efter ROT-avdrag ca ', h('b', { text: kr(est.rot.fran) + ' – ' + kr(est.rot.till) }), est.rot.taket ? ' (taket på ROT-avdraget är nått)' : '']));
    card.append(h('p', { class: 'pg-fine', text: 'Ett riktpris från Målagårdens egna priser, inklusive moms. Det exakta priset står i offerten, när vi har sett underlaget.' }));
    requestAnimationFrame(() => { countTo(card.querySelector('.pg-a'), est.fran); countTo(card.querySelector('.pg-b'), est.till); });
  } else {
    card.append(h('p', { class: 'pg-eyebrow', text: 'Ditt pris' }),
      h('p', { class: 'pg-price pg-price-txt', text: 'Sätts när vi har sett underlaget.' }),
      h('p', { class: 'pg-fine', text: 'Det är underlaget som avgör hur mycket arbete jobbet kräver. Skicka gärna några bilder och en kort beskrivning, så återkommer vi för att gå igenom arbetet och lämna en tydlig offert.' }));
  }
  const why = h('ul', { class: 'pg-why' });
  if (u) why.append(h('li', null, [h('b', { text: 'Underlaget: ' }), u.t + '. ' + u.s]));
  else if (val.underlag === 'vetej') why.append(h('li', null, [h('b', { text: 'Underlaget: ' }), 'Vi bedömer det från dina bilder eller på plats.']));
  if (j.enhet) why.append(h('li', null, [h('b', { text: 'Storleken: ' }), val.vetEj || !(Number(val.storlek) > 0) ? 'Vi mäter på plats.' : `ca ${Number(val.storlek)} ${j.enhetLang}.`]));
  if (val.delar.length) why.append(h('li', null, [h('b', { text: 'Det gäller: ' }), val.delar.join(', ') + '.']));
  why.append(h('li', null, [h('b', { text: 'Material: ' }), 'Färg, skivor, golv och sten beror på vad du väljer. Det står för sig i offerten.']));
  card.append(h('p', { class: 'pg-label', text: 'Det här påverkar priset' }), why);
  b.append(card);

  // ROT
  const rot = rotFor(val.jobb, val.kundtyp);
  const rc = h('div', { class: 'pg-rot pg-rot-' + rot.svar });
  rc.append(h('div', { class: 'pg-rot-head' }, [h('span', { class: 'pg-rot-badge', text: rot.svar === 'ja' ? 'ROT-avdrag gäller' : rot.svar === 'nej' ? 'Inget ROT-avdrag' : 'ROT kan gälla' }), h('p', { text: rot.varfor })]));
  if (rot.svar !== 'nej') {
    const p = PRIS.jobb && PRIS.jobb[val.jobb];
    const start = est && p && p.arbete > 0 ? Math.round(((est.fran + est.till) / 2) * p.arbete / 100) : '';
    rotInput = h('input', { type: 'number', inputmode: 'numeric', min: 0, max: 2000000, step: 100, id: 'pg-arb', class: 'pg-num', value: start, placeholder: 'Belopp från offerten' });
    const out = h('div', { class: 'pg-rot-out', 'aria-live': 'polite' });
    const calc = () => {
      clear(out);
      const a = Number(rotInput.value);
      if (!(a > 0)) { out.append(h('p', { class: 'pg-hint', text: 'Skriv arbetskostnaden inklusive moms, så räknar vi ut avdraget.' })); return; }
      const r = rotAvdrag(a, val.agare);
      out.append(h('div', { class: 'pg-rot-nums' }, [
        h('div', null, [h('small', { text: 'ROT-avdrag (30 %)' }), h('b', { class: 'pg-minus', text: '− ' + kr(r.avdrag) })]),
        h('div', null, [h('small', { text: 'Du betalar för arbetet' }), h('b', { text: kr(a - r.avdrag) })]),
      ]));
      if (r.taket) out.append(h('p', { class: 'pg-hint', text: `Avdraget stannar vid ${kr(r.max)}, taket för ${val.agare === 2 ? 'två ägare' : 'en ägare'} per år.` }));
      out.append(h('p', { class: 'pg-hint', text: 'Material och resor ger inget avdrag och betalas fullt ut.' }));
    };
    rotInput.addEventListener('input', calc);
    rc.append(h('div', { class: 'pg-rot-calc' }, [h('label', { for: 'pg-arb', text: 'Räkna själv: arbetskostnad i kr inkl. moms' }), h('div', { class: 'pg-numrow' }, [rotInput, h('span', { class: 'pg-unit', text: 'kr' })]), out]));
    calc();
  }
  b.append(rc);
}

/* 5. request with photos */
function renderForm() {
  const b = clear(steps[5].body);
  const form = h('form', { class: 'pg-form', novalidate: true });
  const drop = h('label', { class: 'pg-drop', for: 'pg-files' }, [
    h('span', { class: 'pg-drop-ic', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3"/></svg>' }),
    h('b', { text: 'Lägg till bilder på underlaget' }), h('small', { text: 'Ta bilder med mobilen eller välj från datorn. Upp till 6 bilder.' })]);
  const files = h('input', { type: 'file', id: 'pg-files', accept: 'image/*', multiple: true, class: 'sr' });
  const thumbs = h('div', { class: 'pg-thumbs' });
  const status = h('p', { class: 'pg-hint', 'aria-live': 'polite' });
  const drawThumbs = () => {
    clear(thumbs);
    bilder.forEach((im, i) => thumbs.append(h('figure', null, [h('img', { src: im.data, alt: 'Bild ' + (i + 1) }), h('button', { type: 'button', 'aria-label': 'Ta bort bild ' + (i + 1), text: '×', onclick: () => { bilder.splice(i, 1); drawThumbs(); update(); } })])));
    drop.classList.toggle('has', bilder.length > 0);
  };
  const add = async list => {
    for (const f of [...list]) {
      if (bilder.length >= 6) { status.textContent = 'Max 6 bilder.'; break; }
      if (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(f.name)) continue;
      status.textContent = 'Förbereder bild …';
      try { bilder.push(await shrink(f)); status.textContent = ''; }
      catch { status.textContent = 'En bild kunde inte läsas. Prova att välja den igen, eller skicka den på WhatsApp.'; }
      drawThumbs(); update();
    }
  };
  files.addEventListener('change', () => { add(files.files); files.value = ''; });
  ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => add(e.dataTransfer.files));

  const f = (id, label, type, ac, req, extra = {}) => {
    const inp = h('input', { id, name: id, type, autocomplete: ac, required: req, ...extra });
    const err = h('span', { class: 'pg-err', id: id + '-err' });
    inp.setAttribute('aria-describedby', id + '-err');
    inp.addEventListener('blur', () => check(inp));
    return h('div', { class: 'pg-field' }, [h('label', { for: id, text: label + (req ? '' : ' (valfritt)') }), inp, err]);
  };
  const when = h('div', { class: 'pg-chips', role: 'radiogroup', 'aria-label': 'När vill du ha jobbet gjort?' });
  let naar = '';
  ['Så snart som möjligt', 'Inom 3 månader', 'Jag planerar'].forEach(t => when.append(h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: e => { naar = t; when.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === e.currentTarget))); } }, [t])));
  const msg = h('textarea', { id: 'pg-msg', rows: 4, maxlength: 3000, placeholder: 'Något mer vi bör veta? Till exempel färgval, tillgänglighet eller när du är hemma.' });
  const hp = h('div', { class: 'hp', 'aria-hidden': 'true' }, [h('label', { for: 'pg-web', text: 'Lämna tomt' }), h('input', { id: 'pg-web', name: 'website', tabindex: '-1', autocomplete: 'off' })]);
  const send = h('button', { type: 'submit', class: 'btn btn-gold pg-send' }, ['Skicka förfrågan till Målagården']);
  const formErr = h('div', { class: 'pg-formerr', 'aria-live': 'assertive' });

  form.append(h('p', { class: 'pg-label', text: 'Bilder säger mest om underlaget' }), drop, files, thumbs, status,
    h('div', { class: 'pg-grid2' }, [f('pg-namn', 'Namn', 'text', 'name', true), f('pg-tel', 'Telefon', 'tel', 'tel', true)]),
    h('div', { class: 'pg-grid2' }, [f('pg-mail', 'E-post', 'email', 'email', false), f('pg-ort', 'Adress eller ort där jobbet ska göras', 'text', 'street-address', true)]),
    h('p', { class: 'pg-label', text: 'När vill du ha jobbet gjort?' }), when,
    h('div', { class: 'pg-field' }, [h('label', { for: 'pg-msg', text: 'Meddelande (valfritt)' }), msg]), hp,
    h('p', { class: 'pg-fine', html: 'Vi använder uppgifterna bara för att svara på din förfrågan. Läs mer i vår <a href="/privatlivspolitik">integritetspolicy</a>.' }),
    formErr, send);
  form.addEventListener('submit', async e => {
    e.preventDefault(); clear(formErr);
    const bad = [...form.querySelectorAll('input[required]')].filter(i => !check(i));
    const mail = form.querySelector('#pg-mail'); if (!check(mail)) bad.push(mail);
    if (bad.length) { bad[0].focus(); return; }
    send.disabled = true; send.textContent = bilder.length ? `Skickar ${bilder.length} ${bilder.length === 1 ? 'bild' : 'bilder'} …` : 'Skickar …';
    const payload = {
      ...val, delar: val.delar, naar, namn: form.querySelector('#pg-namn').value, telefon: form.querySelector('#pg-tel').value, email: mail.value,
      ort: form.querySelector('#pg-ort').value, meddelande: msg.value, website: form.querySelector('#pg-web').value, t: Date.now() - t0,
      uppskattning: (() => { const x = uppskatta(PRIS, val); return x ? { fran: x.fran, till: x.till } : null; })(),
      bilder: bilder.map(x => ({ name: x.name, data: x.data })),
    };
    // GitHub Pages har ingen egen server. FormSubmit skickar därför förfrågan
    // direkt till Målagårdens e-postadress.
    let r;
    try {
      const mailPayload = {
        _subject: 'Ny offertförfrågan från malagorden.se',
        _template: 'table',
        _replyto: payload.email || '',
        namn: payload.namn,
        telefon: payload.telefon,
        'kundens e-post': payload.email || 'Ej angiven',
        'adress eller ort': payload.ort,
        'typ av arbete': (findJobb(payload.jobb) || {}).namn || 'Ej angivet',
        underlag: ((findJobb(payload.jobb) || {}).underlag || []).find(x => x.id === payload.underlag)?.t || 'Ej angivet',
        'vad jobbet gäller': payload.delar.join(', ') || 'Ej angivet',
        storlek: payload.storlek ? `${payload.storlek} m²` : 'Bedöms på plats',
        'önskad tid': payload.naar || 'Ej angiven',
        meddelande: payload.meddelande || 'Inget ytterligare meddelande',
        'bilder skickas via': payload.bilder.length ? 'WhatsApp eller telefon – bilder kan inte bifogas i detta formulär.' : 'Inga bilder bifogade.'
      };
      r = await fetch('https://formsubmit.co/ajax/info@malagorden.se', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(mailPayload)
      }).then(x => x.ok ? x.json() : Promise.reject(new Error('E-posttjänsten svarade inte.')));
    } catch { r = { ok: false, fejl: 'Kunde inte skicka förfrågan.' }; }
    if (r && (r.success === 'true' || r.success === true || r.ok)) return done(payload);
    send.disabled = false; send.textContent = 'Försök skicka igen';
    formErr.append(h('p', { text: (r && r.fejl ? r.fejl + ' ' : '') + 'Du kan också ringa oss eller skicka bilderna på WhatsApp.' }),
      h('div', { class: 'pg-alt' }, [h('a', { class: 'btn btn-line', href: 'tel:+46720010179', text: 'Ring ' + TEL }), h('a', { class: 'btn btn-line', href: WA, target: '_blank', rel: 'noopener', text: 'WhatsApp' }),
        h('button', { type: 'button', class: 'btn btn-line', text: 'Kopiera förfrågan', onclick: ev => { navigator.clipboard && navigator.clipboard.writeText(sammanfattning(payload)).then(() => { ev.target.textContent = 'Kopierad ✓'; }); } })]));
  });
  b.append(form);
}
function check(inp) {
  const err = document.getElementById(inp.id + '-err'); let m = '';
  const v = inp.value.trim();
  if (inp.required && !v) m = 'Fyll i det här fältet.';
  else if (inp.type === 'tel' && v && v.replace(/\D/g, '').length < 7) m = 'Telefonnumret ser för kort ut.';
  else if (inp.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) m = 'E-postadressen ser inte rätt ut.';
  if (err) err.textContent = m;
  inp.setAttribute('aria-invalid', m ? 'true' : 'false');
  return !m;
}
function sammanfattning(p) {
  const j = findJobb(p.jobb), u = j && j.underlag.find(x => x.id === p.underlag);
  return [`Förfrågan till Målagården`, `Jobb: ${j ? j.namn : ''}`, `Underlag: ${u ? u.t : 'Vet inte'}`, p.delar.length ? `Gäller: ${p.delar.join(', ')}` : '', j && j.enhet ? `Storlek: ${p.vetEj || !p.storlek ? 'mäts på plats' : p.storlek + ' ' + j.enhetLang}` : `Beskrivning: ${p.beskrivning}`,
    `Kund: ${(KUNDTYP.find(k => k.id === p.kundtyp) || {}).t || ''}`, `Namn: ${p.namn}`, `Telefon: ${p.telefon}`, p.email ? `E-post: ${p.email}` : '', `Plats: ${p.ort}`, p.naar ? `När: ${p.naar}` : '', p.meddelande ? `\n${p.meddelande}` : ''].filter(Boolean).join('\n');
}
function done(p) {
  const j = findJobb(p.jobb);
  root.querySelectorAll('.pg-step').forEach(s => { s.hidden = true; });
  const box = h('section', { class: 'pg-done', tabindex: '-1' }, [
    h('span', { class: 'pg-done-ic', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' }),
    h('h2', { text: `Tack ${p.namn.split(' ')[0]}! Vi har fått din förfrågan.` }),
    h('p', { class: 'lead', text: `Målagården har fått allt om ${j ? j.namn.toLowerCase() : 'jobbet'}${p.bilder.length ? ` och dina ${p.bilder.length} ${p.bilder.length === 1 ? 'bild' : 'bilder'}` : ''}. Vi återkommer för att gå igenom arbetet och lämna en tydlig offert.` }),
    h('p', null, ['Vill du lägga till något? Ring ', h('a', { href: 'tel:+46720010179', text: TEL }), ' eller skicka fler bilder på ', h('a', { href: WA, target: '_blank', rel: 'noopener', text: 'WhatsApp' }), '.']),
  ]);
  root.append(box); box.focus(); box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  sumEl.classList.add('sent');
}

/* downscale a photo in the browser: max 1600 px, JPEG ~0.8 → small enough to send, EXIF/GPS dropped by the canvas */
function shrink(file) {
  return new Promise((ok, fail) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      const max = 1600, s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
      const w = Math.round(im.naturalWidth * s), hh = Math.round(im.naturalHeight * s);
      const c = document.createElement('canvas'); c.width = w; c.height = hh;
      c.getContext('2d').drawImage(im, 0, 0, w, hh); URL.revokeObjectURL(url);
      let q = 0.8, data = c.toDataURL('image/jpeg', q);
      while (data.length > 520000 && q > 0.45) { q -= 0.1; data = c.toDataURL('image/jpeg', q); }
      ok({ name: file.name.replace(/\.[^.]+$/, '') + '.jpg', data, w, h: hh });
    };
    im.onerror = () => { URL.revokeObjectURL(url); fail(new Error('read')); };
    im.src = url;
  });
}

/* live summary (sticky on desktop) */
let lastKey = '';
function update() {
  lock();
  const key = JSON.stringify([val, PRIS]);
  if (!steps[4].box.classList.contains('locked') && key !== lastKey) { lastKey = key; renderResultat(); }
  const j = findJobb(val.jobb), u = j && j.underlag.find(x => x.id === val.underlag), k = KUNDTYP.find(x => x.id === val.kundtyp);
  clear(sumEl);
  sumEl.append(h('p', { class: 'pg-sum-t', text: 'Det här får Målagården' }));
  const rows = [
    ['Jobb', j ? j.namn : null], ['Underlag', u ? u.t : val.underlag === 'vetej' ? 'Vet inte, bedöms från bilder' : null],
    ['Gäller', val.delar.length ? val.delar.join(', ') : null],
    ['Storlek', j && j.enhet ? (val.vetEj ? 'Mäts på plats' : Number(val.storlek) > 0 ? `${Number(val.storlek)} ${j.enhetLang}` : null) : (val.beskrivning ? 'Beskrivning finns' : null)],
    ['Kund', k ? k.t : null], ['ROT', val.jobb && val.kundtyp ? ({ ja: 'Gäller', nej: 'Gäller inte', kanske: 'Vi återkommer' })[rotFor(val.jobb, val.kundtyp).svar] : null],
    ['Bilder', bilder.length ? String(bilder.length) : null],
  ];
  const dl = h('dl');
  rows.forEach(([a, b]) => dl.append(h('div', { class: b ? 'on' : '' }, [h('dt', { text: a }), h('dd', { text: b || '–' })])));
  sumEl.append(dl);
  const est = uppskatta(PRIS, val);
  if (est) sumEl.append(h('p', { class: 'pg-sum-price' }, [h('small', { text: 'Riktpris' }), h('b', { text: kr(est.fran) + ' – ' + kr(est.till) })]));
  const next = !val.jobb ? 1 : !val.underlag ? 2 : steps[4].box.classList.contains('locked') ? 3 : 5;
  sumEl.append(h('a', { class: 'btn btn-gold pg-sum-go', href: '#pg-h' + next, onclick: e => { e.preventDefault(); go(next); } }, [next === 5 ? 'Skicka med bilder' : 'Fortsätt till steg ' + next]));
}

/* boot */
step(1, 'Vad vill du få gjort?', 'Välj det som passar bäst. Du kan berätta mer längre ner.');
step(2, 'Hur ser underlaget ut i dag?', 'Det är här priset avgörs. Välj det som liknar ytan mest.');
step(3, 'Hur stort är jobbet, och vem är du?', 'En ungefärlig storlek räcker.');
step(4, 'Vad det betyder för priset', '');
step(5, 'Skicka förfrågan med bilder', 'Gratis och utan förpliktelser. Vi återkommer med en tydlig offert före start.');
renderJobb(); renderUnderlag(); renderStorlek(); renderForm();
const q = new URLSearchParams(location.search).get('jobb');
if (q && findJobb(q)) { val.jobb = q; renderJobb(); renderUnderlag(); renderStorlek(); }
update();
fetch('/api/mg/priser', { headers: { accept: 'application/json' } }).then(r => (r.ok ? r.json() : null)).then(d => { if (d && d.ok && d.pris) { PRIS = d.pris; update(); } }).catch(() => {});
window.__pg = { val, ROT };
