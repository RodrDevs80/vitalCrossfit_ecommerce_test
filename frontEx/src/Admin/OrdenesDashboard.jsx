import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  alpha,
  Container,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import NombreCliente from "../components/NombreCliente";

const OrdenesDashboard = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Colores para los gráficos con mejor contraste
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
  ];

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/v1/ordenes");

      if (!response.ok) {
        throw new Error("Error al cargar las órdenes");
      }

      const result = await response.json();

      if (result.status === 200) {
        setOrdenes(result.data || []);
      } else {
        setError(result.message || "Error al obtener las órdenes");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Datos para gráfico de órdenes por estado
  const datosPorEstado = () => {
    const conteoEstados = ordenes.reduce((acc, orden) => {
      acc[orden.estado] = (acc[orden.estado] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(conteoEstados).map(([estado, cantidad], index) => ({
      name: estado.charAt(0).toUpperCase() + estado.slice(1),
      value: cantidad,
      color: COLORS[index % COLORS.length],
    }));
  };

  // Datos para gráfico de tendencia mensual (simulado)
  const datosTendenciaMensual = () => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
    return meses.map((mes, index) => ({
      mes,
      ordenes: Math.floor(Math.random() * 50) + 20,
      completadas: Math.floor(Math.random() * 40) + 10,
    }));
  };

  // Estadísticas generales
  const estadisticas = {
    total: ordenes.length,
    pendientes: ordenes.filter((o) => o.estado === "pendiente").length,
    completadas: ordenes.filter((o) => o.estado === "completado").length,
    enProceso: ordenes.filter((o) => o.estado === "en_proceso").length,
  };

  // Componente de tarjeta de estadística reutilizable
  const StatCard = ({ title, value, color, icon }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${
          theme.palette[color].main
        } 0%, ${alpha(theme.palette[color].dark, 0.8)} 100%)`,
        color: "white",
        borderRadius: 2,
        boxShadow: theme.shadows[4],
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: "50%",
                backgroundColor: alpha("#fff", 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant={isMobile ? "body2" : "h6"} sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ fontWeight: "bold" }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={isMobile ? 40 : 60} />
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Cargando estadísticas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Error
          </Typography>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Estadísticas de Pedidos
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Resumen visual y estadísticas de todos los pedidos del sistema
        </Typography>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid
        container
        spacing={isMobile ? 1.5 : 2.5}
        sx={{ mb: 4, justifyContent: "center" }}
      >
        <Grid item xs={10} sm={6} md={3} sx={{ display: "flex" }}>
          <StatCard
            title="Total Pedidos"
            value={estadisticas.total}
            color="primary"
          />
        </Grid>
        <Grid item xs={10} sm={6} md={3} sx={{ display: "flex" }}>
          <StatCard
            title="Pendientes"
            value={estadisticas.pendientes}
            color="warning"
          />
        </Grid>
        <Grid item xs={10} sm={6} md={3} sx={{ display: "flex" }}>
          <StatCard
            title="En Proceso"
            value={estadisticas.enProceso}
            color="info"
          />
        </Grid>
        <Grid item xs={10} sm={6} md={3} sx={{ display: "flex" }}>
          <StatCard
            title="Completados"
            value={estadisticas.completadas}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Gráficos principales */}
      <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
        {/* Gráfico de distribución por estado */}
        <Grid item xs={12} md={10} lg={8} xl={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              "&:hover": {
                boxShadow: theme.shadows[4],
              },
              transition: "box-shadow 0.3s ease-in-out",
              mx: "auto",
              maxWidth: 800,
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Distribución por Estado
              </Typography>
              <Box sx={{ height: isMobile ? 250 : 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosPorEstado()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        isMobile
                          ? `${name}`
                          : `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={isMobile ? 70 : 80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosPorEstado().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} órdenes`, "Cantidad"]}
                    />
                    <Legend
                      wrapperStyle={{
                        textAlign: "center",
                        marginTop: "10px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de tendencia mensual */}
        <Grid item xs={12} md={10} lg={8} xl={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              "&:hover": {
                boxShadow: theme.shadows[4],
              },
              transition: "box-shadow 0.3s ease-in-out",
              mx: "auto",
              maxWidth: 800,
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Tendencia de Pedidos
              </Typography>
              <Box sx={{ height: isMobile ? 250 : 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosTendenciaMensual()}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(theme.palette.divider, 0.5)}
                    />
                    <XAxis dataKey="mes" fontSize={isMobile ? 12 : 14} />
                    <YAxis fontSize={isMobile ? 12 : 14} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        fontSize: isMobile ? 12 : 14,
                        textAlign: "center",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: isMobile ? 12 : 14,
                        paddingTop: 10,
                        textAlign: "center",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ordenes"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      activeDot={{ r: isMobile ? 6 : 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completadas"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabla de últimos pedidos */}
        <Grid item xs={12} md={11} lg={10} xl={8}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              "&:hover": {
                boxShadow: theme.shadows[4],
              },
              transition: "box-shadow 0.3s ease-in-out",
              mx: "auto",
              maxWidth: 1200,
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Últimos Pedidos
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 400,
                  borderRadius: 1,
                  boxShadow: "none",
                  border: `1px solid ${theme.palette.divider}`,
                  mx: "auto",
                }}
              >
                <Table stickyHeader size={isMobile ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: isMobile ? 12 : 14,
                          textAlign: "center",
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: isMobile ? 12 : 14,
                          textAlign: "center",
                        }}
                      >
                        Usuario
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: isMobile ? 12 : 14,
                          textAlign: "center",
                        }}
                      >
                        Estado
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: isMobile ? 12 : 14,
                          textAlign: "center",
                        }}
                      >
                        Teléfono
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordenes.slice(0, isMobile ? 3 : 5).map((orden) => (
                      <TableRow
                        key={orden.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.04
                            ),
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontSize: isMobile ? 12 : 14,
                            textAlign: "center",
                          }}
                        >
                          #{orden.id}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? 12 : 14,
                            textAlign: "center",
                          }}
                        >
                          <NombreCliente idUsuario={orden.idUsuario} />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Chip
                            label={orden.estado}
                            size={isMobile ? "small" : "medium"}
                            color={
                              orden.estado === "completado"
                                ? "success"
                                : orden.estado === "pendiente"
                                ? "warning"
                                : "info"
                            }
                            sx={{
                              fontWeight: "bold",
                              fontSize: isMobile ? 10 : 12,
                              mx: "auto",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: isMobile ? 12 : 14,
                            textAlign: "center",
                          }}
                        >
                          {orden.telefonoEnvio}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrdenesDashboard;
