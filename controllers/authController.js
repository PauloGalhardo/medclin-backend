const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO DE USUÁRIO (Corrigido para salvar endereço completo)
exports.register = async (req, res) => {
  try {
    // Captura todos os campos enviados pelo frontend
    const { 
      name, email, password, phone, role, 
      cep, logradouro, numero, complemento, bairro, cidade, estado 
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "E-mail já cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Instancia o novo usuário com todos os dados de localização
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      role: role || 'paciente',
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    });
    
    await user.save();
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) { 
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro ao registrar." }); 
  }
};

// LOGIN DE USUÁRIO (Corrigido para retornar dados de endereço ao frontend)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );

    // Retornamos o objeto user completo (exceto senha) para que o Vue armazene o CEP
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role, 
        phone: user.phone,
        cep: user.cep,
        logradouro: user.logradouro,
        numero: user.numero,
        complemento: user.complemento,
        bairro: user.bairro,
        cidade: user.cidade,
        estado: user.estado
      } 
    });
  } catch (err) { 
    res.status(500).json({ error: "Erro no login." }); 
  }
};

// BUSCAR PACIENTES (Inclui automaticamente os novos campos salvos)
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'paciente' }).select('-password');
    res.json(patients);
  } catch (err) { 
    res.status(500).json({ error: "Erro ao buscar pacientes." }); 
  }
};