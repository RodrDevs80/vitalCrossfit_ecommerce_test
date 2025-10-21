import { Box } from "@mui/material";
import CategoriaCard from "./CategoriasCard";
import { useState } from "react";
import { useEffect } from "react";
import getCateConsultaSimple from "../services/getCateConsultaSimple";

export const ContenedorCardCateg = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const [categorias, setCategorias] = useState([]);

  const obtenerCategorias = () => {
    getCateConsultaSimple()
      .then((res) => setCategorias(res))
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // 1 columna en mobile
          sm: "repeat(2, 1fr)", // 2 columnas en tablet
          md: "repeat(3, 1fr)", // 3 columnas en desktop
        },
        gridTemplateRows: "1fr",
        placeItems: "center",
        gap: 2,
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      {categorias.map((categoria, index) => (
        <CategoriaCard
          key={index}
          img={categoria.imagenUrl}
          titulo={categoria.nombre}
          id={categoria.id}
          onClick={() => setSelectedCard(index)}
          data-active={selectedCard === index ? "" : undefined}
          sx={{
            height: "100%",
            "&[data-active]": {
              backgroundColor: "action.selected",
              "&:hover": {
                backgroundColor: "action.selectedHover",
              },
            },
          }}
        ></CategoriaCard>
      ))}
    </Box>
  );
};
