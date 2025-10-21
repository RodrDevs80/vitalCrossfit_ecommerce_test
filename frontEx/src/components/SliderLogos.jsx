import React from "react";
import marcas from "../mocks/logosMarcas";
import "../css/SliderLogos.css";

export const SliderLogos = () => {
  const marcasXDos = [...marcas, ...marcas, ...marcas];
  return (
    <div className="slider">
      <div className="slide-track">
        {marcasXDos.map((marca, index) => (
          <div key={index} className="slide">
            <img src={marca.logo} alt={marca.marca} />
          </div>
        ))}
      </div>
    </div>
  );
};
