/* Cookie-samtycke (svenska). Ingen afhængigheder. ES2019-sikker.
   Intet sporings-script kører før samtykke: statistik (spor.js) indlæses først, når besøgende har valgt Acceptér eller slået Statistik til. */
(function () {
  'use strict';
  var KEY = 'cc_samtykke', STAT = 'https://dash.midasflow.online/spor.js';
  function hent() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function gem(stat) { try { localStorage.setItem(KEY, JSON.stringify({ v: 1, stat: !!stat, t: Date.now() })); } catch (e) { } }
  function startStat() {
    if (window.__ccStat) return; window.__ccStat = 1;
    var s = document.createElement('script'); s.src = STAT; s.defer = true; document.head.appendChild(s);
  }
  var gemt = hent();
  if (gemt && gemt.stat) startStat();

  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'cookie.css'; document.head.appendChild(css);
  var box;
  function luk() { if (box) { box.remove(); box = null; } }
  function vaelg(stat) { gem(stat); if (stat) startStat(); luk(); }
  function vis(visIndstillinger) {
    luk();
    box = document.createElement('div'); box.className = 'cc-box'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Cookie-samtycke');
    var cur = hent();
    box.innerHTML =
      '<div class="cc-in"><h2 class="cc-h">Vi använder cookies</h2>' +
      '<p class="cc-p">Vi använder bara det som behövs för att webbplatsen ska fungera. Med ditt samtycke mäter vi också hur många som besöker sidan, så att vi kan förbättra den. Du kan alltid ändra ditt val. Läs mer i vår <a href="/cookiepolitik">cookiepolicy</a> och <a href="/privatlivspolitik">integritetspolicy</a>.</p>' +
      (visIndstillinger ? '<div class="cc-ind"><label class="cc-r"><input type="checkbox" checked disabled><span><b>Nödvändiga</b><small>Kommer ihåg ditt cookieval. Kan inte stängas av.</small></span></label>' +
        '<label class="cc-r"><input type="checkbox" id="cc-stat"' + (cur && cur.stat ? ' checked' : '') + '><span><b>Statistik</b><small>Anonym mätning av sidvisningar, källa och tid på sidan. Ingen spårning mellan webbplatser.</small></span></label></div>' : '') +
      '<div class="cc-knapper">' +
      '<button type="button" class="cc-b" data-cc="ja">Acceptera</button>' +
      '<button type="button" class="cc-b" data-cc="nej">Endast nödvändiga</button>' +
      (visIndstillinger ? '<button type="button" class="cc-b" data-cc="gem">Spara val</button>' : '<button type="button" class="cc-b" data-cc="ind">Inställningar</button>') +
      '</div></div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]'); if (!b) return; var k = b.getAttribute('data-cc');
      if (k === 'ja') vaelg(true); else if (k === 'nej') vaelg(false);
      else if (k === 'ind') vis(true); else if (k === 'gem') vaelg(!!document.getElementById('cc-stat').checked);
    });
    document.body.appendChild(box);
  }
  function fodlinks() {
    var html = '<a href="/privatlivspolitik">Integritetspolicy</a> · <a href="/cookiepolitik">Cookiepolicy</a> · <a href="#" data-cc-aabn>Cookie-inställningar</a>';
    var f = document.querySelector('footer');
    var d = document.createElement('div'); d.className = 'cc-fod'; d.innerHTML = html;
    if (f) f.appendChild(d); else document.body.appendChild(d);
  }
  document.addEventListener('click', function (e) { var a = e.target.closest('[data-cc-aabn]'); if (a) { e.preventDefault(); vis(true); } });
  function start() { fodlinks(); if (!gemt) vis(false); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
