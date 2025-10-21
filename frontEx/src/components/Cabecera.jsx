import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CarritoBadge from "./CarritoBadge";
import { Link } from "react-router-dom";
import logo from "../assets/logo/logoVital.jpg";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import getUserByIdLibre from "../services/getuserByIdlibre";

const pages = [
  "Home",
  "Productos",
  "Categorias",
  "Ofertas",
  "Sobre nosotros",
  "ApexFit",
];

function Cabecera() {
  const { tokenCliente, rolTypeCliente, idCliente } = useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [nombreCliente, setNombreCliente] = useState("");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    const getUserInfo = () => {
      getUserByIdLibre(idCliente)
        .then((res) =>
          setNombreCliente(`${res.usuario.nombre} ${res.usuario.apellido}`)
        )
        .catch((err) => console.log(err.message));
    };
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreCliente]);

  //console.log(nombreCliente);
  //console.log(idCliente);

  return (
    <AppBar position="static" sx={{ background: "#00CCC0" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Parte izquierda: Logo y título */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={logo}
              alt="Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: { xs: "none", md: "flex" },
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Proza Libre, sans-serif",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  transform: "scale(1.05)", // Efecto de escala
                },
                transition: "all 0.3s ease",
              }}
            >
              VCrossfit
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: "#374151", // Gris oscuro moderno
                "&:hover": {
                  backgroundColor: "#f3f4f6", // Gris muy claro al hover
                  borderRadius: "12px",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted={true}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": {
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #e5e7eb",
                  marginTop: "8px",
                  minWidth: "200px",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    padding: "12px 20px",
                    margin: "4px 8px",
                    borderRadius: "12px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f8fafc", // Azul muy claro al hover
                      transform: "translateX(4px)", // Efecto de deslizamiento sutil
                    },
                    "&:first-of-type": {
                      marginTop: "8px",
                    },
                    "&:last-of-type": {
                      marginBottom: "8px",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      width: "100%",
                      color: "#374151", // Gris oscuro para buena legibilidad
                      fontWeight: 500,
                      fontSize: "15px",
                      "& a": {
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                        width: "100%",
                        transition: "color 0.2s ease-in-out",
                        "&:hover": {
                          color: "#3b82f6", // Azul moderno al hover
                        },
                      },
                    }}
                  >
                    <Link to={page === "Home" ? "/" : `/${page.toLowerCase()}`}>
                      {page}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Título para móviles */}
          <Avatar
            src={logo}
            alt="Logo"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: { xs: "flex", md: "none" },
              mr: 1,
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            VCrossfit
          </Typography>

          {/* Parte derecha: Menú principal y avatar */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Menú principal para desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontFamily: "Proza Libre, sans-serif",
                    fontSize: "12px",
                    "&:hover": {
                      transform: "scale(1.05)", // Efecto de escala
                    },
                    transition: "all 0.3s ease", // Suaviza la transición
                  }}
                >
                  <Link to={page === "Home" ? "/" : `/${page.toLowerCase()}`}>
                    {page}
                  </Link>
                </Button>
              ))}
            </Box>
            <Box sx={{ mr: 2 }}>
              <CarritoBadge />
            </Box>
            {/* Avatar y menú de usuario */}
            <Box sx={{ flexGrow: 0 }}>
              <Link to={tokenCliente && rolTypeCliente ? null : `/login`}>
                <Tooltip
                  title={
                    tokenCliente && rolTypeCliente
                      ? `${nombreCliente}`
                      : "Logueate!"
                  }
                >
                  <IconButton sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        cursor:
                          tokenCliente && rolTypeCliente
                            ? `no-drop`
                            : `pointer`,
                      }}
                      alt={
                        tokenCliente && rolTypeCliente ? nombreCliente : null
                      }
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Cabecera;
