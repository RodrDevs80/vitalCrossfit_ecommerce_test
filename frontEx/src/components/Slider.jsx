import React, { useState } from "react";
import { Box, Paper, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import img1 from "../assets/imgSlider/pexels-cottonbro-7674492.jpg";
import img2 from "../assets/imgSlider/pexels-victorfreitas-703012.jpg";
import img3 from "../assets/imgSlider/pexels-victorfreitas-791763.jpg";
import img4 from "../assets/imgSlider/pexels-pixabay-416717.jpg";
import img5 from "../assets/imgSlider/pexels-rdne-7187871.jpg";
import img6 from "../assets/imgSlider/pexels-daniel-liu-830120274-19494977.jpg";

const images = [img1, img2, img3, img4, img5, img6];
const texto = [
  "Rompe tus límites con el mejor equipo de CrossFit.",
  "Equípate para el WOD perfecto. Envíos rápidos y productos premium.",
  "Suplementación inteligente para metas extraordinarias",
  "Todo lo que necesitas para rendir al máximo. ¡Compra fácil, entrena fuerte!",
  "Deporte, nutrición y rendimiento. Todo en un solo click",
  "Tu equipamiento ideal a un clic de distancia. ¡Compra ahora!",
];

const Slider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  React.useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        margin: "auto",
      }}
    >
      {/* Imagen actual */}
      <Paper elevation={0} sx={{ overflow: "hidden" }}>
        <Box
          component="img"
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex + 1}`}
          sx={{
            width: "100%",
            height: "380px",
            display: "block",
            objectFit: "cover",
          }}
        ></Box>
      </Paper>

      {/* Flecha izquierda */}
      <IconButton
        onClick={prevImage}
        sx={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Flecha derecha */}
      <IconButton
        onClick={nextImage}
        sx={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
      <Paper elevation={3}>
        <Typography
          sx={{
            position: "relative",
            textAlign: "center",
            color: "white",
            fontSize: "30px",
            fontWeight: "400",
            fontFamily: "Proza Libre",
            background: "#00CCC0",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          {texto[currentImageIndex]}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Slider;
