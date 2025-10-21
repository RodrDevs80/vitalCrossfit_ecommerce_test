import React from "react";
import { useState } from "react";
import { BotonFlotante } from "../components/BotonFlotante";
import ContainerCart from "../components/ContainerCart";
import { Hero } from "../components/Hero";
import { InputCupon } from "../components/InputCupon";

export const Home = () => {
  const [estado, setEstado] = useState(true);
  return (
    <>
      <BotonFlotante />
      <InputCupon />
      <ContainerCart />
      <Hero estado={estado} setEstado={setEstado} />
    </>
  );
};
