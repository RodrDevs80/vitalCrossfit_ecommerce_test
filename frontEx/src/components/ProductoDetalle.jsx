// import { useContext, useEffect } from "react";
// import { useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Card,
//   Typography,
//   Container,
//   Chip,
//   Grid,
//   Divider,
//   Paper,
//   TextField,
//   Rating,
//   Avatar,
//   Stack,
//   Pagination,
// } from "@mui/material";
// import getProductoById from "../services/getProductoById";
// import { calcularDescuento } from "../util/calcularDescuento";
// import { CuponContext } from "../context/cuponContext";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import PersonIcon from "@mui/icons-material/Person";
// import { ShoppingCartRounded } from "@mui/icons-material";
// import { GaleriaFotosProducto } from "./GaleriaFotosProducto";
// import getImgGaleriaByIdProd from "../services/getImgGaleriaByIdProd";
// import { AuthContext } from "../context/AuthContext";
// import SwAlertaComp from "../services/SwAlertaComp";
// import getCarritoByIdUserSer from "../services/getCarritoByIdUserSer";
// import getItemsCarritoSer from "../services/getItemsCarritoSer";
// import createItemCarritoService from "../services/createItemCarritoSer";
// import updateItemsCarrito from "../services/updateItemsCarrito";
// import createCarritoService from "../services/createCarrito";
// import getAllMensajesByProductoId from "../services/getMensajeByIdProductoSer";
// import createMensajeService from "../services/createMensajeService";
// import getUserByIdLibre from "../services/getuserByIdlibre";

// export const ProductoDetalle = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { tokenCliente, rolTypeCliente, idCliente } = useContext(AuthContext);
//   const [productoDetalle, setProductoDetalle] = useState({});
//   const [galeria, setGaleria] = useState([]);
//   const [opiniones, setOpiniones] = useState([]);
//   const [usuario, setUsuario] = useState("");
//   const [nuevaOpinion, setNuevaOpinion] = useState({
//     calificacion: 5,
//     comentario: "",
//   });

//   // Estados para la paginación
//   const [paginaActual, setPaginaActual] = useState(1);
//   const reseñasPorPagina = 5;

//   const createOpinion = (body) => {
//     createMensajeService(body)
//       .then((res) => {
//         console.log(res);
//         if (res.status === 201) {
//           getMensajes();
//           // Resetear a la primera página cuando se agrega una nueva reseña
//           setPaginaActual(1);
//         }
//       })
//       .catch((err) => console.log(err.message));
//   };

//   const getMensajes = () => {
//     getAllMensajesByProductoId(id)
//       .then((res) => setOpiniones(res.data))
//       .catch((err) => console.log(err.message));
//   };

//   // Cálculos para la paginación
//   const indiceUltimaReseña = paginaActual * reseñasPorPagina;
//   const indicePrimeraReseña = indiceUltimaReseña - reseñasPorPagina;
//   const reseñasActuales = opiniones.slice(
//     indicePrimeraReseña,
//     indiceUltimaReseña
//   );
//   const totalPaginas = Math.ceil(opiniones.length / reseñasPorPagina);

//   const handleCambioPagina = (event, valor) => {
//     setPaginaActual(valor);
//     // Scroll suave hacia la sección de reseñas
//     const seccionReseñas = document.getElementById("seccion-resenas");
//     if (seccionReseñas) {
//       seccionReseñas.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   const handleCompra = (producto) => {
//     if (tokenCliente && rolTypeCliente === "usuario") {
//       console.log(producto, idCliente);
//       getCarritoByIdUserSer(idCliente)
//         .then((primerRes) => {
//           //console.log("servicio: ", res.data[0].id);
//           if (primerRes.estado) {
//             getItemsCarritoSer().then((res) => {
//               //console.log("ver:", res);
//               const item = res.data.find((it) => it.idProducto === producto.id);
//               if (!item) {
//                 createItemCarritoService({
//                   idCarrito: primerRes.data[0].id,
//                   idProducto: producto.id,
//                   cantidad: 1,
//                   precioUnitario: producto.precio,
//                 });
//               } else {
//                 //console.log(item);
//                 updateItemsCarrito(item.id, {
//                   idCarrito: item.idCarrito,
//                   idProducto: item.idProducto,
//                   cantidad: item.cantidad + 1,
//                   precioUnitario: item.precioUnitario,
//                 });
//               }
//             });
//           } else {
//             createCarritoService({ idUsuario: idCliente }).then((res) => {
//               if (res.status === 201) {
//                 createItemCarritoService({
//                   idCarrito: res.data.id,
//                   idProducto: producto.id,
//                   cantidad: 1,
//                   precioUnitario: producto.precio,
//                 });
//               }
//             });
//           }
//         })
//         .catch((err) => console.log(err));
//       SwAlertaComp(
//         "Producto agregado con éxito!",
//         "El producto se agrego al carrito 🛒",
//         "success"
//       );
//       setTimeout(() => {
//         navigate("/carrito");
//       }, 2000);
//     } else {
//       SwAlertaComp(
//         "No esta logueado,",
//         "Debe iniciar sesión para poder comprar",
//         "info"
//       );
//       setTimeout(() => {
//         navigate("/login");
//       }, 5000);
//     }
//   };

