import { ArrowLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import Registro from "../components/Registro";

export const RegistroCliente = () => {
  const navegate = useNavigate();
  const handleVolver = () => {
    navegate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-600 flex flex-col">
      {/* Header con botón volver */}
      <div className="p-4 sm:p-6">
        <button
          onClick={handleVolver}
          className="flex cursor-pointer items-center space-x-2 bg-white text-cyan-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      {/* Contenido central */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl">
          {/* Contenedor responsivo que ocupa 80% en pantallas grandes */}
          <div className="w-full lg:w-4/5 mx-auto">
            <Registro />
          </div>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="flex justify-center items-center h-16 sm:h-20 bg-gradient-to-r from-cyan-500 to-blue-700 opacity-50 px-4">
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#fff",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          © {new Date().getFullYear()} Carlos E Rodriguez bad💀design. Todos los
          derechos reservados.
        </Typography>
      </div>
    </div>
  );
};
