// import { useState } from "react";
// import {
//   Box,
//   Paper,
//   IconButton,
//   Stack,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   ZoomIn,
//   ZoomOut,
//   NavigateBefore,
//   NavigateNext,
//   Fullscreen,
//   FullscreenExit,
// } from "@mui/icons-material";

// export const GaleriaFotosProducto = ({
//   imagenes = [],
//   nombreProducto = "",
// }) => {
//   const [imagenPrincipalIndex, setImagenPrincipalIndex] = useState(0);
//   const [zoomActivo, setZoomActivo] = useState(false);
//   const [pantallaCompleta, setPantallaCompleta] = useState(false);

//   const theme = useTheme();
//   const esMovil = useMediaQuery(theme.breakpoints.down("md"));

//   // Si no hay imágenes, mostrar un placeholder
//   if (!imagenes || imagenes.length === 0) {
//     return (
//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 3,
//           overflow: "hidden",
//           background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//           p: 2,
//           height: { xs: 300, md: 400 },
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//           gap: 2,
//         }}
//       >
//         <Box
//           sx={{
//             width: 80,
//             height: 80,
//             borderRadius: "50%",
//             backgroundColor: "grey.300",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <ZoomIn sx={{ fontSize: 40, color: "grey.600" }} />
//         </Box>
//         <Typography variant="body2" color="text.secondary">
//           No hay imágenes disponibles
//         </Typography>
//       </Paper>
//     );
//   }

//   const imagenPrincipal = imagenes[imagenPrincipalIndex];

//   const siguienteImagen = () => {
//     setImagenPrincipalIndex((prev) =>
//       prev === imagenes.length - 1 ? 0 : prev + 1
//     );
//   };

//   const anteriorImagen = () => {
//     setImagenPrincipalIndex((prev) =>
//       prev === 0 ? imagenes.length - 1 : prev - 1
//     );
//   };

//   const seleccionarImagen = (index) => {
//     setImagenPrincipalIndex(index);
//   };

//   const toggleZoom = () => {
//     setZoomActivo(!zoomActivo);
//     if (pantallaCompleta) setPantallaCompleta(false);
//   };

//   const togglePantallaCompleta = () => {
//     setPantallaCompleta(!pantallaCompleta);
//     if (zoomActivo) setZoomActivo(false);
//   };

//   return (
//     <Box sx={{ position: "relative" }}>
//       {/* Imagen principal */}
//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 3,
//           overflow: "hidden",
//           background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//           p: pantallaCompleta ? 0 : 2,
//           height: pantallaCompleta ? "85vh" : { xs: 300, md: 400 },
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           position: "relative",
//           cursor: zoomActivo ? "zoom-out" : "zoom-in",
//           transition: "all 0.3s ease",
//           ...(pantallaCompleta && {
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             zIndex: 9999,
//             borderRadius: 0,
//           }),
//         }}
//         onClick={toggleZoom}
//       >
//         <img
//           src={imagenPrincipal}
//           alt={`${nombreProducto} - Imagen ${imagenPrincipalIndex + 1}`}
//           style={{
//             maxWidth: zoomActivo ? "150%" : "100%",
//             maxHeight: zoomActivo ? "150%" : "100%",
//             objectFit: "contain",
//             borderRadius: zoomActivo ? 0 : 12,
//             transition: "all 0.3s ease",
//             transform: zoomActivo ? "scale(1.5)" : "scale(1)",
//           }}
//         />

//         {/* Controles de la imagen principal */}
//         {!esMovil && (
//           <>
//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation();
//                 anteriorImagen();
//               }}
//               sx={{
//                 position: "absolute",
//                 left: 16,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//                 "&:hover": {
//                   backgroundColor: "rgba(255, 255, 255, 1)",
//                 },
//                 ...(pantallaCompleta && {
//                   left: 32,
//                 }),
//               }}
//             >
//               <NavigateBefore />
//             </IconButton>

//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation();
//                 siguienteImagen();
//               }}
//               sx={{
//                 position: "absolute",
//                 right: 16,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//                 "&:hover": {
//                   backgroundColor: "rgba(255, 255, 255, 1)",
//                 },
//                 ...(pantallaCompleta && {
//                   right: 32,
//                 }),
//               }}
//             >
//               <NavigateNext />
//             </IconButton>
//           </>
//         )}