//   //console.log("Token: ", tokenCliente);
//   //console.log("Type: ", rolTypeCliente);
//   const { cupon, cuponValido } = useContext(CuponContext);

//   const handleSubmitOpinion = (e) => {
//     e.preventDefault();
//     if (nuevaOpinion.comentario.trim()) {
//       createOpinion({
//         idProducto: Number(id),
//         texto: nuevaOpinion.comentario,
//         calificacion: nuevaOpinion.calificacion,
//       });
//     }
//     setNuevaOpinion({ calificacion: 5, comentario: "" });
//   };

//   const calcularPromedioCalificacion = () => {
//     if (opiniones.length === 0) return 0;
//     const suma = opiniones.reduce(
//       (acc, opinion) => acc + opinion.calificacion,
//       0
//     );
//     return (suma / opiniones.length).toFixed(1);
//   };

//   useEffect(() => {
//     getProductoById(id)
//       .then((res) => setProductoDetalle(res))
//       .catch((err) => console.log(err));

//     getImgGaleriaByIdProd(id)
//       .then((res) => {
//         //console.log(res);
//         setGaleria(res);
//       })
//       .catch((err) => console.log(err));
//     getMensajes();

//     getUserByIdLibre(idCliente)
//       .then((res) =>
//         setUsuario(`${res.usuario.nombre} ${res.usuario.apellido}`)
//       )
//       .catch((err) => console.log(err.message));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   //console.log(opiniones);
//   return (
//     <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
//       {/* Layout responsivo - se mantiene igual */}
//       <Grid
//         sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" } }}
//         spacing={4}
//       >
//         <Grid item xs={12} md={6} sx={{ marginRight: "10px" }}>
//           <Paper
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               overflow: "hidden",
//               background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//               p: 2,
//               height: { xs: 500, md: 700 },
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <GaleriaFotosProducto
//               imagenes={[productoDetalle.imagenUrl, ...galeria]}
//               nombreProducto={productoDetalle.nombre}
//             />
//           </Paper>
//         </Grid>
//         {/* Información del producto */}
//         <Grid item xs={12} md={6} mt={2}>
//           <Box
//             sx={{ height: "100%", display: "flex", flexDirection: "column" }}
//           >
//             {/* Título */}
//             <Typography
//               variant="h3"
//               component="h1"
//               sx={{
//                 fontSize: {
//                   xs: "1.75rem",
//                   sm: "2.25rem",
//                   md: "2.75rem",
//                 },
//                 fontWeight: 700,
//                 color: "text.primary",
//                 mb: 2,
//                 lineHeight: 1.2,
//               }}
//             >
//               {productoDetalle.nombre}
//             </Typography>

//             {/* Descripción */}
//             <Typography
//               variant="body1"
//               sx={{
//                 fontSize: {
//                   xs: "1rem",
//                   sm: "1.1rem",
//                   md: "1.2rem",
//                 },
//                 color: "text.secondary",
//                 mb: 3,
//                 lineHeight: 1.6,
//               }}
//             >
//               {productoDetalle.descripcion}
//             </Typography>

