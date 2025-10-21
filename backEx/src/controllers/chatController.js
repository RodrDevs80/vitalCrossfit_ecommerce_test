import { PALABRAS_PROHIBIDAS, respuestasAmables } from "../util/tematicas.js";
import { TEMATICAS_PERMITIDAS } from "../util/tematicas.js";
import groq from "../config/ia/groqConfig.js";
import NodeCache from "node-cache";

const cache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 600
});



const esTematicaPermitida = (pregunta) => {
    const preguntaLower = pregunta.toLowerCase();

    const contieneProhibidas = PALABRAS_PROHIBIDAS.some(palabra =>
        preguntaLower.includes(palabra.toLowerCase())
    );

    if (contieneProhibidas) {
        return false;
    }

    const contienePermitidas = TEMATICAS_PERMITIDAS.some(tematica =>
        preguntaLower.includes(tematica.toLowerCase())
    );

    return contienePermitidas;
};

const generarRespuestaFueraDeTematica = (pregunta) => {
    return respuestasAmables[Math.floor(Math.random() * respuestasAmables.length)];
};

const obtenerRespuesta = async (req, res) => {
    try {
        const { pregunta } = req.body;

        if (!pregunta || pregunta.trim().length === 0) {
            return res.status(400).json({ error: 'Pregunta requerida' });
        }

        const preguntaLimpia = pregunta.trim();

        if (!esTematicaPermitida(preguntaLimpia)) {
            const respuestaLimitada = generarRespuestaFueraDeTematica(preguntaLimpia);
            return res.status(200).json({
                respuesta: respuestaLimitada,
                cached: false,
                tematica_permitida: false
            });
        }

        // Verificar cache
        const cacheKey = preguntaLimpia.toLowerCase();
        const cachedResponse = cache.get(cacheKey);

        if (cachedResponse) {
            return res.status(200).json({
                respuesta: cachedResponse,
                cached: true,
                tematica_permitida: true
            });
        }

        //         const prompt = `Eres un asistente especializado exclusivamente en entrenamiento deportivo y físico. Tu conocimiento abarca: metodologías de entrenamiento (fuerza, hipertrofia, potencia, resistencia), técnicas de ejercicio (pesas, máquinas, peso corporal), programación de rutinas (periodización, volumen, intensidad, frecuencia), principios de recuperación (descanso, sueño), nutrición deportiva básica (timing de nutrientes, suplementos ergogénicos con evidencia científica) y prevención de lesiones relacionadas con el entrenamiento.

        // INSTRUCCIONES ESTRICTAS:
        // 1. RESPUESTA PRECISA: Responde DE MANERA CONCISA, DIRECTA y BASADA EN EVIDENCIA CIENTÍFICA actualizada.
        // 2. ALCANCE TEMÁTICO: SOLO responde sobre temas DIRECTAMENTE relacionados con el entrenamiento deportivo y físico. 
        // 3. PROHIBICIONES: 
        //    - NO respondas sobre temas médicos, diagnósticos, tratamientos o lesiones específicas (más allá de consejos generales de prevención).
        //    - NO des recomendaciones nutricionales detalladas fuera del contexto deportivo inmediato (ej. dietas para condiciones médicas).
        //    - NO opines ni des consejos fuera de tu ámbito. Si la pregunta no está relacionada con el entrenamiento, responde amablemente que solo puedes ayudar con temas de entrenamiento deportivo.
        // 4. FORMATO: Utiliza un lenguaje profesional y claro. Si es pertinente, organiza la información en listas breves o puntos clave para facilitar la lectura.
        // 5. IDIOMA: Responde siempre en castellano.

        // Pregunta del usuario: "${preguntaLimpia}"

        // Analiza la pregunta y proporciona únicamente la información solicitada dentro de los límites temáticos establecidos.`;
        const prompt = `Eres un asistente especializado exclusivamente en entrenamiento deportivo y físico. Tu conocimiento abarca: metodologías de entrenamiento (fuerza, hipertrofia, potencia, resistencia), técnicas de ejercicio (pesas, máquinas, peso corporal), programación de rutinas (periodización, volumen, intensidad, frecuencia), principios de recuperación (descanso, sueño), nutrición deportiva básica (timing de nutrientes, suplementos ergogénicos con evidencia científica) y prevención de lesiones relacionadas con el entrenamiento.

INSTRUCCIONES ESTRICTAS:
1. RESPUESTA PRECISA: Responde DE MANERA CONCISA, DIRECTA y BASADA EN EVIDENCIA CIENTÍFICA actualizada. Sintetiza la información al máximo manteniendo la calidad.
2. ALCANCE TEMÁTICO: SOLO responde sobre temas DIRECTAMENTE relacionados con el entrenamiento deportivo y físico. 
3. PROHIBICIONES: 
   - NO respondas sobre temas médicos, diagnósticos, tratamientos o lesiones específicas (más allá de consejos generales de prevención).
   - NO des recomendaciones nutricionales detalladas fuera del contexto deportivo inmediato.
   - NO opines ni des consejos fuera de tu ámbito. Si la pregunta no está relacionada con el entrenamiento, responde amablemente que solo puedes ayudar con temas de entrenamiento deportivo.
4. FORMATO: Utiliza un lenguaje profesional y claro. Prioriza la coherencia y cohesión del mensaje. Estructura la respuesta de manera lógica y fluida.
5. LÍMITE: Máximo 1000 tokens. Selecciona solo la información más relevante y esencial para la pregunta.

Pregunta del usuario: "${preguntaLimpia}"

Analiza la pregunta y proporciona únicamente la información esencial dentro de los límites establecidos, asegurando que la respuesta sea coherente, cohesionada y directamente relevante para la consulta.`;

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",  // Modelo de Groq
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.6,
            max_tokens: 1000,
            top_p: 0.9,
            stream: false
        });


        const respuesta = completion.choices[0]?.message?.content || "";


        if (!respuesta.trim()) {
            throw new Error('El modelo devolvió una respuesta vacía');
        }

        // Guardar en cache
        cache.set(cacheKey, respuesta);

        res.status(200).json({
            respuesta: respuesta,
            cached: false,
            tematica_permitida: true
        });

    } catch (err) {
        console.error('Error en obtenerRespuesta:', err.message);

        if (err.message.includes('timeout') || err.message.includes('Timeout')) {
            res.status(504).json({
                error: 'La respuesta está tardando más de lo esperado. Por favor:',
                suggestions: [
                    'Formula tu pregunta de manera más específica',
                    'Intenta con menos palabras',
                    'Reintenta en unos momentos'
                ]
            });
        } else if (err.message.includes('API key') || err.message.includes('authentication')) {
            res.status(500).json({
                error: 'Error de autenticación con el servicio de IA'
            });
        } else {
            res.status(500).json({
                error: 'Error interno del servidor',
                detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }
}


export { obtenerRespuesta }