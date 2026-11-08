# API de veterinaria · Middlewares (solución)

Solución del ejercicio anterior + middlewares: logger, antispam, express-validator y middleware de errores completo.

## Arrancar

```bash
npm install
npm run dev     # http://localhost:3000 · MongoDB en memoria + datos de ejemplo
```

Pruebas: al final de `requests.http`.

## Cadena de middlewares

```
petición → logger → express.json() → ruta:
                                     POST /appointments: createAppointment → validate → antiSpam → controlador
                                     GET /vets:          searchVets → validate → controlador
                                     PATCH /vets/:id:    updateVetEmail → validate → controlador
        → 404 → errorHandler
```

## Decisiones importantes

- **El logger va el primero** (incluso antes de `express.json()`): registra también las peticiones con JSON mal escrito, los 404 y los errores.
  `res.on('finish')`: el código de estado se conoce después de enviar la respuesta.
- **El antispam va después de la validación:** una petición inválida (400) no "gasta" la ventana de 10 segundos;
  solo se limitan las peticiones que de verdad van a crear algo. Alternativa: ponerlo antes, para hacer menos trabajo
  en un ataque (proteger recursos). Las dos son defendibles.
- **Un único middleware `validate`**, para todas las rutas: el error va por `next(err)`, con `err.status = 400` y
  `err.errors = { campo: mensaje }`. Así, los errores de validación de express-validator y los de Mongoose tienen el mismo formato.
- **`matchedData(req)`**: valores validados y limpiados (p. ej. `day` en minúsculas). Ya no hace falta el `String()` manual.
- **`isMongoId()`** en `:id` y en el cuerpo: los ID inválidos se paran antes de llegar al controlador (no hay `CastError`).
- **`models/days.js`**: una única lista de días, compartida por el esquema y las validaciones.

## Preguntas para la puesta en común

1. **¿Antispam antes o después?** Mira arriba. Después: más correcto para el usuario. Antes:
   más barato para el servidor en un ataque.
2. **¿Por qué `date` en el futuro con express-validator?** Esa regla solo se aplica al **crear** la cita.
   Si estuviera en el esquema de Mongoose, al actualizar una cita pasada (p. ej. `status: 'done'`, con `runValidators`)
   daría error. En cambio, el formato (Date) y la obligatoriedad sí están en el esquema: se aplican a todos los datos.
3. **Antispam en memoria:** se vacía al reiniciar, y dos servidores (o más) no comparten memoria:
   una IP puede hacer una petición en cada servidor. En producción: `express-rate-limit`, con los datos
   en un almacén compartido como Redis.
