import React from "react";
import Redes from "./RedesSociales.jsx";
import paypal from "../assets/imgPago/paypal.svg";
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  marginTop: "auto",
  color: theme.palette.text.secondary,
}));

const PaymentIcons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const navegación = [
  "Home",
  "Productos",
  "Categorías",
  "Ofertas",
  "Sobre nosotros",
];
const ayuda = [
  "Preguntas frecuentes",
  "Envíos y devoluciones",
  "Política de privacidad",
  "Términos y condiciones",
];
const contacto = [
  {
    icono: <LocationOn sx={{ mr: 1 }} />,
    texto: "Av. Principal 123, Ciudad",
  },
  {
    icono: <Phone sx={{ mr: 1 }} />,
    texto: "+1 234 567 890",
  },
  {
    icono: <Email sx={{ mr: 1 }} />,
    texto: "contacto@tienda.com",
  },
];

const FooterE = () => {
  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-evenly">
          {/* Sección 1: Enlaces rápidos */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Navegación
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
              {navegación.map((item, index) => (
                <li key={index}>
                  <Link href="#" color="inherit" underline="hover">
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>

          {/* Sección 2: Ayuda */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Ayuda
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
              {ayuda.map((item, index) => (
                <li key={index}>
                  <Link href="#" color="inherit" underline="hover">
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>

          {/* Sección 3: Contacto */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Contacto
            </Typography>
            <Box>
              {contacto.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  {item.icono}
                  <Typography>{item.texto}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Sección 4: Redes sociales y newsletter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box>
            {/*<IconButton sx={{ width: "80px" }} aria-label="Facebook" href="#">
              <Facebook />
            </IconButton>
            <IconButton sx={{ width: "80px" }} aria-label="Instagram" href="#">
              <Instagram />
            </IconButton>
            <IconButton sx={{ width: "80px" }} aria-label="Twitter" href="#">
              <Twitter />
            </IconButton>
            <IconButton sx={{ width: "80px" }} aria-label="LinkedIn" href="#">
              <LinkedIn />
            </IconButton>*/}
            <Redes />
          </Box>
          <Typography variant="h6" gutterBottom sx={{ marginTop: "20px" }}>
            Métodos de pago
          </Typography>
          <PaymentIcons>
            <img width={90} src={paypal} alt="PayPal" />
            <img
              width={90}
              src="https://getlogovector.com/wp-content/uploads/2023/12/mercado-pago-logo-vector-2023.png"
              alt="Mercado Pago"
            />
          </PaymentIcons>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" align="center" sx={{ color: "#309898" }}>
          © {new Date().getFullYear()} Carlos E Rodriguez bad💀design. Todos los
          derechos reservados.
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default FooterE;
