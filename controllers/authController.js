const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "E-mail já cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, email, password: hashedPassword, phone, role: role || 'paciente' 
    });
    
    await user.save();
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) { 
    res.status(500).json({ error: "Erro ao registrar." }); 
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, phone: user.phone } });
  } catch (err) { 
    res.status(500).json({ error: "Erro no login." }); 
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'paciente' }).select('-password');
    res.json(patients);
  } catch (err) { 
    res.status(500).json({ error: "Erro ao buscar pacientes." }); 
  }
};