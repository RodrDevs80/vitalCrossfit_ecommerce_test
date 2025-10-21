export const TEMATICAS_PERMITIDAS = [
    // Deportes específicos y entrenamiento deportivo
    'fútbol', 'futbol', 'soccer', 'baloncesto', 'basketball', 'balonmano',
    'voleibol', 'volleyball', 'tenis', 'pádel', 'padel', 'badminton',
    'rugby', 'hockey', 'atletismo', 'carreras', 'maratón', 'triatlón',
    'ciclismo', 'cycling', 'natación', 'swimming', 'artes marciales',
    'boxeo', 'muay thai', 'jiu jitsu', 'judó', 'karate', 'deportes de combate',

    // Entrenamiento específico para deportes
    'entrenamiento para fútbol', 'entrenamiento futbolístico', 'fútbol training',
    'entrenamiento para baloncesto', 'basketball training', 'entrenamiento deportivo',
    'preparación física deportiva', 'rendimiento deportivo', 'deportivo',
    'deportes', 'atleta', 'atlético', 'competencia deportiva',

    // Componentes del entrenamiento deportivo
    'velocidad', 'agilidad', 'rapidez', 'aceleración', 'desaceleración',
    'cambio de dirección', 'coordinación', 'equilibrio', 'potencia', 'explosividad',
    'resistencia', 'resistencia aeróbica', 'resistencia anaeróbica',
    'pliometría', 'pliométricos', 'saltos', 'sprints', 'carreras de velocidad',

    // Ejercicios de fuerza principales
    'pesas', 'levantamiento de pesas', 'halterofilia', 'weightlifting', 'powerlifting',
    'fuerza', 'entrenamiento de fuerza', 'ejercicios de fuerza', 'musculación',

    // Ejercicios específicos de fuerza
    'press de banca', 'press plano', 'press inclinado', 'press declinado',
    'sentadilla', 'squat', 'sentadillas', 'squats',
    'peso muerto', 'deadlift', 'levantamiento tierra',
    'press militar', 'press de hombros', 'desarrollo de hombros',
    'dominadas', 'pull ups', 'chin ups',
    'fondos', 'dips', 'fondos en paralelas',
    'remo', 'remo con barra', 'remo con mancuerna', 'rowing',
    'curl de bíceps', 'extensiones de tríceps', 'press francés',
    'elevaciones laterales', 'vuelos laterales', 'flyes',
    'prensa de piernas', 'leg press', 'extensiones de pierna', 'curl de pierna',
    'elevaciones de talones', 'calf raises', 'gemelos',
    'abdominales', 'crunch', 'plancha', 'plank', 'rueda abdominal',

    // Crossfit y funcional
    'crossfit', 'wod', 'entrenamiento funcional', 'functional training',
    'burpees', 'thrusters', 'clean', 'snatch', 'jerk', 'kettlebell swing',
    'box jump', 'salto al cajón', 'double unders', 'saltos de cuerda',
    'muscle ups', 'handstand push ups', 'push ups', 'flexiones',

    // Calentamiento y movilidad
    'calentamiento', 'warm up', 'estiramientos', 'stretching', 'movilidad',
    'movilidad articular', 'flexibilidad', 'activación muscular',
    'rotaciones de hombros', 'rotaciones de cadera', 'trote suave',
    'saltos de tijera', 'jumping jacks', 'skipping', 'carrera estática',

    // Ejercicios aeróbicos y cardio
    'aeróbico', 'cardio', 'cardiovascular', 'ejercicio aeróbico',
    'correr', 'running', 'cinta de correr', 'treadmill',
    'bicicleta', 'cycling', 'spinning', 'bicicleta estática',
    'elíptica', 'elliptical', 'remo máquina', 'rowing machine',
    'natación', 'swimming', 'aquagym', 'hidrogimnasia',
    'saltar cuerda', 'jump rope', 'hiit', 'entrenamiento interválico',
    'zumba', 'baile', 'step', 'aeróbic',

    // Suplementación y nutrición
    'suplementacion', 'suplementos', 'proteína', 'whey protein', 'proteína whey',
    'creatina', 'pre-entreno', 'pre workout', 'bcaa', 'aminoácidos',
    'glutamina', 'omega 3', 'vitaminas', 'multivitamínicos', 'minerales',
    'quemadores de grasa', 'termogénicos', 'ganadores de peso', 'mass gainer',

    // Rutinas y programas
    'rutinas', 'rutinas de ejercicio', 'programas de entrenamiento',
    'entrenamiento', 'ejercicios', 'plan de entrenamiento',
    'volumen', 'intensidad', 'series', 'repeticiones', 'reps',
    'descanso', 'recuperación', 'overtraining', 'sobreentrenamiento',

    // Implementos y equipamiento
    'implementos', 'equipamiento', 'barras', 'barra olímpica', 'discos', 'pesos',
    'mancuernas', 'dumbbells', 'kettlebells', 'pesas rusas',
    'balones medicinales', 'medicine balls', 'cuerdas', 'battle ropes',
    'cajas pliométricas', 'plyo boxes', 'bandas elásticas', 'resistance bands',
    'trx', 'entrenamiento suspensión', 'maquinas de gimnasio', 'aparatos',

    // Áreas del cuerpo
    'pectoral', 'pecho', 'espalda', 'dorsales', 'hombros', 'deltoides',
    'brazos', 'bíceps', 'tríceps', 'antebrazos', 'piernas', 'cuádriceps',
    'isquiotibiales', 'femoral', 'glúteos', 'abductores', 'adductores',
    'abdominales', 'core', 'lumbares', 'trapecio',

    // Conceptos de entrenamiento
    'hipertrofia', 'definición muscular', 'volumen muscular',
    'fuerza máxima', 'repeticiones máximas', 'rm',
    'periodización', 'progresión', 'supercompensación',
    'técnica', 'forma de ejercicio', 'postura',

    // Salud y bienestar relacionado
    'lesiones deportivas', 'prevención de lesiones', 'recuperación muscular',
    'agujetas', 'doms', 'descanso activo', 'sueño y deporte',
    'hidratación', 'alimentación deportiva', 'dieta para deportistas'
];

