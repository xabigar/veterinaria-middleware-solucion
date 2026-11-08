// Middleware de errores: convierte los errores en códigos HTTP adecuados.
// Ejercicio anterior: errores de Mongoose. Este ejercicio (parte 4): errores con err.status.
module.exports = (err, req, res, next) => {
  // No se cumplen las reglas del esquema (required, enum, match…)
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const [field, e] of Object.entries(err.errors)) errors[field] = e.message;
    return res.status(400).json({ error: 'Datos inválidos', errors });
  }

  // ID o tipo inválido (p. ej. /vets/abc)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `El valor del campo '${err.path}' no es correcto` });
  }

  // Valor duplicado en un campo unique (error de MongoDB)
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Valor duplicado', fields: err.keyValue });
  }

  // JSON mal escrito en el cuerpo (express.json())
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  // Parte 4: los errores que creamos nosotros (p. ej. el middleware validate) tienen err.status
  if (err.status) {
    return res.status(err.status)
      .json({ error: err.message, errors: err.errors });
  }

  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
};
