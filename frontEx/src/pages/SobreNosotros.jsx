const SobreNosotros = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-white opacity-80"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Sobre Nosotros
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Líderes en equipamiento de calidad para crossfit, pesas y
            suplementación deportiva
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Información del Fundador */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">
                  Nuestro Fundador
                </h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-white">
                    RG
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                      Ramiro Garzón
                    </h3>
                    <p className="text-gray-600">
                      Profesor de Educación Física
                    </p>
                  </div>
                </div>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Ramiro Garzón ha dedicado su vida al fitness y al bienestar
                  físico. Su pasión por el deporte lo llevó a crear
                  <span className="text-blue-600 font-semibold">
                    {" "}
                    VitalCrossfit
                  </span>
                  , un gimnasio que se ha convertido en referencia en la
                  comunidad.
                </p>
              </div>

              {/* Experiencia */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-lg border border-gray-200">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">
                    10
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    Años de Experiencia
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-lg border border-gray-200">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">
                    1000+
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    Clientes Satisfechos
                  </div>
                </div>
              </div>
            </div>

            {/* Misión y Visión */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">
                  Nuestra Misión
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                  Proveer equipamiento de la más alta calidad para atletas y
                  entusiastas del crossfit, pesas y fitness. Cada producto es
                  seleccionado cuidadosamente por Ramiro basado en su
                  experiencia y conocimiento técnico.
                </p>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">
                  Nuestra Visión
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Ser la tienda de referencia en suplementación y equipamiento
                  deportivo, manteniendo los estándares de calidad que nos
                  caracterizan y expandiendo la cultura del crossfit y fitness
                  en la región.
                </p>
              </div>

              {/* Especialidades */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-4 md:p-6 shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white text-center">
                  Especialidades
                </h3>
                <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm flex-1">
                    <span className="font-semibold text-black text-sm md:text-base">
                      Pesas
                    </span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm flex-1">
                    <span className="font-semibold text-black text-sm md:text-base">
                      Suplementación
                    </span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm flex-1">
                    <span className="font-semibold text-black text-sm md:text-base">
                      Crossfit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección del Gimnasio */}
          <div className="mt-12 md:mt-16 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600">
                VitalCrossfit
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Nuestro Gimnasio Flagship
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="order-2 md:order-1">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  <span className="text-blue-600 font-semibold">
                    VitalCrossfit
                  </span>{" "}
                  es más que un gimnasio, es una comunidad donde Ramiro Garzón
                  aplica toda su experiencia para guiar a cada atleta hacia sus
                  metas. Con equipamiento de primera calidad y programas
                  personalizados, hemos ayudado a cientos de personas a
                  transformar sus vidas.
                </p>
                <ul className="mt-4 md:mt-6 space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Entrenamiento personalizado
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Equipamiento profesional
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Comunidad activa
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl md:rounded-xl overflow-hidden shadow-lg h-50 sm:h-100 md:h-80 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  src="gim.jpg"
                  alt="Gimnasio VitalCrossfit - equipamiento profesional y ambiente motivador"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SobreNosotros;
