const express = require('express');
const vacunacionAnimalController = require('../controllers/vacunacionAnimalController');

const router = express.Router();

router.get('/vacunaciones_animal', vacunacionAnimalController.getVacunacionesAnimal);
router.get('/vacunaciones_animal/:id', vacunacionAnimalController.getVacunacionAnimalById);
router.post('/vacunaciones_animal', vacunacionAnimalController.createVacunacionAnimal);
router.put('/vacunaciones_animal/:id', vacunacionAnimalController.updateVacunacionAnimal);
router.delete('/vacunaciones_animal/:id', vacunacionAnimalController.deleteVacunacionAnimal);

module.exports = router;