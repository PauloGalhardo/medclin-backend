const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { type: String, enum: ['paciente', 'admin', 'master'], default: 'paciente' },
  // NOVOS CAMPOS DE ENDEREÇO
  cep: { type: String, default: "" },
  logradouro: { type: String, default: "" },
  bairro: { type: String, default: "" },
  cidade: { type: String, default: "" },
  estado: { type: String, default: "" },
  numero: { type: String, default: "" },
  complemento: { type: String, default: "" }
});

module.exports = mongoose.model('User', userSchema);