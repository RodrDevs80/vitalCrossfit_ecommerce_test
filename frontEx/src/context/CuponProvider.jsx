import { useState } from "react";
import { CuponContext } from "./CuponContext";
import axios from "axios";

export const CuponProvider = ({ children }) => {
  const [cuponValido, setCuponValido] = useState(null);
  const [cupon, setCupon] = useState();

  const validarCupon = async (cuponIngresado) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/cupones/validar/${cuponIngresado}`
      );
      const data = res.data;
      if (!data.valido) {
        setCupon({});
      } else {
        setCupon(data.cupon);
      }
      setCuponValido(data.valido);
    } catch (err) {
      throw new Error(err.message);
    }
  };
  return (
    <CuponContext.Provider
      value={{ validarCupon, cuponValido, cupon, setCuponValido, setCupon }}
    >
      {children}
    </CuponContext.Provider>
  );
};