//             {/* Precio */}
//             <Box sx={{ mb: 4 }}>
//               {cuponValido && productoDetalle.id === cupon.idProducto ? (
//                 <Box className="space-y-2">
//                   <Typography
//                     variant="body2"
//                     className="text-slate-500 line-through text-2xl"
//                   >
//                     ${productoDetalle.precio}
//                   </Typography>
//                   <Box className="flex items-center gap-2 flex-wrap">
//                     <Chip
//                       icon={<LocalOfferIcon />}
//                       label={`Cupón: ${cupon.nombre}`}
//                       color="success"
//                       variant="filled"
//                       sx={{ fontWeight: 600 }}
//                     />
//                     <Typography
//                       variant="h4"
//                       className="text-green-600 font-bold"
//                     >
//                       $
//                       {calcularDescuento(
//                         productoDetalle.precio,
//                         cupon.porcentajeDescuento
//                       )}
//                     </Typography>
//                     <Chip
//                       label={`${cupon.porcentajeDescuento}% OFF`}
//                       color="success"
//                       size="small"
//                       sx={{ fontWeight: 600 }}
//                     />
//                   </Box>
//                 </Box>
//               ) : productoDetalle.oferta ? (
//                 <Box className="space-y-2">
//                   <Typography
//                     variant="body2"
//                     className="text-slate-500 line-through text-2xl"
//                   >
//                     ${productoDetalle.precio}
//                   </Typography>
//                   <Box className="flex items-center gap-2 flex-wrap">
//                     <Typography
//                       variant="h4"
//                       className="text-blue-600 font-bold"
//                     >
//                       $
//                       {calcularDescuento(
//                         productoDetalle.precio,
//                         productoDetalle.descuento
//                       )}
//                     </Typography>
//                     <Chip
//                       label={`${productoDetalle.descuento}% OFF`}
//                       color="primary"
//                       size="small"
//                       sx={{ fontWeight: 600 }}
//                     />
//                   </Box>
//                 </Box>
//               ) : (
//                 <Typography variant="h4" className="text-slate-700 font-bold">
//                   ${productoDetalle.precio}
//                 </Typography>
//               )}
//               <Button
//                 onClick={() => handleCompra(productoDetalle)}
//                 variant="contained"
//                 size="medium"
//                 sx={{
//                   "&:hover": {
//                     scale: "1.1",
//                   },
//                 }}
//                 startIcon={<ShoppingCartRounded />}
//               >
//                 Comprar
//               </Button>
//             </Box>

//             <Divider sx={{ my: 3, borderColor: "slate.200" }} />

//             {/* Especificaciones */}
//             <Box sx={{ flex: 1 }}>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontSize: {
//                     xs: "1.1rem",
//                     sm: "1.25rem",
//                     md: "1.4rem",
//                   },
//                   fontWeight: 600,
//                   mb: 2,
//                   color: "text.primary",
//                 }}
//               >
//                 Especificaciones:
//               </Typography>

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   borderRadius: 2,
//                   backgroundColor: "grey.50",
//                   border: "1px solid",
//                   borderColor: "grey.200",
//                 }}
//               >
//                 <Box component="ul" className="space-y-2 list-none p-0 m-0">
//                   {Object.keys(productoDetalle).length !== 0 &&
//                     productoDetalle.especificaciones
//                       ?.split(".")
//                       .filter((item) => item.trim())
//                       .map((item, index) => (
//                         <Typography
//                           key={index}
//                           component="li"
//                           variant="body2"
//                           sx={{
//                             fontSize: {
//                               xs: "0.9rem",
//                               sm: "1rem",
//                             },
//                             color: "text.secondary",
//                             display: "flex",
//                             alignItems: "flex-start",
//                             "&:before": {
//                               content: '"•"',
//                               color: "primary.main",
//                               fontWeight: "bold",
//                               width: "1em",
//                               flexShrink: 0,
//                               marginRight: 1,
//                             },
//                           }}
//                         >
//                           {item.trim()}
//                         </Typography>
//                       ))}
//                 </Box>
//                 {/* Sección de Opiniones */}
//                 <Box sx={{ mt: 6 }} id="seccion-resenas">
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 4,
//                       borderRadius: 3,
//                       backgroundColor: "grey.50",
//                       border: "1px solid",
//                       borderColor: "grey.200",
//                     }}
//                   >
//                     {/* Header de opiniones */}
//                     <Box sx={{ mb: 4 }}>
//                       <Typography
//                         variant="h4"
//                         sx={{
//                           fontSize: {
//                             xs: "1.5rem",
//                             sm: "1.75rem",
//                             md: "2rem",
//                           },
//                           fontWeight: 700,
//                           mb: 2,
//                           color: "text.primary",
//                         }}
//                       >
//                         Opiniones de clientes
//                       </Typography>

