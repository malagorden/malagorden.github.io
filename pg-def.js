export const ROT = { andel: 0.30, maxPerPerson: 50000 };

export const JOBB = [
  {
    id: 'invandig', namn: 'Invändig målning', kort: 'Väggar, tak och snickerier', bild: 'toftaholm-konferensrum',
    enhet: 'm²', enhetLang: 'm² golvyta', rot: 'inne',
    storlekar: [{ v: 15, t: 'Ett rum', s: 'ca 15 m²' }, { v: 40, t: '2–3 rum', s: 'ca 40 m²' }, { v: 90, t: 'Hela bostaden', s: 'ca 90 m²' }],
    delar: ['Väggar', 'Tak', 'Snickerier (dörrar, lister, foder)'],
    underlag: [
      { id: 'gott', t: 'Hela och tidigare målade', s: 'Ytan tvättas, slipas lätt och målas.', ikon: 'slat' },
      { id: 'hal', t: 'Hål och sprickor', s: 'Skadorna spacklas och slipas innan målning.', ikon: 'hal' },
      { id: 'ojamn', t: 'Ojämna väggar', s: 'Väggen kan behöva bredspacklas för en slät yta.', ikon: 'ojamn' },
      { id: 'tapet', t: 'Tapet', s: 'Tapeten tas bort eller förbereds, sedan spackling.', ikon: 'tapet' },
      { id: 'nygips', t: 'Ny gips, obehandlad', s: 'Skarvar spacklas, ytan grundas och målas.', ikon: 'gips' }
    ]
  },
  {
    id: 'utvandig', namn: 'Fasadmålning', kort: 'Fasad, vindskivor, foder och detaljer', bild: 'gula-huset',
    enhet: 'm²', enhetLang: 'm² fasadyta', rot: 'smahus', storlekar: [],
    delar: ['Fasad', 'Vindskivor', 'Foder och fönsterdetaljer'],
    underlag: [
      { id: 'gott', t: 'Färgen sitter bra', s: 'Fasaden tvättas och målas.', ikon: 'slat' },
      { id: 'flagnar', t: 'Färgen flagnar', s: 'Lös färg skrapas bort och trät grundas där det behövs.', ikon: 'flagnar' },
      { id: 'pavaxt', t: 'Påväxt eller smuts', s: 'Fasaden tvättas och behandlas innan målning.', ikon: 'pavaxt' },
      { id: 'skadat', t: 'Skadat trä', s: 'Vi tittar på om brädor behöver bytas först.', ikon: 'tra' }
    ]
  },
  {
    id: 'gips', namn: 'Gipsning & spackling', kort: 'Släta ytor, från gipsskiva till färdigt rum', bild: 'gipstak-spackling',
    enhet: 'm²', enhetLang: 'm² vägg- och takyta', rot: 'inne',
    storlekar: [{ v: 20, t: 'En vägg eller ett tak', s: 'ca 20 m²' }, { v: 60, t: 'Ett rum', s: 'ca 60 m²' }],
    delar: ['Väggar', 'Tak'],
    underlag: [
      { id: 'nya', t: 'Nya gipsskivor ska upp', s: 'Skivor sätts upp, skarvar spacklas och slipas.', ikon: 'gips' },
      { id: 'befintlig', t: 'Befintliga ytor ska spacklas', s: 'Ytan bredspacklas och slipas inför målning.', ikon: 'ojamn' },
      { id: 'skador', t: 'Skadade ytor', s: 'Hål och sprickor lagas innan resten görs.', ikon: 'hal' }
    ]
  },
  {
    id: 'golv', namn: 'Golvläggning', kort: 'Golv som kan kombineras med gips och målning', bild: 'fiskbensgolv',
    enhet: 'm²', enhetLang: 'm² golv', rot: 'inne',
    storlekar: [{ v: 15, t: 'Ett rum', s: 'ca 15 m²' }, { v: 40, t: 'Flera rum', s: 'ca 40 m²' }],
    delar: ['Fiskbensgolv', 'Parkett eller laminat', 'Annat golv'],
    underlag: [
      { id: 'jamnt', t: 'Jämnt och torrt undergolv', s: 'Golvet kan läggas direkt.', ikon: 'slat' },
      { id: 'ojamnt', t: 'Ojämnt undergolv', s: 'Undergolvet kan behöva avjämnas först.', ikon: 'ojamn' },
      { id: 'riva', t: 'Gammalt golv ska bort', s: 'Det gamla golvet rivs och undergolvet kontrolleras.', ikon: 'riva' }
    ]
  },
  {
    id: 'mark', namn: 'Plattor & mark', kort: 'Stensättning, gångar, uteplatser och murar', bild: 'markarbete',
    enhet: 'm²', enhetLang: 'm² yta', rot: 'nej',
    storlekar: [{ v: 15, t: 'Gång eller liten uteplats', s: 'ca 15 m²' }, { v: 40, t: 'Uteplats', s: 'ca 40 m²' }, { v: 80, t: 'Uppfart', s: 'ca 80 m²' }],
    delar: ['Uteplats', 'Gång', 'Uppfart', 'Mur'],
    underlag: [
      { id: 'ny', t: 'Gräs eller jord i dag', s: 'Marken grävs ur och ett stabilt bärlager byggs upp.', ikon: 'jord' },
      { id: 'byta', t: 'Gamla plattor ska bytas', s: 'Plattorna tas upp och underlaget kontrolleras.', ikon: 'plattor' },
      { id: 'satt', t: 'Sättningar eller lutning', s: 'Underarbetet görs om så att ytan blir stabil.', ikon: 'lutning' }
    ]
  },
  {
    id: 'service', namn: 'Fastighetsservice & trädgård', kort: 'Löpande skötsel, underhåll och praktisk hjälp', bild: 'hackplantering',
    enhet: '', enhetLang: '', rot: 'varierar', storlekar: [],
    delar: ['Löpande skötsel', 'Trädgård', 'Underhåll', 'Annat'],
    underlag: [
      { id: 'lopande', t: 'Löpande hjälp', s: 'Vi går igenom vad som ska göras och hur ofta.', ikon: 'kalender' },
      { id: 'engang', t: 'Ett enskilt jobb', s: 'Till exempel en häckplantering eller ett underhållsjobb.', ikon: 'spade' }
    ]
  }
];

