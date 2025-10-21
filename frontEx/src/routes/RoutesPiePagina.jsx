import React from "react";
import { SliderLogos } from "../components/SliderLogos";
import FooterE from "../components/FooterE";
import { useLocation } from "react-router-dom";
import { condicion } from "./RoutesVerificacion";

export const RoutesPiePagina = () => {
  const location = useLocation();
  if (condicion(location)) {
    return null;
  }
  return (
    <>
      <SliderLogos />
      <FooterE />
    </>
  );
};
