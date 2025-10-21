import { ArrowLeft } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import { Typography } from "@mui/material";

export const LoginCliente = () => {
  const navegate = useNavigate();
  const handleVolver = () => {
    navegate("/");
  };

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col">
      {/* Header con botón volver */}
      <div className="p-6">
        <button
          onClick={handleVolver}
          className="flex cursor-pointer items-center space-x-2 bg-white text-cyan-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      {/* Contenido central */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="flex items-center justify-center">
          <Login typeUser={"cliente"} />
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="flex justify-center items-center h-20 bg-blue-500">
        <Typography variant="body2" align="center" sx={{ color: "#fff" }}>
          © {new Date().getFullYear()} Carlos E Rodriguez bad💀design. Todos los
          derechos reservados.
        </Typography>
      </div>
    </div>
  );
};
