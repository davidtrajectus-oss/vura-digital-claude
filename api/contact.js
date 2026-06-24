// Serverless endpoint: /api/contact
// Todas las credenciales viven en variables de entorno — nunca en el HTML.
// Configurar en Vercel Dashboard > Settings > Environment Variables:
//   SHEETDB_URL          https://sheetdb.io/api/v1/jtupg6j7hh3vy
//   EMAILJS_SERVICE_ID   service_tchmeeg
//   EMAILJS_TEMPLATE_ID  template_giu9vml
//   EMAILJS_PUBLIC_KEY   n-SpRg6RMLARzrEfn
//   EMAILJS_PRIVATE_KEY  (Account > General > Private Key) — requerido para llamadas server-side

const ALLOWED_ORIGIN = 'https://www.vuradigital.es';
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

module.exports = async function handler(req, res) {
  // CORS — solo acepta peticiones desde el dominio propio
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { name, email, website, source } = req.body || {};

  // Honeypot: bot detectado → respuesta 200 silenciosa
  if (website) return res.status(200).json({ ok: true });

  // Validación de campos
  const cleanName  = typeof name  === 'string' ? name.trim().slice(0, 120)  : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase().slice(0, 254) : '';

  if (cleanName.length < 2)        return res.status(400).json({ error: 'Nombre demasiado corto' });
  if (!EMAIL_RE.test(cleanEmail))  return res.status(400).json({ error: 'Email inválido' });

  const date    = new Date().toLocaleDateString('es-ES');
  const fuente  = source === 'startups' ? 'startups' : 'negocios';

  // 1 — Guardar en CRM (SheetDB)
  try {
    await fetch(process.env.SHEETDB_URL, {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        data: [{ nombre: cleanName, email: cleanEmail, fecha: date, estado: 'Nuevo', fuente }]
      })
    });
  } catch (err) {
    console.error('[contact] SheetDB error:', err.message);
    // No interrumpimos el flujo — el email sigue adelante
  }

  // 2 — Notificación por email (EmailJS REST API)
  try {
    const ejRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        service_id:      process.env.EMAILJS_SERVICE_ID,
        template_id:     process.env.EMAILJS_TEMPLATE_ID,
        user_id:         process.env.EMAILJS_PUBLIC_KEY,
        accessToken:     process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          user_name:  cleanName,
          user_email: cleanEmail,
          fuente,
          fecha:      date
        }
      })
    });

    if (!ejRes.ok) {
      const txt = await ejRes.text();
      console.error('[contact] EmailJS error:', ejRes.status, txt);
      // DEBUG TEMPORAL — revertir tras diagnóstico
      return res.status(502).json({
        error: 'Error al enviar la notificación',
        debug: { ejStatus: ejRes.status, ejBody: txt, hasPrivKey: !!process.env.EMAILJS_PRIVATE_KEY, hasPubKey: !!process.env.EMAILJS_PUBLIC_KEY, hasService: !!process.env.EMAILJS_SERVICE_ID, hasTemplate: !!process.env.EMAILJS_TEMPLATE_ID }
      });
    }
  } catch (err) {
    console.error('[contact] EmailJS fetch error:', err.message);
    return res.status(502).json({ error: 'Error de conexión con el servicio de email', debug: { fetchError: err.message } });
  }

  return res.status(200).json({ ok: true });
};
