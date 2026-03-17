const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM
 // cep: { type: String, required: true },
  address: {
    street: String,
    neighborhood: String,
    city: String,
    state: String
  },
  weatherAlert: { type: String },
  status: { 
    type: String, 
    enum: ['agendado', 'cancelado', 'concluido'], 
    default: 'agendado' 
  }
}, { timestamps: true });

module.exports = mongoose.model('appointment', appointmentSchema);