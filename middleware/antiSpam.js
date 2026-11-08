// Parte 2: middleware de ruta (POST /appointments)
// Si una IP ha creado una cita en los últimos 10 segundos → 429 Too Many Requests.
// En memoria, con un Map simple: se vacía al reiniciar el servidor.
const WINDOW_MS = 10_000;
const lastRequest = new Map();          // IP → momento de la última petición (Date.now())

module.exports = (req, res, next) => {
  const now = Date.now();
  const last = lastRequest.get(req.ip);
  if (last && now - last < WINDOW_MS) {
    const wait = Math.ceil((WINDOW_MS - (now - last)) / 1000);
    return res.status(429).json({ error: `Espera ${wait} segundos…` });
  }
  lastRequest.set(req.ip, now);
  next();
};
