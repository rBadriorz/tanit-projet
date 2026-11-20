// Remplace window.claude.use('sample') et window.claude.use('tts') de claude.ai.
// Même interface que l'original, pour que le reste du code ne change pas :
//   sample(prompt | messages, {onText, signal, modelTier}) -> {text}
//   sample.json(prompt, {images, schema})                  -> objet ou tableau
//   tts.speak(text, {language})                            -> Promise
// Aucune clé ici : le navigateur parle seulement à notre serveur (/api/...).

class AIError extends Error {
  constructor(code) { super(code); this.code = code; }
}

async function post(path, body, signal) {
  let res;
  try {
    res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });
  } catch (e) {
    throw new AIError(e && e.name === 'AbortError' ? 'cancelled' : 'other');
  }
  if (!res.ok) {
    let code = res.status === 429 ? 'rate_limited' : 'other';
    try { code = (await res.json()).error || code; } catch {}
    throw new AIError(code);
  }
  return res;
}

/** Le serveur répond-il, avec une clé configurée ? Sinon l'appli garde ses exemples. */
export async function aiReady() {
  try {
    const r = await fetch('/api/health');
    return r.ok && (await r.json()).ai === true;
  } catch { return false; }
}

/** Texte en streaming. Le serveur envoie une ligne JSON par morceau : {"text":"..."} ou {"error":"code"}. */
export async function sample(input, opts = {}) {
  const messages = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
  const res = await post('/api/sample', { messages, tier: opts.modelTier || 'quick' }, opts.signal);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let text = '', buf = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 1);
        if (!line.trim()) continue;
        const ev = JSON.parse(line);
        if (ev.error) throw new AIError(ev.error);
        if (ev.text) { text += ev.text; if (opts.onText) opts.onText({ text }); }
      }
    }
  } catch (e) {
    if (e instanceof AIError) throw e;
    throw new AIError(opts.signal && opts.signal.aborted ? 'cancelled' : 'other');
  }
  return { text };
}

/** Réponse JSON garantie par un schéma défini côté serveur ('document' ou 'aides'). */
sample.json = async function (prompt, opts = {}) {
  const images = await Promise.all((opts.images || []).map(toJpeg));
  const res = await post('/api/json', { prompt, schema: opts.schema, images }, opts.signal);
  return (await res.json()).data;
};

// Une photo de téléphone pèse souvent 4 à 10 Mo. On la réduit à 1568 px de côté
// (taille conseillée pour la lecture d'image par Claude) et on l'envoie en JPEG.
async function toJpeg(file) {
  const MAX = 1568;
  let bmp;
  try { bmp = await createImageBitmap(file); } catch { throw new AIError('images_unavailable'); }
  const k = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * k); canvas.height = Math.round(bmp.height * k);
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
  return { media_type: 'image/jpeg', data };
}

/** « Écouter » : la voix intégrée du navigateur (l'API Anthropic ne fait pas de synthèse vocale). */
export const tts = typeof window !== 'undefined' && 'speechSynthesis' in window ? {
  speak(text, { language } = {}) {
    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = language === 'en' ? 'en-GB' : 'fr-FR';
      const voices = synth.getVoices();
      u.voice = voices.find(v => v.lang === u.lang) || voices.find(v => v.lang.startsWith(u.lang.slice(0, 2))) || null;
      u.rate = 0.95;
      u.onend = () => resolve();
      u.onerror = e => (e.error === 'interrupted' || e.error === 'canceled' ? resolve() : reject(e));
      synth.speak(u);
    });
  }
} : null;
