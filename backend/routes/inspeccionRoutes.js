const express = require('express');
const inspeccionController = require('../controllers/inspeccionController');

const router = express.Router();

router.get('/inspecciones', inspeccionController.getInspecciones);
router.get('/inspecciones/:id', inspeccionController.getInspeccionById);
router.post('/inspecciones', inspeccionController.createInspeccion);
router.put('/inspecciones/:id', inspeccionController.updateInspeccion);
router.delete('/inspecciones/:id', inspeccionController.deleteInspeccion);

module.exports = router;