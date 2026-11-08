const router = require('express').Router();
const { matchedData } = require('express-validator');
const Vet = require('../models/Vet');
const validate = require('../middleware/validate');
const { searchVets, updateVetEmail } = require('../validations/vetValidations');

// POST /vets: crear un veterinario (para hacer pruebas)
router.post('/', async (req, res, next) => {
  try {
    const vet = await Vet.create(req.body);
    res.status(201).json(vet);
  } catch (err) { next(err); }
});

// GET /vets?day=lunes&speciality=perros
//    Los que estén disponibles ese día O tengan esa especialidad ($or)
//    Parte 3: searchVets + validate → aquí solo llegan valores correctos
router.get('/', searchVets, validate, async (req, res, next) => {
  try {
    const { day, speciality } = matchedData(req);   // valores validados y limpiados
    const conditions = [];
    if (day) conditions.push({ availableDays: day });
    if (speciality) conditions.push({ speciality: speciality.toLowerCase() });

    const filter = conditions.length ? { $or: conditions } : {};
    const vets = await Vet.find(filter).sort({ name: 1 });
    res.json(vets);
  } catch (err) { next(err); }
});

// PATCH /vets/:id: actualizar el email
//    Parte 3: updateVetEmail + validate → el ID y el email llegan comprobados
//    returnDocument: 'after' → devuelve el documento actualizado (si no, el antiguo)
//    runValidators: true     → el validador match también se ejecuta al actualizar
router.patch('/:id', updateVetEmail, validate, async (req, res, next) => {
  try {
    const { email } = matchedData(req);

    const vet = await Vet.findByIdAndUpdate(
      req.params.id,
      { email },
      { returnDocument: 'after', runValidators: true }
    );
    if (!vet) return res.status(404).json({ error: 'Veterinario no encontrado' });
    res.json(vet);
  } catch (err) { next(err); }
});

module.exports = router;