export const KUNDTYP = [
  { id: 'smahus', t: 'Villa eller radhus', s: 'Du äger huset' },
  { id: 'bostadsratt', t: 'Bostadsrätt', s: 'Arbetet görs i din lägenhet' },
  { id: 'foretag', t: 'Företag eller BRF', s: 'Fastighet eller lokal' }
];

export const tomPris = () => ({
  visa: false,
  jobb: Object.fromEntries(JOBB.filter(j => j.enhet).map(j => [
    j.id, { fran: null, till: null, arbete: null, tillagg: Object.fromEntries(j.underlag.map(u => [u.id, 0])) }
  ]))
});

export const jobb = id => JOBB.find(j => j.id === id) || null;

export function rotFor(jobbId, kundtyp) {
  const j = jobb(jobbId);
  if (!j || !kundtyp) return { svar: 'kanske', varfor: '' };
  if (kundtyp === 'foretag') return { svar: 'nej', varfor: 'ROT-avdrag gäller privatpersoner. Företag och bostadsrättsföreningar får inget ROT-avdrag.' };
  if (j.rot === 'nej') return { svar: 'nej', varfor: 'Att lägga sten och plattor direkt på mark eller bygga murar ger enligt Skatteverket inget ROT-avdrag.' };
  if (j.rot === 'varierar') return { svar: 'kanske', varfor: 'Det beror på jobbet. Vi berättar i offerten om ROT- eller RUT-avdrag gäller.' };
  if (kundtyp === 'bostadsratt' && j.rot === 'smahus') return { svar: 'nej', varfor: 'I en bostadsrätt gäller ROT bara arbete inne i lägenheten. Fasaden sköts av föreningen.' };
  return { svar: 'ja', varfor: 'Målning, gipsning och golvläggning i bostaden är ROT-arbete. Avdraget är 30 procent av arbetskostnaden.' };
}

export function rotAvdrag(arbetskostnad, agare = 1) {
  const a = Math.max(0, Number(arbetskostnad) || 0);
  const max = ROT.maxPerPerson * (agare === 2 ? 2 : 1);
  const avdrag = Math.min(Math.round(a * ROT.andel), max);
  return { avdrag, taket: a * ROT.andel > max, max };
}

const TIMPRIS = 600; // kr per timme inklusive moms

const TIMMAR_PER_M2 = {
  invandig: 0.80,
  utvandig: 0.62,
  gips: 0.99,
  golv: 0.65,
  mark: 1.65
};

const UNDERLAGSPASLAG = {
  gott: 0, jamnt: 0,
  hal: 0.25, flagnar: 0.30, pavaxt: 0.15,
  ojamn: 0.35, ojamnt: 0.35,
  tapet: 0.45, nygips: 0.30, nya: 0.30,
  befintlig: 0.35, skador: 0.35,
  riva: 0.40, byta: 0.35, satt: 0.50,
  ny: 0.40, skadat: 0.50
};

const r500 = n => Math.round(n / 500) * 500;

export function uppskatta(pris, val) {
  const j = jobb(val.jobb);
  const m2 = Number(val.storlek);
  const timmarPerM2 = j && TIMMAR_PER_M2[j.id];

  if (!j || !j.enhet || !timmarPerM2 || !(m2 > 0)) return null;

  const paslag = UNDERLAGSPASLAG[val.underlag] || 0;
  const arbete = m2 * timmarPerM2 * TIMPRIS * (1 + paslag);
  const fran = r500(arbete * 0.9);
  const till = r500(arbete * 1.1);
  const out = { fran, till, rot: null };
  const rot = rotFor(j.id, val.kundtyp);

  if (rot.svar === 'ja') {
    const agare = val.agare === 2 ? 2 : 1;
    const a1 = rotAvdrag(fran, agare);
    const a2 = rotAvdrag(till, agare);

    out.rot = {
      fran: r500(fran - a1.avdrag),
      till: r500(till - a2.avdrag),
      taket: a1.taket || a2.taket
    };
  }

  return out;
}

export const kr = n => new Intl.NumberFormat('sv-SE', {
  maximumFractionDigits: 0
}).format(Math.round(n)) + ' kr';
