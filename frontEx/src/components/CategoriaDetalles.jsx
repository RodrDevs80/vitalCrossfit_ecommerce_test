import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import getCategoriaById from "../services/getCategoriaById";
import { Button, Card, Typography } from "@mui/material";

export const CategoriaDetalles = () => {
  const [cate, setCate] = useState({});
  const idCategoria = useParams();
  useEffect(() => {
    getCategoriaById(Number(idCategoria.id))
      .then((res) => setCate(res))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card
        sx={{
          margin: 2,
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          align="center"
          sx={{
            fontSize: {
              xs: "1rem", // 16px en móvil (0-599px)
              sm: "2.25rem", // 20px en tablet (600-899px)
              md: "4rem", // 24px en desktop (900-1199px)
            },
          }}
        >
          {cate.nombre}
        </Typography>
        <img src={cate.imagenUrl} alt={cate.nombre} />
        <Typography
          align="center"
          sx={{
            fontSize: {
              xs: "1rem", // 16px en móvil (0-599px)
              sm: "1.25rem", // 20px en tablet (600-899px)
              md: "1.5rem", // 24px en desktop (900-1199px)
              lg: "2.5rem", // 32px en pantallas grandes (1200-1535px)
              xl: "3rem",
            },
            marginTop: 4,
          }}
        >
          {cate.descripcion}
        </Typography>
        <Button variant="outlined" sx={{ margin: 5 }}>
          <Link to={"/categorias"}>Volver</Link>
        </Button>
      </Card>
    </>
  );
};
