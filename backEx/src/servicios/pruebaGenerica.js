// Función genérica para obtener todos los registros de cualquier modelo
export const getAllRecordsService = (modelo, nombreEntidad) => {
  return async (req, res) => {
    try {
      const allData = await modelo.findAll();

      res.status(200).json({
        status: 200,
        message: allData.length === 0
          ? `No hay ${nombreEntidad} en la base de datos`
          : `${nombreEntidad} obtenidas exitosamente`,
        data: allData,
        total: allData.length
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: `Error al obtener el listado de ${nombreEntidad}`,
        message: err.message
      });
    }
  };
};