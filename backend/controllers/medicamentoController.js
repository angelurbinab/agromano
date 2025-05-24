const medicamentoModel = require('../models/medicamento');

/**
 * @description Obtiene todos los medicamentos registrados en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getMedicamentos = async (req, res) => {
  const medicamentos = await medicamentoModel.getMedicamentos();
  res.json(medicamentos);
};

/**
 * @description Obtiene un medicamento específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getMedicamentoById = async (req, res) => {
  const medicamento = await medicamentoModel.getMedicamentoById(req.params.id);
  res.json(medicamento);
};

/**
 * @description Crea un nuevo medicamento en la base de datos, validando que la factura no exista.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { factura, nombre, fecha, id_explotacion } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createMedicamento = async (req, res) => {
  const { factura, id_explotacion } = req.body;

  // Comprobar si la factura ya existe
  const medicamentoExistente = await medicamentoModel.getMedicamentoByFactura(factura, id_explotacion);
  if (medicamentoExistente) {
    return res.status(400).json({ message: 'La factura ya está en uso, no se pueden duplicar facturas' });
  }

  // Crear el nuevo medicamento si la factura no existe
  const nuevoMedicamento = await medicamentoModel.createMedicamento(req.body);
  res.status(201).json(nuevoMedicamento);
};

/**
 * @description Actualiza los datos de un medicamento existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateMedicamento = async (req, res) => {
  const medicamentoActualizado = await medicamentoModel.updateMedicamento(req.params.id, req.body);
  res.json(medicamentoActualizado);
};

/**
 * @description Elimina un medicamento específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteMedicamento = async (req, res) => {
  await medicamentoModel.deleteMedicamento(req.params.id);
  res.status(204).send();
};

module.exports = {
  getMedicamentos,
  getMedicamentoById,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
};