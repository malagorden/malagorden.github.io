/* Målagården — små beteenden: meny, header-skugga, reveal, lightbox, filter, steg-bilder, kopiera adress. */
(function () {
  'use strict';
  var hdr = document.getElementById('hdr');
  var btn = document.querySelector('.menu-btn');
  if (btn && hdr) {
    btn.addEventListener('click', function () {
      var open = hdr.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Stäng' : 'Meny';
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr.classList.contains('open')) { btn.click(); btn.focus(); } });
  }
  var onScroll = function () { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // reveal on scroll
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // hide the mobile action bar over the footer / contact block
  var mbar = document.getElementById('mbar'), ftr = document.querySelector('.ftr');
  if (mbar && ftr && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { mbar.classList.toggle('hide', es[0].isIntersecting); }).observe(ftr);
  }

  // lightbox
  var lb;
  function openLb(src, alt, cap) {
    if (!lb) {
      lb = document.createElement('dialog'); lb.className = 'lb'; lb.setAttribute('aria-label', 'Förstorad bild');
      lb.innerHTML = '<button class="lb-x" type="button" aria-label="Stäng bild">×</button><img alt=""><p></p>';
      document.body.appendChild(lb);
      lb.querySelector('.lb-x').addEventListener('click', function () { lb.close(); });
      lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    }
    var im = lb.querySelector('img'); im.src = src; im.alt = alt || '';
    lb.querySelector('p').textContent = cap || '';
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
  }
  document.querySelectorAll('[data-lightbox]').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !g.contains(b)) return;
      var im = b.querySelector('img'); if (!im) return;
      var big = (im.getAttribute('srcset') || '').split(',').map(function (s) { return s.trim().split(' ')[0]; }).pop() || im.src;
      openLb(big, im.alt, b.getAttribute('data-cap'));
    });
  });

  // filters on /vara-arbeten
  var fl = document.querySelector('[data-filters]');
  if (fl) fl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    var f = b.getAttribute('data-f');
    fl.querySelectorAll('[data-f]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    document.querySelectorAll('.work').forEach(function (w) { w.hidden = !(f === 'alla' || w.getAttribute('data-k') === f); if (!w.hidden) w.classList.add('in'); });
  });

  // stages (gips -> målning -> underlag -> golv)
  document.querySelectorAll('[data-stages]').forEach(function (st) {
    var imgs = st.querySelectorAll('.stages-img img'), tabs = st.querySelectorAll('[role=tab]');
    function show(i) {
      imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        e.preventDefault(); var n = (i + d + tabs.length) % tabs.length; show(n); tabs[n].focus();
      });
    });
    show(0);
  });

  // copy e-mail address (the site never opens a mail program)
  var toastT;
  function toast(t) {
    var el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2600);
  }
  window.mgToast = toast;
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var v = b.getAttribute('data-copy');
    var done = function () { var o = b.textContent; b.textContent = 'Kopierad ✓'; toast('Adressen är kopierad: ' + v); setTimeout(function () { b.textContent = o; }, 2200); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, function () { toast(v); });
    else toast(v);
  });
})();
