// YA HECHO (ejemplo del ejercicio anterior)
const { Schema, model } = require('mongoose');

const petSchema = new Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'] },
  species: { type: String, required: true,
             enum: ['dog', 'cat', 'bird'] },
  birthDate: Date,
  owner: { type: Schema.Types.ObjectId, ref: 'Owner', required: true },   // referencia
  vaccines: [{                                                            // incrustado
    name: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// EXTRA (pregunta 2 de la puesta en común): al borrar una mascota, también sus citas.
// findByIdAndDelete() dispara el hook findOneAndDelete.
petSchema.post('findOneAndDelete', async function (pet) {
  if (pet) await model('Appointment').deleteMany({ pet: pet._id });
});

module.exports = model('Pet', petSchema);
