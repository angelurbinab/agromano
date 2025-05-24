import { GoogleGenAI } from "@google/genai";

/**
 * @description Configuración del cliente de Google GenAI para generar respuestas del chatbot.
 * @param {string} apiKey Clave de API para autenticar las solicitudes a Google GenAI.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * @description Genera una respuesta del chatbot basada en el mensaje del usuario y el contexto proporcionado.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { message } en el body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void} Devuelve una respuesta JSON con el texto generado por el modelo o un mensaje de error.
 */
export const chatbotResponse = async (req, res) => {
  const { message } = req.body;

  // Define el contexto que deseas proporcionar al modelo
  const prompt = `
Eres un asistente virtual para la aplicación Agromano. 
La app ayuda a ganaderos a gestionar su información:
- Titulares: datos personales (nombre, NIF, domicilio, provincia, código postal y teléfono) de quien dirige la explotación.
- Explotaciones: lugares donde se crían animales. Requiere nombre, dirección, código REGA, especies, coordenadas, etc.
- Animales: identificación, especie y estado (vivo, muerto...), fecha de nacimiento y fecha de alta para seguir su historial.
- Alimentaciones: registro de fecha, tipo (pienso, forraje...), factura y cantidad.
- Medicamentos: guardas la fecha, el nombre, la receta y factura.
- Movimientos: entradas o salidas de animales con fecha, motivo y procedencia/destino.
- Parcelas: campos con coordenadas y extensión.
- Inspecciones: revisiones oficiales o no, con fecha, tipo y número de acta.
- Incidencias: problemas o cambios en un animal (registro de fecha, descripción), también puede contener código anterior y actual si se trata de una reidentificación.
- Un usuario puede tener varios titulares, un titular varias explotaciones, una explotación puede tener varias parcelas, alimentaciones, medicamentos, inspecciones, vacunas y animales, a su vez, los animales pueden tener movimientos e incidencias.

Puedes guiar al usuario sobre qué datos rellenar en cada formulario o cómo navegar por la aplicación teniendo en cuenta las relaciones de las entidades. 
Si el usuario pregunta algo que no figure aquí, sugiere contactar con soporte, y recuerda que debes proporcionar respuestas relativamente cortas, de no más de tres líneas.

Usuario: ${message}
  `;

  try {
    // Genera contenido basado en el prompt y el modelo especificado
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Devuelve la respuesta generada al cliente
    res.json({ response: response.text });
  } catch (error) {
    // Manejo de errores en caso de fallo en la generación de contenido
    console.error("Error al generar la respuesta del chatbot:", error);
    res.status(500).json({ error: "Error al generar la respuesta del chatbot" });
  }
};

