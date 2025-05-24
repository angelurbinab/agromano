const express = require('express');
const animalController = require('../controllers/animalController');

const router = express.Router();

router.get('/animales', animalController.getAnimales);
router.get('/animales/:id', animalController.getAnimalById);
router.post('/animales', animalController.createAnimal);
router.put('/animales/:id', animalController.updateAnimal);
router.delete('/animales/:id', animalController.deleteAnimal);

module.exports = router;