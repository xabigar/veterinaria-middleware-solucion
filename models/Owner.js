// YA HECHO (ejemplo del ejercicio anterior)
const { Schema, model } = require('mongoose');

const ownerSchema = new Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true,
           lowercase: true, trim: true, match: /.+@.+\..+/ },
  phone: String
}, { timestamps: true });

module.exports = model('Owner', ownerSchema);   // colección: owners
