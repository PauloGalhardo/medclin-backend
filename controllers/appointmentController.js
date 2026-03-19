const Appointment = require('../models/appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// LISTAR AGENDAMENTOS
exports.getAppointments = async (req, res) => {
  try {
    let query = {};

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

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name phone email cep');

    appointments.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      const nameA = a.patientId?.name || "";
      const nameB = b.patientId?.name || "";
      return nameA.localeCompare(nameB);
    });

    res.json(appointments);
  } catch (err) {
    console.error("ERRO AO BUSCAR CONSULTAS:", err); 
    res.status(500).json({ error: "Erro ao buscar consultas no servidor." });
  }
};

// CRIAR AGENDAMENTO
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorName, date, time } = req.body;
    const idDoPaciente = req.userRole === 'paciente' ? req.userId : patientId;

    if (!idDoPaciente || !doctorName || !date || !time) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Bloqueio de data retroativa
    const hoje = new Date().toISOString().split('T')[0];
    if (date < hoje) {
      return res.status(400).json({ error: "Não é possível agendar para uma data que já passou." });
    }

    // Verifica conflito de agenda do médico
    const conflito = await Appointment.findOne({ doctorName, date, time });
    if (conflito) {
      return res.status(400).json({ 
        error: "Horário indisponível. Este médico já possui uma consulta agendada para este dia e horário." 
      });
    }

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
    res.status(500).json({ error: "Erro interno ao processar agendamento." });
  }
};

// ATUALIZAR AGENDAMENTO
exports.updateAppointment = async (req, res) => {
  try {
    const { doctorName, date, time } = req.body;
    
    // 1. Busca o agendamento atual para completar dados faltantes na validação
    const agendamentoAtual = await Appointment.findById(req.params.id);
    if (!agendamentoAtual) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    // 2. Determina os valores finais (o que veio no body ou o que já existia)
    const finalDoctor = doctorName || agendamentoAtual.doctorName;
    const finalDate = date || agendamentoAtual.date;
    const finalTime = time || agendamentoAtual.time;

    // 3. Verifica conflito (excluindo o próprio ID da busca)
    const conflito = await Appointment.findOne({ 
      _id: { $ne: req.params.id }, 
      doctorName: finalDoctor, 
      date: finalDate, 
      time: finalTime 
    });

    if (conflito) {
      return res.status(400).json({ error: "Conflito de agenda: Este médico já está ocupado neste novo horário." });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("ERRO AO ATUALIZAR:", err);
    res.status(500).json({ error: "Erro ao atualizar agendamento." });
  }
};

// DELETAR AGENDAMENTO
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Agendamento removido com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar agendamento." });
  }
};