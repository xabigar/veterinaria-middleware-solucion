// Parte 1: middleware de aplicación
// Una línea por petición: método, ruta, código de estado y duración.
//   POST /appointments 201 12 ms
module.exports = (req, res, next) => {
  const start = Date.now();
  // 'finish': cuando ya se ha enviado la respuesta. Entonces se conoce el código de estado.
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(req.method, req.originalUrl, res.statusCode, `${ms} ms`);
  });
  next();   // si no se llama, la petición se queda colgada
};