//         {/* Controles de zoom y pantalla completa */}
//         <Stack
//           direction="row"
//           spacing={1}
//           sx={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             ...(pantallaCompleta && {
//               top: 32,
//               right: 32,
//             }),
//           }}
//         >
//           <IconButton
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleZoom();
//             }}
//             sx={{
//               backgroundColor: "rgba(255, 255, 255, 0.9)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 1)",
//               },
//             }}
//           >
//             {zoomActivo ? <ZoomOut /> : <ZoomIn />}
//           </IconButton>

//           <IconButton
//             onClick={(e) => {
//               e.stopPropagation();
//               togglePantallaCompleta();
//             }}
//             sx={{
//               backgroundColor: "rgba(255, 255, 255, 0.9)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 1)",
//               },
//             }}
//           >
//             {pantallaCompleta ? <FullscreenExit /> : <Fullscreen />}
//           </IconButton>
//         </Stack>

//         {/* Indicador de imagen actual */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 16,
//             left: "50%",
//             transform: "translateX(-50%)",
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             color: "white",
//             borderRadius: 2,
//             px: 2,
//             py: 0.5,
//             fontSize: "0.875rem",
//             ...(pantallaCompleta && {
//               bottom: 32,
//             }),
//           }}
//         >
//           {imagenPrincipalIndex + 1} / {imagenes.length}
//         </Box>
//       </Paper>

//       {/* Miniaturas (solo mostrar si hay más de una imagen) */}
//       {imagenes.length > 1 && !pantallaCompleta && (
//         <Stack
//           direction="row"
//           spacing={1}
//           sx={{
//             mt: 2,
//             overflowX: "auto",
//             pb: 1,
//             "&::-webkit-scrollbar": {
//               height: 6,
//             },
//             "&::-webkit-scrollbar-track": {
//               backgroundColor: "grey.100",
//               borderRadius: 3,
//             },
//             "&::-webkit-scrollbar-thumb": {
//               backgroundColor: "grey.400",
//               borderRadius: 3,
//             },
//           }}
//         >
//           {imagenes.map((imagen, index) => (
//             <Paper
//               key={index}
//               elevation={imagenPrincipalIndex === index ? 3 : 0}
//               onClick={() => seleccionarImagen(index)}
//               sx={{
//                 width: 80,
//                 height: 80,
//                 borderRadius: 2,
//                 overflow: "hidden",
//                 flexShrink: 0,
//                 cursor: "pointer",
//                 border: imagenPrincipalIndex === index ? 2 : 0,
//                 borderColor: "primary.main",
//                 opacity: imagenPrincipalIndex === index ? 1 : 0.7,
//                 transition: "all 0.2s ease",
//                 "&:hover": {
//                   opacity: 1,
//                   transform: "scale(1.05)",
//                 },
//               }}
//             >
//               <img
//                 src={imagen}
//                 alt={`Miniatura ${index + 1}`}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                 }}
//               />
//             </Paper>
//           ))}
//         </Stack>
//       )}

//       {/* Controles móviles (gestos) */}
//       {esMovil && !pantallaCompleta && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             mt: 2,
//           }}
//         >
//           <IconButton
//             onClick={anteriorImagen}
//             sx={{
//               backgroundColor: "primary.main",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "primary.dark",
//               },
//             }}
//           >
//             <NavigateBefore />
//           </IconButton>

