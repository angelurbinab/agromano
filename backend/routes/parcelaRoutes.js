const express = require('express');
const parcelaController = require('../controllers/parcelaController');

const router = express.Router();

router.get('/parcelas', parcelaController.getParcelas);
router.get('/parcelas/:id', parcelaController.getParcelaById);
router.post('/parcelas', parcelaController.createParcela);
router.put('/parcelas/:id', parcelaController.updateParcela);
router.delete('/parcelas/:id', parcelaController.deleteParcela);

module.exports = router;