//                       <Box className="flex items-center gap-3 flex-wrap">
//                         <Rating
//                           value={parseFloat(calcularPromedioCalificacion())}
//                           readOnly
//                           precision={0.1}
//                           sx={{ fontSize: "1.5rem" }}
//                         />
//                         <Typography variant="h6" className="font-semibold">
//                           {calcularPromedioCalificacion()}
//                         </Typography>
//                         <Typography variant="body2" className="text-slate-600">
//                           ({opiniones.length}{" "}
//                           {opiniones.length === 1 ? "reseña" : "reseñas"})
//                         </Typography>
//                       </Box>
//                     </Box>

//                     {/* Formulario para nueva opinión */}
//                     {tokenCliente && rolTypeCliente === "usuario" ? (
//                       <>
//                         <Divider sx={{ mb: 4 }} />
//                         <Box sx={{ mb: 4 }}>
//                           <Typography
//                             variant="h6"
//                             sx={{ mb: 2, fontWeight: 600 }}
//                           >
//                             Deja tu opinión
//                           </Typography>

//                           <form onSubmit={handleSubmitOpinion}>
//                             <Grid container spacing={3}>
//                               <Grid item xs={12} sm={6}>
//                                 <TextField
//                                   fullWidth
//                                   label="Tu nombre"
//                                   variant="outlined"
//                                   value={usuario}
//                                   onChange={(e) =>
//                                     setNuevaOpinion((prev) => ({
//                                       ...prev,
//                                       usuario: e.target.value,
//                                     }))
//                                   }
//                                   required
//                                   sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                       borderRadius: 2,
//                                     },
//                                   }}
//                                 />
//                               </Grid>

//                               <Grid item xs={12} sm={6}>
//                                 <Box>
//                                   <Typography
//                                     variant="body2"
//                                     sx={{ mb: 1, fontWeight: 500 }}
//                                   >
//                                     Calificación
//                                   </Typography>
//                                   <Rating
//                                     value={nuevaOpinion.calificacion}
//                                     onChange={(event, newValue) => {
//                                       setNuevaOpinion((prev) => ({
//                                         ...prev,
//                                         calificacion: newValue || 1,
//                                       }));
//                                     }}
//                                     sx={{ fontSize: "2rem" }}
//                                   />
//                                 </Box>
//                               </Grid>

//                               <Grid item xs={12}>
//                                 <TextField
//                                   fullWidth
//                                   multiline
//                                   rows={3}
//                                   label="Tu comentario"
//                                   variant="outlined"
//                                   value={nuevaOpinion.comentario}
//                                   onChange={(e) =>
//                                     setNuevaOpinion((prev) => ({
//                                       ...prev,
//                                       comentario: e.target.value,
//                                     }))
//                                   }
//                                   required
//                                   sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                       borderRadius: 2,
//                                     },
//                                   }}
//                                 />
//                               </Grid>

//                               <Grid item xs={12}>
//                                 <Button
//                                   type="submit"
//                                   variant="contained"
//                                   sx={{
//                                     borderRadius: 2,
//                                     px: 4,
//                                     py: 1.5,
//                                     textTransform: "none",
//                                     fontSize: "1rem",
//                                     fontWeight: 600,
//                                   }}
//                                 >
//                                   Publicar opinión
//                                 </Button>
//                               </Grid>
//                             </Grid>
//                           </form>
//                         </Box>
//                         <Divider sx={{ mb: 4 }} />
//                       </>
//                     ) : null}

//                     {/* Lista de opiniones PAGINADA */}
//                     <Box>
//                       <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
//                         Reseñas de usuarios
//                       </Typography>

//                       <Stack spacing={3}>
//                         {reseñasActuales.map((opinion) => (
//                           <Paper
//                             key={opinion.id}
//                             elevation={0}
//                             sx={{
//                               p: 3,
//                               borderRadius: 2,
//                               backgroundColor: "white",
//                               border: "1px solid",
//                               borderColor: "grey.200",
//                             }}
//                           >
//                             <Box className="flex items-start gap-3">
//                               <Avatar
//                                 sx={{
//                                   bgcolor: "primary.main",
//                                   width: 40,
//                                   height: 40,
//                                 }}
//                               >
//                                 <PersonIcon />
//                               </Avatar>

//                               <Box className="flex-1">
//                                 <Box className="flex items-center justify-between flex-wrap gap-2 mb-2">
//                                   <Typography
//                                     variant="subtitle1"
//                                     className="font-semibold"
//                                   >
//                                     {usuario}
//                                   </Typography>
//                                   <Typography
//                                     variant="caption"
//                                     className="text-slate-500"
//                                   >
//                                     {new Date(
//                                       opinion.fechaCreacion
//                                     ).toLocaleDateString("es-ES", {
//                                       year: "numeric",
//                                       month: "long",
//                                       day: "numeric",
//                                     })}
//                                   </Typography>
//                                 </Box>

