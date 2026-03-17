const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialty, phone, email, password } = req.body;
    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ error: "E-mail de médico já cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({ name, specialty, phone, email, password: hashedPassword });
    
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) { 
    res.status(500).json({ error: "Erro ao criar médico." }); 
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    
    if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }
    
    const token = jwt.sign({ id: doctor._id, role: 'medico' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: doctor._id, name: doctor.name, role: 'medico', specialty: doctor.specialty } });
  } catch (err) { 
    res.status(500).json({ error: "Erro no login do médico." }); 
  }
};

exports.listDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (err) { 
    res.status(500).json({ error: "Erro ao listar médicos." }); 
  }
};