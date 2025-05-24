const express = require('express');
const explotacionController = require('../controllers/explotacionController');

const router = express.Router();

router.get('/explotaciones', explotacionController.getExplotaciones);
router.get('/explotaciones/:id', explotacionController.getExplotacionById);
router.post('/explotaciones', explotacionController.createExplotacion);
router.put('/explotaciones/:id', explotacionController.updateExplotacion);
router.delete('/explotaciones/:id', explotacionController.deleteExplotacion);

module.exports = router;