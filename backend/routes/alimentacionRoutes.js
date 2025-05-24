const express = require('express');
const alimentacionController = require('../controllers/alimentacionController');

const router = express.Router();

router.get('/alimentaciones', alimentacionController.getAlimentaciones);
router.get('/alimentaciones/:id', alimentacionController.getAlimentacionById);
router.post('/alimentaciones', alimentacionController.createAlimentacion);
router.put('/alimentaciones/:id', alimentacionController.updateAlimentacion);
router.delete('/alimentaciones/:id', alimentacionController.deleteAlimentacion);

module.exports = router;