export const PALABRAS_PROHIBIDAS = [
    // Política y gobierno
    'política', 'politica', 'políticas', 'politicas', 'político', 'politico',
    'políticos', 'politicos', 'gobierno', 'gobiernos', 'gubernamental', 'estatal',
    'elecciones', 'electoral', 'votaciones', 'votos', 'votar', 'candidato',
    'candidatos', 'candidata', 'candidatas', 'partido', 'partidos', 'político',
    'politipartidista', 'ideología', 'ideologias', 'ideológico', 'ideologicos',
    'democracia', 'dictadura', 'régimen', 'regimen', 'gobiernar', 'mandatario',
    'presidente', 'presidenta', 'alcalde', 'alcaldesa', 'congreso', 'senado',
    'diputado', 'diputados', 'ministro', 'ministros', 'gobernador', 'gobernadores',

    // Religión y espiritualidad
    'religión', 'religion', 'religiones', 'religioso', 'religiosos', 'religiosa',
    'religiosas', 'Dios', 'dios', 'dioses', 'divinidad', 'divino', 'divina',
    'iglesia', 'iglesias', 'templo', 'templos', 'mezquita', 'sinagoga', 'culto',
    'oración', 'oracion', 'rezar', 'fe', 'creencia', 'creencias', 'creyente',
    'creyentes', 'ateo', 'atea', 'ateos', 'ateas', 'agnóstico', 'agnostica',
    'espiritual', 'espiritualidad', 'alma', 'almas', 'cielo', 'infierno', 'paraíso',
    'pecado', 'pecados', 'sagrado', 'sagrada', 'santos', 'santas', 'profeta',
    'profetas', 'biblia', 'corán', 'torá', 'evangelio', 'apóstol', 'apostoles',

    // Finanzas y economía
    'finanzas', 'finanza', 'financiero', 'financieros', 'financiera', 'financieras',
    'economía', 'economia', 'económico', 'economico', 'económicos', 'economicos',
    'dinero', 'efectivo', 'capital', 'inversiones', 'inversión', 'inversion',
    'invertir', 'inversor', 'inversora', 'inversores', 'bolsa', 'bursátil',
    'bursatil', 'acciones', 'accion', 'mercado', 'mercados', 'banco', 'bancos',
    'bancario', 'bancaria', 'crédito', 'credito', 'préstamo', 'prestamo',
    'hipoteca', 'hipotecas', 'ahorro', 'ahorros', 'presupuesto', 'presupuestos',
    'impuesto', 'impuestos', 'tributario', 'tributaria', 'fiscal', 'fiscales',

    // Criptomonedas y blockchain
    'cripto', 'criptomonedas', 'criptomoneda', 'bitcoin', 'bitcoins', 'ethereum',
    'blockchain', 'cadena de bloques', 'minar', 'minado', 'minería', 'mineria',
    'wallet', 'cartera', 'exchange', 'intercambio', 'token', 'tokens', 'nft',
    'nfts', 'defi', 'finanzas descentralizadas', 'smart contract', 'contrato inteligente',
    'altcoin', 'altcoins', 'dogecoin', 'ripple', 'litecoin', 'binance', 'coinbase',

    // Tecnología y programación
    'programación', 'programacion', 'programar', 'código', 'codigo', 'coding',
    'desarrollo', 'developer', 'desarrollador', 'desarrolladora', 'software',
    'hardware', 'aplicación', 'aplicaciones', 'app', 'apps', 'web', 'página',
    'pagina', 'sitio', 'internet', 'redes', 'computadora', 'ordenador', 'pc',
    'laptop', 'tablet', 'smartphone', 'celular', 'móvil', 'movil', 'tecnología',
    'tecnologia', 'tecnológico', 'tecnologico', 'digital', 'digitales', 'informática',
    'informatica', 'hacking', 'hacker', 'virus', 'malware', 'programa', 'programas',

    // Videojuegos y entretenimiento
    'videojuegos', 'videojuego', 'juegos', 'juego', 'gaming', 'gamer', 'gamers',
    'consola', 'consolas', 'playstation', 'xbox', 'nintendo', 'switch', 'steam',
    'epic games', 'jugador', 'jugadora', 'multijugador', 'online', 'offline', 'puntuación', 'puntuacion', 'score', 'ranking', 'clasificación',

    // Cine y televisión
    'películas', 'peliculas', 'película', 'pelicula', 'cine', 'film', 'films',
    'filmar', 'director', 'directora', 'actor', 'actriz', 'actores', 'actrices',
    'series', 'serie', 'televisión', 'television', 'tv', 'netflix', 'amazon',
    'disney', 'hbo', 'streaming', 'transmitir', 'emisión', 'emision', 'canal',
    'canales', 'programa', 'programas', 'tele', 'telenovela', 'telenovelas',

    // Música y arte
    'música', 'musica', 'musical', 'musicales', 'canción', 'cancion', 'canciones',
    'cantar', 'cantante', 'cantantes', 'banda', 'bandas', 'grupo', 'grupos',
    'artista', 'artistas', 'arte', 'artístico', 'artistico', 'pintura', 'pinturas',
    'dibujo', 'dibujos', 'escultura', 'esculturas', 'fotografía', 'fotografia',
    'baile', 'bailar', 'danza', 'danzar', 'coreografía', 'coreografia',

    // Historia y ciencias
    'historia', 'histórico', 'historico', 'histórica', 'historica', 'pasado',
    'antiguo', 'antigua', 'edad media', 'medieval', 'renacimiento', 'moderno',
    'contemporáneo', 'contemporaneo', 'ciencia', 'ciencias', 'científico',
    'cientifico', 'científica', 'cientifica', 'investigación', 'investigacion',
    'experimento', 'experimentos', 'laboratorio', 'matemáticas', 'matematicas',
    'matemático', 'matematico', 'física', 'fisica', 'química', 'quimica',
    'biología', 'biologia', 'geología', 'geologia', 'astronomía', 'astronomia',

    // Medicina y salud
    'medicina', 'médico', 'medico', 'médica', 'medica', 'doctor', 'doctores',
    'doctora', 'enfermedades', 'enfermedad', 'enfermo', 'enferma', 'paciente',
    'pacientes', 'hospital', 'hospitales', 'clínica', 'clinica', 'consultorio',
    'medicamento', 'medicamentos', 'fármaco', 'farmaco', 'farmacia', 'farmacias',
    'tratamiento', 'tratamientos', 'diagnóstico', 'diagnostico', 'síntomas',
    'sintomas', 'virus', 'bacteria', 'infección', 'infeccion', 'cirugía', 'cirugia',

    // Psicología y filosofía
    'psicología', 'psicologia', 'psicológico', 'psicologico', 'psicóloga',
    'psicologa', 'psicólogo', 'psicologo', 'mente', 'mental', 'emocional',
    'terapia', 'terapias', 'psiquiatría', 'psiquiatria', 'psiquiátrico',
    'psiquiatrico', 'filosofía', 'filosofia', 'filosófico', 'filosofico',
    'filósofo', 'filosofo', 'pensamiento', 'pensamientos', 'ética', 'etica',
    'moral', 'valores', 'existencial', 'existencialismo', 'metafísica', 'metafisica',

    // Astrología y esoterismo
    'astrología', 'astrologia', 'astrológico', 'astrologico', 'astrólogo',
    'astrologo', 'horóscopo', 'horoscopo', 'zodiaco', 'zodíaco', 'signos',
    'aries', 'tauro', 'géminis', 'geminis', 'cáncer', 'cancer', 'leo', 'virgo',
    'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis',
    'tarot', 'cartas', 'videncia', 'vidente', 'medium', 'espiritismo', 'esotérico',
    'esoterico', 'místico', 'mistico', 'ocultismo', 'magia', 'mágico', 'magico',

    // Viajes y turismo
    'viajes', 'viaje', 'viajar', 'turismo', 'turista', 'turistas', 'vacaciones',
    'destino', 'destinos', 'hotel', 'hoteles', 'resort', 'resorts', 'playa',
    'playas', 'montaña', 'montanas', 'ciudad', 'ciudades', 'país', 'pais',
    'países', 'paises', 'avión', 'avion', 'aeropuerto', 'vuelo', 'vuelos',
    'maleta', 'equipaje', 'pasaporte', 'visado', 'visa', 'alojamiento',

    // Cocina y gastronomía
    'cocina', 'cocinar', 'recetas', 'receta', 'comida', 'comidas', 'alimento',
    'alimentos', 'chef', 'cocineros', 'cocinera', 'restaurante', 'restaurantes',
    'gastronomía', 'gastronomia', 'gastronómico', 'gastronomico', 'menu', 'menú',
    'plato', 'platos', 'ingredientes', 'ingrediente', 'sabor', 'sabores',
    'postre', 'postres', 'bebida', 'bebidas', 'vino', 'vinos', 'cerveza', 'cervezas',

    // Moda y estilo
    'moda', 'fashion', 'estilo', 'ropa', 'prendas', 'vestido', 'vestidos',
    'camisa', 'camisas', 'pantalón', 'pantalon', 'pantalones', 'zapatos',
    'zapato', 'accesorios', 'accesorio', 'joyería', 'joyeria', 'bisutería',
    'bisuteria', 'maquillaje', 'cosméticos', 'cosmeticos', 'belleza', 'estética',
    'estetica', 'diseño', 'diseno', 'diseñador', 'disenador', 'diseñadora', 'disenadora',

    // Noticias y actualidad
    'noticias', 'noticia', 'actualidad', 'actual', 'news', 'periódico', 'periodico',
    'diario', 'prensa', 'reportero', 'reportera', 'periodista', 'periodistas',
    'titular', 'titulares', 'información', 'informacion', 'medio', 'medios',
    'comunicación', 'comunicacion', 'reportaje', 'reportajes', 'entrevista', 'entrevistas',

    // Economía y negocios
    'economía', 'economia', 'económico', 'economico', 'negocios', 'negocio',
    'empresa', 'empresas', 'emprendedor', 'emprendedora', 'emprendimiento',
    'mercado', 'mercados', 'comercio', 'comercial', 'ventas', 'vender',
    'compra', 'comprar', 'cliente', 'clientes', 'consumidor', 'consumidora',
    'marketing', 'publicidad', 'anuncio', 'anuncios', 'branding', 'marca',

    // Educación y académico
    'educación', 'educacion', 'educativo', 'educativa', 'académico', 'academico',
    'académica', 'academica', 'escuela', 'escuelas', 'colegio', 'colegios',
    'universidad', 'universidades', 'profesor', 'profesora', 'maestro', 'maestra',
    'alumno', 'alumna', 'estudiante', 'estudiantes', 'clase', 'clases',
    'curso', 'cursos', 'lección', 'leccion', 'aprender', 'enseñar', 'ensenar',
    'examen', 'exámenes', 'examenes', 'tarea', 'tareas', 'deberes', 'homework',

    // Deportes no relacionados (para mayor especificidad)
    'deportes no relacionados', 'deporte no relacionado', 'otros deportes',
    'deportes ajenos', 'deportes externos', 'disciplinas no afines',
    'actividades no deportivas', 'juegos no deportivos', 'competencias no afines'
];

export const respuestasAmables = [
    "Lo siento, solo estoy diseñado para responder preguntas sobre pesas, crossfit, suplementación, rutinas de ejercicio y equipamiento relacionado. ¿En qué puedo ayudarte dentro de estas temáticas?",
    "Mi experiencia está limitado a temas de fitness, pesas, crossfit y suplementación. ¿Tienes alguna pregunta sobre estos temas?",
    "Actualmente solo puedo responder consultas relacionadas con entrenamiento, pesas, crossfit y suplementos. ¿Hay algo en lo que pueda ayudarte dentro de estas áreas?",
    "Me especializo en pesas, crossfit, rutinas de ejercicio y suplementación. ¿Tienes alguna pregunta sobre estos temas deportivos?",
    "Solo estoy programado para asistir con temas de fitness, entrenamiento y suplementación. ¿En qué puedo ayudarte dentro de estos ámbitos?"
];