//                                 <Rating
//                                   value={opinion.calificacion}
//                                   readOnly
//                                   size="small"
//                                   sx={{ mb: 1 }}
//                                 />

//                                 <Typography
//                                   variant="body2"
//                                   className="text-slate-700 leading-relaxed"
//                                 >
//                                   {opinion.texto}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </Paper>
//                         ))}

//                         {reseñasActuales.length === 0 && (
//                           <Box className="text-center py-8">
//                             <Typography
//                               variant="body2"
//                               className="text-slate-500"
//                             >
//                               Aún no hay opiniones para este producto. ¡Sé el
//                               primero en dejar una reseña!
//                             </Typography>
//                           </Box>
//                         )}
//                       </Stack>

//                       {/* PAGINACIÓN - Solo se muestra si hay más de 5 reseñas */}
//                       {opiniones.length > reseñasPorPagina && (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             mt: 4,
//                             mb: 2,
//                           }}
//                         >
//                           <Pagination
//                             count={totalPaginas}
//                             page={paginaActual}
//                             onChange={handleCambioPagina}
//                             color="primary"
//                             size="medium"
//                             showFirstButton
//                             showLastButton
//                             sx={{
//                               "& .MuiPaginationItem-root": {
//                                 borderRadius: 1,
//                                 fontSize: "0.9rem",
//                               },
//                             }}
//                           />
//                         </Box>
//                       )}

//                       {/* Información de la página actual */}
//                       {opiniones.length > 0 && (
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             textAlign: "center",
//                             mt: 1,
//                             color: "text.secondary",
//                             fontStyle: "italic",
//                           }}
//                         >
//                           Mostrando {reseñasActuales.length} de{" "}
//                           {opiniones.length} reseñas
//                           {totalPaginas > 1 &&
//                             ` - Página ${paginaActual} de ${totalPaginas}`}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Paper>
//                 </Box>
//               </Paper>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//       {/* Botón de regreso */}
//       <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
//         <Button
//           component={Link}
//           to="/"
//           variant="outlined"
//           startIcon={<ArrowBackIcon />}
//           sx={{
//             borderRadius: 3,
//             px: 4,
//             py: 1.5,
//             textTransform: "none",
//             fontSize: "1.1rem",
//             fontWeight: 600,
//             borderColor: "grey.300",
//             color: "text.primary",
//             "&:hover": {
//               borderColor: "primary.main",
//               backgroundColor: "primary.50",
//             },
//           }}
//         >
//           Volver a productos
//         </Button>
//       </Box>
//     </Container>
//   );
// };
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Typography,
  Container,
  Chip,
  Grid,
  Divider,
  Paper,
  TextField,
  Rating,
  Avatar,
  Stack,
  Pagination,
} from "@mui/material";
import getProductoById from "../services/getProductoById";
import { calcularDescuento } from "../util/calcularDescuento";
import { CuponContext } from "../context/cuponContext";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import { ShoppingCartRounded } from "@mui/icons-material";
import { GaleriaFotosProducto } from "./GaleriaFotosProducto";
import getImgGaleriaByIdProd from "../services/getImgGaleriaByIdProd";
import { AuthContext } from "../context/AuthContext";
import SwAlertaComp from "../services/SwAlertaComp";
import getCarritoByIdUserSer from "../services/getCarritoByIdUserSer";
import getItemsCarritoSer from "../services/getItemsCarritoSer";
import createItemCarritoService from "../services/createItemCarritoSer";
import updateItemsCarrito from "../services/updateItemsCarrito";
import createCarritoService from "../services/createCarrito";
import getAllMensajesByProductoId from "../services/getMensajeByIdProductoSer";
import createMensajeService from "../services/createMensajeService";
import getUserByIdLibre from "../services/getuserByIdlibre";

