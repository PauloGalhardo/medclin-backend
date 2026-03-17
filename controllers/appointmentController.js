const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// LISTAR AGENDAMENTOS
exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    // Filtro por perfil
    if (req.userRole === 'paciente') {
      query.patientId = req.userId;
    } else if (req.userRole === 'medico') {
      const doctor = await Doctor.findById(req.userId);
      if (doctor) {
        query.doctorName = doctor.name;
      } else {
        return res.json([]);
      }
    }

    // Busca agendamentos populando dados do paciente (incluindo o novo campo CEP)
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name phone email cep');

    // ORDENAÇÃO V3.0: Cronológica (Data/Hora) + Alfabética (Nome do Paciente)
    appointments.sort((a, b) => {
      // 1. Comparar Datas
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;

      // 2. Se as datas forem iguais, comparar Horários
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;

      // 3. Se data e hora forem iguais, critério de desempate: Nome do Paciente
      const nameA = a.patientId?.name || "";
      const nameB = b.patientId?.name || "";
      return nameA.localeCompare(nameB);
    });

    res.json(appointments);
  } catch (err) {
    // Adicione esta linha para ver exatamente o que o banco de dados reclamou:
    console.error("ERRO DETALHADO AO SALVAR CONSULTA:", err); 
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
};

// CRIAR AGENDAMENTO
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorName, date, time } = req.body;

    // Se for o próprio paciente agendando, garantimos que o ID seja o dele
    const idDoPaciente = req.userRole === 'paciente' ? req.userId : patientId;

    if (!idDoPaciente || !doctorName || !date || !time) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const newAppointment = new Appointment({
      patientId: idDoPaciente,
      doctorName,
      date,
      time
      // Note que o CEP não é mais enviado aqui, pois ele já está no registro do User
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
};

// ATUALIZAR AGENDAMENTO
exports.updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar." });
  }
};

// DELETAR AGENDAMENTO
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Agendamento removido." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar." });
  }
};