const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.listDoctors);
router.post('/', doctorController.createDoctor);
router.post('/login', doctorController.loginDoctor);

module.exports = router;