export const ProductoDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tokenCliente, rolTypeCliente, idCliente } = useContext(AuthContext);
  const [productoDetalle, setProductoDetalle] = useState({});
  const [galeria, setGaleria] = useState([]);
  const [opiniones, setOpiniones] = useState([]);
  const [opinionesOrdenadas, setOpinionesOrdenadas] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [nuevaOpinion, setNuevaOpinion] = useState({
    calificacion: 5,
    comentario: "",
  });

  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const reseñasPorPagina = 5;

  const createOpinion = (body) => {
    createMensajeService(body)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          getMensajes();
          // Resetear a la primera página cuando se agrega una nueva reseña
          setPaginaActual(1);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const getMensajes = () => {
    getAllMensajesByProductoId(id)
      .then((res) => {
        setOpiniones(res.data);
        // Ordenar las opiniones por fecha de creación descendente
        const opinionesOrdenadas = res.data.sort(
          (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        );
        setOpinionesOrdenadas(opinionesOrdenadas);
      })
      .catch((err) => console.log(err.message));
  };

  // Cálculos para la paginación - usando opinionesOrdenadas
  const indiceUltimaReseña = paginaActual * reseñasPorPagina;
  const indicePrimeraReseña = indiceUltimaReseña - reseñasPorPagina;
  const reseñasActuales = opinionesOrdenadas.slice(
    indicePrimeraReseña,
    indiceUltimaReseña
  );
  const totalPaginas = Math.ceil(opinionesOrdenadas.length / reseñasPorPagina);

  const handleCambioPagina = (event, valor) => {
    setPaginaActual(valor);
    // Scroll suave hacia la sección de reseñas
    const seccionReseñas = document.getElementById("seccion-resenas");
    if (seccionReseñas) {
      seccionReseñas.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCompra = (producto) => {
    if (tokenCliente && rolTypeCliente === "usuario") {
      console.log(producto, idCliente);
      getCarritoByIdUserSer(idCliente)
        .then((primerRes) => {
          //console.log("servicio: ", res.data[0].id);
          if (primerRes.estado) {
            getItemsCarritoSer().then((res) => {
              //console.log("ver:", res);
              const item = res.data.find((it) => it.idProducto === producto.id);
              if (!item) {
                createItemCarritoService({
                  idCarrito: primerRes.data[0].id,
                  idProducto: producto.id,
                  cantidad: 1,
                  precioUnitario: producto.precio,
                });
              } else {
                //console.log(item);
                updateItemsCarrito(item.id, {
                  idCarrito: item.idCarrito,
                  idProducto: item.idProducto,
                  cantidad: item.cantidad + 1,
                  precioUnitario: item.precioUnitario,
                });
              }
            });
          } else {
            createCarritoService({ idUsuario: idCliente }).then((res) => {
              if (res.status === 201) {
                createItemCarritoService({
                  idCarrito: res.data.id,
                  idProducto: producto.id,
                  cantidad: 1,
                  precioUnitario: producto.precio,
                });
              }
            });
          }
        })
        .catch((err) => console.log(err));
      SwAlertaComp(
        "Producto agregado con éxito!",
        "El producto se agrego al carrito 🛒",
        "success"
      );
      setTimeout(() => {
        navigate("/carrito");
      }, 2000);
    } else {
      SwAlertaComp(
        "No esta logueado,",
        "Debe iniciar sesión para poder comprar",
        "info"
      );
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  };

  //console.log("Token: ", tokenCliente);
  //console.log("Type: ", rolTypeCliente);
  const { cupon, cuponValido } = useContext(CuponContext);

  const handleSubmitOpinion = (e) => {
    e.preventDefault();
    if (nuevaOpinion.comentario.trim()) {
      createOpinion({
        idProducto: Number(id),
        texto: nuevaOpinion.comentario,
        calificacion: nuevaOpinion.calificacion,
      });
    }
    setNuevaOpinion({ calificacion: 5, comentario: "" });
  };

  const calcularPromedioCalificacion = () => {
    if (opiniones.length === 0) return 0;
    const suma = opiniones.reduce(
      (acc, opinion) => acc + opinion.calificacion,
      0
    );
    return (suma / opiniones.length).toFixed(1);
  };

  useEffect(() => {
    getProductoById(id)
      .then((res) => setProductoDetalle(res))
      .catch((err) => console.log(err));

    getImgGaleriaByIdProd(id)
      .then((res) => {
        //console.log(res);
        setGaleria(res);
      })
      .catch((err) => console.log(err));
    getMensajes();

    getUserByIdLibre(idCliente)
      .then((res) =>
        setUsuario(`${res.usuario.nombre} ${res.usuario.apellido}`)
      )
      .catch((err) => console.log(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //console.log(opiniones);
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Layout responsivo - se mantiene igual */}
      <Grid
        sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" } }}
        spacing={4}
      >
        <Grid item xs={12} md={6} sx={{ marginRight: "10px" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              p: 2,
              height: { xs: 500, md: 700 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GaleriaFotosProducto
              imagenes={[productoDetalle.imagenUrl, ...galeria]}
              nombreProducto={productoDetalle.nombre}
            />
          </Paper>
        </Grid>
        {/* Información del producto */}
        <Grid item xs={12} md={6} mt={2}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Título */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: {
                  xs: "1.75rem",
                  sm: "2.25rem",
                  md: "2.75rem",
                },
                fontWeight: 700,
                color: "text.primary",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {productoDetalle.nombre}
            </Typography>

            {/* Descripción */}
            <Typography
              variant="body1"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.2rem",
                },
                color: "text.secondary",
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              {productoDetalle.descripcion}
            </Typography>

            {/* Precio */}
            <Box sx={{ mb: 4 }}>
              {cuponValido && productoDetalle.id === cupon.idProducto ? (
                <Box className="space-y-2">
                  <Typography
                    variant="body2"
                    className="text-slate-500 line-through text-2xl"
                  >
                    ${productoDetalle.precio}
                  </Typography>
                  <Box className="flex items-center gap-2 flex-wrap">
                    <Chip
                      icon={<LocalOfferIcon />}
                      label={`Cupón: ${cupon.nombre}`}
                      color="success"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography
                      variant="h4"
                      className="text-green-600 font-bold"
                    >
                      $
                      {calcularDescuento(
                        productoDetalle.precio,
                        cupon.porcentajeDescuento
                      )}
                    </Typography>
                    <Chip
                      label={`${cupon.porcentajeDescuento}% OFF`}
                      color="success"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
              ) : productoDetalle.oferta ? (
                <Box className="space-y-2">
                  <Typography
                    variant="body2"
                    className="text-slate-500 line-through text-2xl"
                  >
                    ${productoDetalle.precio}
                  </Typography>
                  <Box className="flex items-center gap-2 flex-wrap">
                    <Typography
                      variant="h4"
                      className="text-blue-600 font-bold"
                    >
                      $
                      {calcularDescuento(
                        productoDetalle.precio,
                        productoDetalle.descuento
                      )}
                    </Typography>
                    <Chip
                      label={`${productoDetalle.descuento}% OFF`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="h4" className="text-slate-700 font-bold">
                  ${productoDetalle.precio}
                </Typography>
              )}
              <Button
                onClick={() => handleCompra(productoDetalle)}
                variant="contained"
                size="medium"
                sx={{
                  "&:hover": {
                    scale: "1.1",
                  },
                }}
                startIcon={<ShoppingCartRounded />}
              >
                Comprar
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: "slate.200" }} />

            {/* Especificaciones */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.25rem",
                    md: "1.4rem",
                  },
                  fontWeight: 600,
                  mb: 2,
                  color: "text.primary",
                }}
              >
                Especificaciones:
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box component="ul" className="space-y-2 list-none p-0 m-0">
                  {Object.keys(productoDetalle).length !== 0 &&
                    productoDetalle.especificaciones
                      ?.split(".")
                      .filter((item) => item.trim())
                      .map((item, index) => (
                        <Typography
                          key={index}
                          component="li"
                          variant="body2"
                          sx={{
                            fontSize: {
                              xs: "0.9rem",
                              sm: "1rem",
                            },
                            color: "text.secondary",
                            display: "flex",
                            alignItems: "flex-start",
                            "&:before": {
                              content: '"•"',
                              color: "primary.main",
                              fontWeight: "bold",
                              width: "1em",
                              flexShrink: 0,
                              marginRight: 1,
                            },
                          }}
                        >
                          {item.trim()}
                        </Typography>
                      ))}
                </Box>
                {/* Sección de Opiniones */}
                <Box sx={{ mt: 6 }} id="seccion-resenas">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      backgroundColor: "grey.50",
                      border: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    {/* Header de opiniones */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: {
                            xs: "1.5rem",
                            sm: "1.75rem",
                            md: "2rem",
                          },
                          fontWeight: 700,
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        Opiniones de clientes
                      </Typography>

                      <Box className="flex items-center gap-3 flex-wrap">
                        <Rating
                          value={parseFloat(calcularPromedioCalificacion())}
                          readOnly
                          precision={0.1}
                          sx={{ fontSize: "1.5rem" }}
                        />
                        <Typography variant="h6" className="font-semibold">
                          {calcularPromedioCalificacion()}
                        </Typography>
                        <Typography variant="body2" className="text-slate-600">
                          ({opiniones.length}{" "}
                          {opiniones.length === 1 ? "reseña" : "reseñas"})
                        </Typography>
                      </Box>
                    </Box>

                    {/* Formulario para nueva opinión */}
                    {tokenCliente && rolTypeCliente === "usuario" ? (
                      <>
                        <Divider sx={{ mb: 4 }} />
                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                          >
                            Deja tu opinión
                          </Typography>

                          <form onSubmit={handleSubmitOpinion}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Tu nombre"
                                  variant="outlined"
                                  value={usuario}
                                  onChange={(e) =>
                                    setNuevaOpinion((prev) => ({
                                      ...prev,
                                      usuario: e.target.value,
                                    }))
                                  }
                                  required
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ mb: 1, fontWeight: 500 }}
                                  >
                                    Calificación
                                  </Typography>
                                  <Rating
                                    value={nuevaOpinion.calificacion}
                                    onChange={(event, newValue) => {
                                      setNuevaOpinion((prev) => ({
                                        ...prev,
                                        calificacion: newValue || 1,
                                      }));
                                    }}
                                    sx={{ fontSize: "2rem" }}
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  label="Tu comentario"
                                  variant="outlined"
                                  value={nuevaOpinion.comentario}
                                  onChange={(e) =>
                                    setNuevaOpinion((prev) => ({
                                      ...prev,
                                      comentario: e.target.value,
                                    }))
                                  }
                                  required
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Publicar opinión
                                </Button>
                              </Grid>
                            </Grid>
                          </form>
                        </Box>
                        <Divider sx={{ mb: 4 }} />
                      </>
                    ) : null}

                    {/* Lista de opiniones PAGINADA y ORDENADA */}
                    <Box>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Reseñas de usuarios
                        <Typography
                          variant="caption"
                          sx={{ ml: 1, color: "text.secondary" }}
                        >
                          (Más recientes primero)
                        </Typography>
                      </Typography>

                      <Stack spacing={3}>
                        {reseñasActuales.map((opinion) => (
                          <Paper
                            key={opinion.id}
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              backgroundColor: "white",
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            <Box className="flex items-start gap-3">
                              <Avatar
                                sx={{
                                  bgcolor: "primary.main",
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                <PersonIcon />
                              </Avatar>

                              <Box className="flex-1">
                                <Box className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                  <Typography
                                    variant="subtitle1"
                                    className="font-semibold"
                                  >
                                    {usuario}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    className="text-slate-500"
                                  >
                                    {new Date(
                                      opinion.fechaCreacion
                                    ).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Typography>
                                </Box>

                                <Rating
                                  value={opinion.calificacion}
                                  readOnly
                                  size="small"
                                  sx={{ mb: 1 }}
                                />

                                <Typography
                                  variant="body2"
                                  className="text-slate-700 leading-relaxed"
                                >
                                  {opinion.texto}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        ))}

                        {reseñasActuales.length === 0 && (
                          <Box className="text-center py-8">
                            <Typography
                              variant="body2"
                              className="text-slate-500"
                            >
                              Aún no hay opiniones para este producto. ¡Sé el
                              primero en dejar una reseña!
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      {/* PAGINACIÓN - Solo se muestra si hay más de 5 reseñas */}
                      {opinionesOrdenadas.length > reseñasPorPagina && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                            mb: 2,
                          }}
                        >
                          <Pagination
                            count={totalPaginas}
                            page={paginaActual}
                            onChange={handleCambioPagina}
                            color="primary"
                            size="medium"
                            showFirstButton
                            showLastButton
                            sx={{
                              "& .MuiPaginationItem-root": {
                                borderRadius: 1,
                                fontSize: "0.9rem",
                              },
                            }}
                          />
                        </Box>
                      )}

                      {/* Información de la página actual */}
                      {opinionesOrdenadas.length > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            mt: 1,
                            color: "text.secondary",
                            fontStyle: "italic",
                          }}
                        >
                          Mostrando {reseñasActuales.length} de{" "}
                          {opinionesOrdenadas.length} reseñas
                          {totalPaginas > 1 &&
                            ` - Página ${paginaActual} de ${totalPaginas}`}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Botón de regreso */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: 600,
            borderColor: "grey.300",
            color: "text.primary",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "primary.50",
            },
          }}
        >
          Volver a productos
        </Button>
      </Box>
    </Container>
  );
};
