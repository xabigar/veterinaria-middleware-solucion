const { validationResult } = require('express-validator');

// Parte 3: se ejecuta después de la cadena de validación.
// Si hay errores, los envía al middleware de errores (400), con el mismo formato que las respuestas de Mongoose:
//   { error: 'Datos inválidos', errors: { campo: 'mensaje', ... } }
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const err = new Error('Datos inválidos');
  err.status = 400;
  err.errors = {};
  for (const e of result.array()) err.errors[e.path] = e.msg;   // path: el campo · msg: el mensaje
  next(err);
};
