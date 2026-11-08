const router = require('express').Router();
const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');
const Vet = require('../models/Vet');
const antiSpam = require('../middleware/antiSpam');
const validate = require('../middleware/validate');
const { createAppointment } = require('../validations/appointmentValidations');

// GET /appointments: todas las citas (de ayuda)
router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.json(appointments);
  } catch (err) { next(err); }
});

// GET /appointments/upcoming: próximas citas, con sus datos relacionados
//    Importante: definirla ANTES de las rutas del tipo /:id
router.get('/upcoming', async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .populate('vet', 'name speciality')
      .populate({
        path: 'pet',
        select: 'name species',
        populate: { path: 'owner', select: 'name email' }
      });
    res.json(appointments);
  } catch (err) { next(err); }
});

// POST /appointments: crear una cita
//    Cadena de middlewares, en orden:
//    1) createAppointment + validate (parte 3): datos incorrectos → 400
//    2) antiSpam (parte 2): la misma IP dos veces en 10 segundos → 429
//       Después de la validación: las peticiones inválidas no "gastan" la ventana.
router.post('/', createAppointment, validate, antiSpam, async (req, res, next) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.validate();          // comprueba required, enum y ObjectId

    const [petExists, vetExists] = await Promise.all([
      Pet.exists({ _id: appointment.pet }),
      Vet.exists({ _id: appointment.vet })
    ]);
    if (!petExists) return res.status(400).json({ error: 'La mascota no existe' });
    if (!vetExists) return res.status(400).json({ error: 'El veterinario no existe' });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) { next(err); }
});

// DELETE /appointments/past: borrar las citas pasadas
router.delete('/past', async (req, res, next) => {
  try {
    const result = await Appointment.deleteMany({ date: { $lt: new Date() } });
    res.json({ deleted: result.deletedCount });
  } catch (err) { next(err); }
});

module.exports = router;
