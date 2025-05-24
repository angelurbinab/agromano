const express = require('express');
const movimientoController = require('../controllers/movimientoController');

const router = express.Router();

router.get('/movimientos', movimientoController.getMovimientos);
router.get('/movimientos/:id', movimientoController.getMovimientoById);
router.post('/movimientos', movimientoController.createMovimiento);
router.put('/movimientos/:id', movimientoController.updateMovimiento);
router.delete('/movimientos/:id', movimientoController.deleteMovimiento);

module.exports = router;