//           <IconButton
//             onClick={siguienteImagen}
//             sx={{
//               backgroundColor: "primary.main",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "primary.dark",
//               },
//             }}
//           >
//             <NavigateNext />
//           </IconButton>
//         </Box>
//       )}
//     </Box>
//   );
// };
import { useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Typography, // Agregar esta importación
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  NavigateBefore,
  NavigateNext,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";

export const GaleriaFotosProducto = ({
  imagenes = [],
  nombreProducto = "",
}) => {
  const [imagenPrincipalIndex, setImagenPrincipalIndex] = useState(0);
  const [zoomActivo, setZoomActivo] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  // Si no hay imágenes, mostrar un placeholder
  if (!imagenes || imagenes.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          p: 2,
          height: { xs: 300, md: 400 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "grey.300",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZoomIn sx={{ fontSize: 40, color: "grey.600" }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          No hay imágenes disponibles
        </Typography>
      </Paper>
    );
  }

  const imagenPrincipal = imagenes[imagenPrincipalIndex];

  const siguienteImagen = () => {
    setImagenPrincipalIndex((prev) =>
      prev === imagenes.length - 1 ? 0 : prev + 1
    );
  };

  const anteriorImagen = () => {
    setImagenPrincipalIndex((prev) =>
      prev === 0 ? imagenes.length - 1 : prev - 1
    );
  };

  const seleccionarImagen = (index) => {
    setImagenPrincipalIndex(index);
  };

  const toggleZoom = () => {
    setZoomActivo(!zoomActivo);
    if (pantallaCompleta) setPantallaCompleta(false);
  };

  const togglePantallaCompleta = () => {
    setPantallaCompleta(!pantallaCompleta);
    if (zoomActivo) setZoomActivo(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Imagen principal */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          p: pantallaCompleta ? 0 : 2,
          height: pantallaCompleta ? "85vh" : { xs: 300, md: 400 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: zoomActivo ? "zoom-out" : "zoom-in",
          transition: "all 0.3s ease",
          ...(pantallaCompleta && {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            borderRadius: 0,
          }),
        }}
        onClick={toggleZoom}
      >
        <img
          src={imagenPrincipal}
          alt={`${nombreProducto} - Imagen ${imagenPrincipalIndex + 1}`}
          style={{
            maxWidth: zoomActivo ? "150%" : "100%",
            maxHeight: zoomActivo ? "150%" : "100%",
            objectFit: "contain",
            borderRadius: zoomActivo ? 0 : 12,
            transition: "all 0.3s ease",
            transform: zoomActivo ? "scale(1.5)" : "scale(1)",
          }}
        />

        {/* Controles de la imagen principal */}
        {!esMovil && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                anteriorImagen();
              }}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
                ...(pantallaCompleta && {
                  left: 32,
                }),
              }}
            >
              <NavigateBefore />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                siguienteImagen();
              }}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
                ...(pantallaCompleta && {
                  right: 32,
                }),
              }}
            >
              <NavigateNext />
            </IconButton>
          </>
        )}

        {/* Controles de zoom y pantalla completa */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            ...(pantallaCompleta && {
              top: 32,
              right: 32,
            }),
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            {zoomActivo ? <ZoomOut /> : <ZoomIn />}
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              togglePantallaCompleta();
            }}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            {pantallaCompleta ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Stack>

        {/* Indicador de imagen actual */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            borderRadius: 2,
            px: 2,
            py: 0.5,
            fontSize: "0.875rem",
            ...(pantallaCompleta && {
              bottom: 32,
            }),
          }}
        >
          {imagenPrincipalIndex + 1} / {imagenes.length}
        </Box>
      </Paper>

      {/* Miniaturas (solo mostrar si hay más de una imagen) */}
      {imagenes.length > 1 && !pantallaCompleta && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "grey.100",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "grey.400",
              borderRadius: 3,
            },
          }}
        >
          {imagenes.map((imagen, index) => (
            <Paper
              key={index}
              elevation={imagenPrincipalIndex === index ? 3 : 0}
              onClick={() => seleccionarImagen(index)}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                overflow: "hidden",
                flexShrink: 0,
                cursor: "pointer",
                border: imagenPrincipalIndex === index ? 2 : 0,
                borderColor: "primary.main",
                opacity: imagenPrincipalIndex === index ? 1 : 0.7,
                transition: "all 0.2s ease",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.05)",
                },
              }}
            >
              <img
                src={imagen}
                alt={`Miniatura ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Paper>
          ))}
        </Stack>
      )}

      {/* Controles móviles (gestos) */}
      {esMovil && !pantallaCompleta && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <IconButton
            onClick={anteriorImagen}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <NavigateBefore />
          </IconButton>

          <IconButton
            onClick={siguienteImagen}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <NavigateNext />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
