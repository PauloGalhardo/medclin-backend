const Appointment = require('../models/appointment');
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

    // Busca agendamentos populando dados do paciente
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
    console.error("ERRO AO BUSCAR CONSULTAS:", err); 
    res.status(500).json({ error: "Erro ao buscar consultas." });
  }
};

// CRIAR AGENDAMENTO (Corrigido com bloqueio de agenda duplicada)
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorName, date, time } = req.body;

    // Se for o próprio paciente agendando, garantimos que o ID seja o dele
    const idDoPaciente = req.userRole === 'paciente' ? req.userId : patientId;

    if (!idDoPaciente || !doctorName || !date || !time) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // --- LOGICA DE BLOQUEIO (Bug 7) ---
    // Verifica se já existe um agendamento para o mesmo médico, data e hora
    const conflito = await Appointment.findOne({ doctorName, date, time });
    
    if (conflito) {
      return res.status(400).json({ 
        error: "Horário indisponível. Este médico já possui uma consulta agendada para este dia e horário." 
      });
    }
    // ----------------------------------

    const newAppointment = new Appointment({
      patientId: idDoPaciente,
      doctorName,
      date,
      time
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("ERRO AO CRIAR AGENDAMENTO:", err);
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
};

// ATUALIZAR AGENDAMENTO
exports.updateAppointment = async (req, res) => {
  try {
    const { doctorName, date, time } = req.body;

    // Opcional: Validar conflito também na atualização (evita mover para um horário ocupado)
    if (doctorName && date && time) {
      const conflito = await Appointment.findOne({ 
        _id: { $ne: req.params.id }, // Ignora o próprio agendamento que está sendo editado
        doctorName, 
        date, 
        time 
      });

      if (conflito) {
        return res.status(400).json({ error: "Não é possível alterar para este horário, pois o médico já está ocupado." });
      }
    }

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