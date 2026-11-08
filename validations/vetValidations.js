const { query, param, body } = require('express-validator');
const DAYS = require('../models/days');

// GET /vets?day=…&speciality=…
// Los valores de la query string no se guardan: Mongoose no puede validarlos.
exports.searchVets = [
  query('day').optional().trim().toLowerCase()
    .isIn(DAYS).withMessage('No es un día de la semana'),
  query('speciality').optional().trim()
    .notEmpty().withMessage('La especialidad no puede estar vacía')
];

// PATCH /vets/:id
exports.updateVetEmail = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('email').trim().notEmpty().withMessage('Falta el email').bail()
    .isEmail().withMessage('El email no tiene un formato válido')
];
