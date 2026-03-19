require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json()); 

// Puxa a string de conexão de forma segura
const dbURI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas com sucesso!'))
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });
// Escuta erros que ocorrem depois que a conexão já foi estabelecida
mongoose.connection.on('error', (err) => {
  console.error('⚠️ Erro na conexão com o Atlas:', err);
});

// Avisa caso a aplicação perca a conexão com a internet ou com o cluster
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado do cluster Atlas.');
});

// Importação das Rotas
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

// Endpoints base
app.use('/api/auth', authRoutes);
app.use('/api/agendamentos', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);

app.get('/', (req, res) => res.send('API da Clínica Digital está rodando! 🚀'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));