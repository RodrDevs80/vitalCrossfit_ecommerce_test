import React from "react";
import Cabecera from "../components/Cabecera";
import Slider from "../components/Slider";
import { useLocation } from "react-router-dom";
import { condicion } from "./RoutesVerificacion";

export const RoutesCabecera = () => {
  const location = useLocation();
  if (condicion(location)) {
    return null;
  }
  return (
    <>
      <Cabecera />
      <Slider />
    </>
  );
};
