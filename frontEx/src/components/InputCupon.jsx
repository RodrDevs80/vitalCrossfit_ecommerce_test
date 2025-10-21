import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { CuponContext } from "../context/cuponContext";
import { Link } from "react-router-dom";

export const InputCupon = () => {
  const { validarCupon, cuponValido, cupon, setCuponValido, setCupon } =
    useContext(CuponContext);
  const [codigoIngresado, setCodigoIngresado] = useState("");

  const handleAplicarCupon = () => {
    if (codigoIngresado.length === 0) {
      return;
    }
    validarCupon(codigoIngresado);
  };

  const handleDesaplicar = () => {
    setCuponValido(null);
    setCupon({});
    setCodigoIngresado("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 3,
        padding: 3,
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 2,
      }}
    >
      {/* Campo de entrada minimalista */}
      <div className="w-full max-w-md mb-4">
        <div className="relative">
          <input
            onChange={(e) => setCodigoIngresado(e.target.value)}
            value={codigoIngresado}
            type="text"
            name="codigo"
            id="codigo"
            className="w-full px-4 py-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-slate-400 transition-all duration-200"
            placeholder="Código de cupón"
            disabled={cuponValido}
          />
        </div>
      </div>

      {/* Botones minimalistas */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleAplicarCupon}
          disabled={cuponValido}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            !cuponValido
              ? "bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          Aplicar
        </button>

        <button
          onClick={handleDesaplicar}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            cuponValido
              ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          }`}
        >
          Quitar
        </button>
      </div>

      {/* Mensaje de estado minimalista */}
      {cuponValido !== null && codigoIngresado !== "" && (
        <div className="w-full max-w-md">
          {cuponValido ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#047857",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Cupón aplicado:{" "}
                    <span className="font-semibold">{cupon.nombre}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#065f46",
                      fontSize: "0.875rem",
                      mt: 0.5,
                    }}
                  >
                    Descuento: {cupon.porcentajeDescuento}%
                  </Typography>
                  <Link to={`/productos/${cupon.idProducto}`}>
                    <Button
                      size="small"
                      sx={{
                        mt: 1,
                        textTransform: "none",
                        color: "#047857",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        padding: "4px 8px",
                        minHeight: "auto",
                        "&:hover": {
                          backgroundColor: "#ecfdf5",
                        },
                      }}
                    >
                      Ver producto →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#dc2626",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    ml: 1.5,
                  }}
                >
                  Código inválido o inactivo
                </Typography>
              </div>
            </div>
          )}
        </div>
      )}
    </Box>
  );
};
