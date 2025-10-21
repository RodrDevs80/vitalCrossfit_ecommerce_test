import { Box, Typography } from "@mui/material";

const DescripcionConAlturaFija = ({ descripcion, lineas = 5 }) => {
  const formatearDescripcion = (texto, numLineas) => {
    const lineasArray = texto.split("\n");
    const lineasRellenadas = [...lineasArray];

    while (lineasRellenadas.length < numLineas) {
      lineasRellenadas.push("");
    }

    return lineasRellenadas.join("\n");
  };

  return (
    <Box
      sx={{
        minHeight: `${lineas * 1.5}em`, // 1.5em por línea
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-line",
          flex: 1,
        }}
      >
        {formatearDescripcion(descripcion, lineas)}
      </Typography>
    </Box>
  );
};

export default DescripcionConAlturaFija;
