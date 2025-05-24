const express = require('express');
const medicamentoController = require('../controllers/medicamentoController');

const router = express.Router();

router.get('/medicamentos', medicamentoController.getMedicamentos);
router.get('/medicamentos/:id', medicamentoController.getMedicamentoById);
router.post('/medicamentos', medicamentoController.createMedicamento);
router.put('/medicamentos/:id', medicamentoController.updateMedicamento);
router.delete('/medicamentos/:id', medicamentoController.deleteMedicamento);

module.exports = router;