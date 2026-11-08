const { body } = require('express-validator');

// POST /appointments
exports.createAppointment = [
  body('date').isISO8601().withMessage('Fecha inválida').bail()
    .custom(v => new Date(v) > new Date())
    .withMessage('La cita debe ser en el futuro'),
  body('reason').trim().notEmpty().withMessage('Falta el motivo'),
  body('pet').isMongoId().withMessage('ID de mascota inválido'),
  body('vet').isMongoId().withMessage('ID de veterinario inválido')
];
