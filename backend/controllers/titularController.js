const titularModel = require('../models/titular');
const { format } = require('date-fns');
const PDFDocument = require('pdfkit');

/**
 * @description Obtiene todos los titulares registrados en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getTitulares = async (req, res) => {
  const titulares = await titularModel.getTitulares();
  res.json(titulares);
};

/**
 * @description Obtiene todos los titulares asociados a un usuario específico.
 * @param {Object} req Objeto de solicitud de Express (requiere { id } del usuario en la sesión)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getTitularesByUsuario = async (req, res) => {
  const usuarioId = req.session.user.id;
  const titulares = await titularModel.getTitularesByUsuarioId(usuarioId);
  res.json(titulares);
};

/**
 * @description Obtiene un titular específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getTitularById = async (req, res) => {
  const titular = await titularModel.getTitularById(req.params.id);
  res.json(titular);
};

/**
 * @description Obtiene el usuario asociado a un titular específico.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getUsuarioByTitular = async (req, res) => {
  const usuario = await titularModel.getUsuarioByTitularId(req.params.id);
  res.json(usuario);
};

/**
 * @description Crea un nuevo titular en la base de datos, validando que el NIF no exista.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { nif, nombre, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createTitular = async (req, res) => {
  const { nif } = req.body;
  const titular = await titularModel.getTitularByNif(nif);
  if (titular) {
    return res.status(400).json({ message: 'El NIF ya está en uso' });
  }
  const nuevoTitular = await titularModel.createTitular(req.body);
  res.status(201).json(nuevoTitular);
};

/**
 * @description Actualiza los datos de un titular existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateTitular = async (req, res) => {
  const titularActualizado = await titularModel.updateTitular(req.params.id, req.body);
  res.json(titularActualizado);
};

/**
 * @description Elimina un titular específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteTitular = async (req, res) => {
  await titularModel.deleteTitular(req.params.id);
  res.status(204).send();
};

//------------------------------------------------------------------------------------

/**
 * @description Obtiene todos los datos relacionados con un titular, incluyendo explotaciones, parcelas, animales, movimientos, incidencias, vacunaciones, alimentación, medicamentos e inspecciones.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getTitularDatos = async (req, res) => {
  try {
    const { id } = req.params;
    const titular = await titularModel.getTitularById(id);
    const usuario = await titularModel.getUsuarioByTitularId(id);
    titular.usuario = usuario;
    const explotaciones = await titularModel.getExplotacionesByTitularId(id);

    for (const explotacion of explotaciones) {
      explotacion.parcelas = await titularModel.getParcelasByExplotacionId(explotacion.id);
      explotacion.animales = await titularModel.getAnimalesByExplotacionId(explotacion.id);

      for (const animal of explotacion.animales) {
        animal.movimientos = await titularModel.getMovimientosByAnimalId(animal.id);
        animal.incidencias = await titularModel.getIncidenciasByAnimalId(animal.id);
        animal.vacunaciones = await titularModel.getVacunacionesByAnimalId(animal.id);
      }

      explotacion.alimentacion = await titularModel.getAlimentacionByExplotacionId(explotacion.id);
      explotacion.medicamentos = await titularModel.getMedicamentosByExplotacionId(explotacion.id);
      explotacion.inspecciones = await titularModel.getInspeccionesByExplotacionId(explotacion.id);
    }

    const datos = {
      titular: {
        id: titular.id,
        nombre: titular.nombre,
        nif: titular.nif,
        domicilio: titular.domicilio,
        localidad: titular.localidad,
        provincia: titular.provincia,
        codigo_postal: titular.codigo_postal,
        telefono: titular.telefono,
        usuario: {
          id: usuario.id,
          nombre_usuario: usuario.nombre_usuario,
          nombre_empresa: usuario.nombre_empresa,
          email: usuario.email
        }
      },
      explotaciones: explotaciones.map(explotacion => ({
        id: explotacion.id,
        codigo: explotacion.codigo,
        nombre: explotacion.nombre,
        direccion: explotacion.direccion,
        localidad: explotacion.localidad,
        provincia: explotacion.provincia,
        codigo_postal: explotacion.codigo_postal,
        especies: explotacion.especies,
        coordenadas: explotacion.coordenadas,
        parcelas: explotacion.parcelas.map(parcela => ({
          id: parcela.id,
          coordenadas: parcela.coordenadas,
          extension: parcela.extension
        })),
        animales: explotacion.animales.map(animal => ({
          id: animal.id,
          identificacion: animal.identificacion,
          especie: animal.especie,
          estado: animal.estado,
          fecha_nacimiento: format(new Date(animal.fecha_nacimiento), 'yyyy-MM-dd'),
          fecha_alta: format(new Date(animal.fecha_alta), 'yyyy-MM-dd'),
          movimientos: animal.movimientos.map(movimiento => ({
            id: movimiento.id,
            tipo: movimiento.tipo,
            fecha: format(new Date(movimiento.fecha), 'yyyy-MM-dd'),
            motivo: movimiento.motivo,
            procedencia_destino: movimiento.procedencia_destino
          })),
          incidencias: animal.incidencias.map(incidencia => ({
            id: incidencia.id,
            fecha: format(new Date(incidencia.fecha), 'yyyy-MM-dd'),
            descripcion: incidencia.descripcion,
            codigo_anterior: incidencia.codigo_anterior,
            codigo_actual: incidencia.codigo_actual
          })),
          vacunaciones: animal.vacunaciones.map(vacunacion => ({
            id: vacunacion.id,
            fecha: format(new Date(vacunacion.fecha), 'yyyy-MM-dd'),
            tipo: vacunacion.tipo,
            dosis: vacunacion.dosis,
            nombre_comercial: vacunacion.nombre_comercial,
            veterinario: vacunacion.veterinario
          }))
        })),
        alimentacion: explotacion.alimentacion.map(alimento => ({
          id: alimento.id,
          fecha: format(new Date(alimento.fecha), 'yyyy-MM-dd'),
          tipo: alimento.tipo,
          cantidad: alimento.cantidad,
          lote: alimento.lote,
          factura: alimento.factura
        })),
        medicamentos: explotacion.medicamentos.map(medicamento => ({
          id: medicamento.id,
          fecha: format(new Date(medicamento.fecha), 'yyyy-MM-dd'),
          receta: medicamento.receta,
          medicamento: medicamento.medicamento,
          factura: medicamento.factura
        })),
        inspecciones: explotacion.inspecciones.map(inspeccion => ({
          id: inspeccion.id,
          fecha: format(new Date(inspeccion.fecha), 'yyyy-MM-dd'),
          oficial: inspeccion.oficial,
          tipo: inspeccion.tipo,
          numero_acta: inspeccion.numero_acta
        }))
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(datos, null, 2));
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//------------------------------------------------------------------------------------

/**
 * @description Genera un informe PDF con los datos de un titular y sus explotaciones, filtrando por fechas.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y { startDate, endDate } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const path = require('path');
const generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const titular = await titularModel.getTitularById(id);
    const explotaciones = await titularModel.getExplotacionesByTitularId(id);

    for (const explotacion of explotaciones) {
      explotacion.parcelas = await titularModel.getParcelasByExplotacionId(explotacion.id);
      explotacion.animales = await titularModel.getAnimalesByExplotacionId(explotacion.id);

      for (const animal of explotacion.animales) {
        animal.movimientos = (
          await titularModel.getMovimientosByAnimalId(animal.id)
        ).filter((mov) => new Date(mov.fecha) >= start && new Date(mov.fecha) <= end);

        animal.incidencias = (
          await titularModel.getIncidenciasByAnimalId(animal.id)
        ).filter((inc) => new Date(inc.fecha) >= start && new Date(inc.fecha) <= end);

        animal.vacunaciones = (
          await titularModel.getVacunacionesByAnimalId(animal.id)
        ).filter((vac) => new Date(vac.fecha) >= start && new Date(vac.fecha) <= end);
      }

      explotacion.alimentacion = (
        await titularModel.getAlimentacionByExplotacionId(explotacion.id)
      ).filter((al) => new Date(al.fecha) >= start && new Date(al.fecha) <= end);

      explotacion.medicamentos = (
        await titularModel.getMedicamentosByExplotacionId(explotacion.id)
      ).filter((med) => new Date(med.fecha) >= start && new Date(med.fecha) <= end);

      explotacion.inspecciones = (
        await titularModel.getInspeccionesByExplotacionId(explotacion.id)
      ).filter((insp) => new Date(insp.fecha) >= start && new Date(insp.fecha) <= end);
    }

    const doc = new PDFDocument({
      autoFirstPage: false,
      margin: 40,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Informe_${titular.id}.pdf`);
    doc.pipe(res);

    const drawBackground = () => {
      const bgPath = path.join(__dirname, '../pdf-background.png');
      try {
        doc.image(bgPath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
        });
      } catch (e) {
        console.warn('Imagen de fondo no encontrada o error al cargarla.');
      }
    };

    const nuevaPagina = () => {
      doc.addPage();
      drawBackground();
    };

    // Primera página
    nuevaPagina();
    doc.fillColor('#1a237e').fontSize(22).text(`Informe de Titular: ${titular.nombre}`, { align: 'center' });
    doc.moveDown(1);

    doc.fillColor('black').fontSize(14);
    doc.text(`NIF: ${titular.nif}`);
    doc.text(`Domicilio: ${titular.domicilio}`);
    doc.text(`Localidad: ${titular.localidad}, ${titular.provincia}`);
    doc.text(`Teléfono: ${titular.telefono}`);
    doc.moveDown(1.5);

    for (const explotacion of explotaciones) {
      doc.fillColor('#0d47a1').fontSize(18).text(`Explotación: ${explotacion.nombre}`);
      doc.fillColor('black').fontSize(13);
      doc.text(`Código REGA: ${explotacion.codigo}`);
      doc.text(`Dirección: ${explotacion.direccion}`);
      doc.text(`Localidad: ${explotacion.localidad}, ${explotacion.provincia}`);
      doc.moveDown();

      if (explotacion.parcelas.length) {
        doc.fillColor('#00796b').fontSize(15).text('Parcelas:', { underline: true });
        doc.fillColor('black').fontSize(12);
        for (const parcela of explotacion.parcelas) {
          doc.text(`• Coordenadas: ${parcela.coordenadas}`);
          doc.text(`  Extensión: ${parcela.extension} ha`);
          doc.moveDown();
        }
      }

      if (explotacion.alimentacion.length) {
        doc.fillColor('#00796b').fontSize(15).text('Alimentación:', { underline: true });
        doc.fillColor('black').fontSize(12);
        for (const alimento of explotacion.alimentacion) {
          doc.text(`• Fecha: ${format(new Date(alimento.fecha), 'yyyy-MM-dd')}`);
          doc.text(`  Tipo: ${alimento.tipo}, Cantidad: ${alimento.cantidad} kg, Lote: ${alimento.lote}`);
          doc.text(`  Factura: ${alimento.factura}`);
          doc.moveDown();
        }
      }

      if (explotacion.medicamentos.length) {
        doc.fillColor('#00796b').fontSize(15).text('Medicamentos:', { underline: true });
        doc.fillColor('black').fontSize(12);
        for (const medicamento of explotacion.medicamentos) {
          doc.text(`• Fecha: ${format(new Date(medicamento.fecha), 'yyyy-MM-dd')}`);
          doc.text(`  Receta: ${medicamento.receta}, Medicamento: ${medicamento.medicamento}`);
          doc.text(`  Factura: ${medicamento.factura}`);
          doc.moveDown();
        }
      }

      if (explotacion.inspecciones.length) {
        doc.fillColor('#00796b').fontSize(15).text('Inspecciones:', { underline: true });
        doc.fillColor('black').fontSize(12);
        for (const inspeccion of explotacion.inspecciones) {
          doc.text(`• Fecha: ${format(new Date(inspeccion.fecha), 'yyyy-MM-dd')}`);
          doc.text(`  Tipo: ${inspeccion.tipo}, Oficial: ${inspeccion.oficial ? 'Sí' : 'No'}`);
          doc.text(`  Nº Acta: ${inspeccion.numero_acta}`);
          doc.moveDown();
        }
      }

      if (explotacion.animales.length) {
        doc.fillColor('#00796b').fontSize(15).text('Animales:', { underline: true });
        doc.fillColor('black').fontSize(12);

        for (const animal of explotacion.animales) {
          doc.text(`• ID: ${animal.identificacion}`);
          doc.text(`  Especie: ${animal.especie}, Estado: ${animal.estado}`);
          if (animal.fecha_nacimiento) {
            doc.text(`  Nacimiento: ${format(new Date(animal.fecha_nacimiento), 'yyyy-MM-dd')}`);
          }
          if (animal.fecha_alta) {
            doc.text(`  Alta: ${format(new Date(animal.fecha_alta), 'yyyy-MM-dd')}`);
          }
          doc.moveDown(0.5);

          if (animal.movimientos.length) {
            doc.fillColor('#5d4037').text('  Movimientos:', { underline: true });
            doc.fillColor('black');
            for (const mov of animal.movimientos) {
              doc.text(`    Tipo: ${mov.tipo}, Fecha: ${format(new Date(mov.fecha), 'yyyy-MM-dd')}`);
              doc.text(`    Motivo: ${mov.motivo}, Origen/Destino: ${mov.procedencia_destino}`);
              doc.moveDown();
            }
          }

          if (animal.incidencias.length) {
            doc.fillColor('#5d4037').text('  Incidencias:', { underline: true });
            doc.fillColor('black');
            for (const inc of animal.incidencias) {
              doc.text(`    Fecha: ${format(new Date(inc.fecha), 'yyyy-MM-dd')}`);
              doc.text(`    Descripción: ${inc.descripcion}`);
              doc.text(`    Código anterior: ${inc.codigo_anterior}, Código actual: ${inc.codigo_actual}`);
              doc.moveDown();
            }
          }

          if (animal.vacunaciones.length) {
            doc.fillColor('#5d4037').text('  Vacunaciones:', { underline: true });
            doc.fillColor('black');
            for (const vac of animal.vacunaciones) {
              doc.text(`    Fecha: ${format(new Date(vac.fecha), 'yyyy-MM-dd')}`);
              doc.text(`    Tipo: ${vac.tipo}, Dosis: ${vac.dosis}`);
              doc.text(`    Nombre comercial: ${vac.nombre_comercial}, Veterinario: ${vac.veterinario}`);
              doc.moveDown();
            }
          }

          doc.moveDown();
        }
      }

      nuevaPagina();
    }

    doc.end();
  } catch (error) {
    console.error('Error al generar el informe PDF:', error);
    res.status(500).send('Error al generar el informe PDF');
  }
};


//------------------------------------------------------------------------------------

module.exports = {
  getTitulares,
  getTitularesByUsuario,
  getTitularById,
  getUsuarioByTitular,
  createTitular,
  updateTitular,
  deleteTitular,
  getTitularDatos,
  generatePDF,
};