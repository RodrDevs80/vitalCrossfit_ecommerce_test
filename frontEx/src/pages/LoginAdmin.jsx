import React from "react";
import Login from "../components/Login";

import { Typography } from "@mui/material";

export const LoginAdmin = () => {
  return (
    <div className="min-h-screen bg-[#1e293b] flex flex-col">
      {/* Contenido central */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="flex items-center justify-center">
          <Login typeUser={"administrador"} />
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="flex justify-center items-center h-20 bg-[#1e293b] opacity-50">
        <Typography variant="body2" align="center" sx={{ color: "#fff" }}>
          © {new Date().getFullYear()} Carlos E Rodriguez bad💀design. Todos los
          derechos reservados.
        </Typography>
      </div>
    </div>
  );
};
