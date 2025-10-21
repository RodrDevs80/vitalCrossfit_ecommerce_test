import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import imgApexFit from "../mocks/imgApexFit/unnamed.jpg";
import { Link } from "react-router-dom";
export const Hero = () => {
  return (
    <>
      <Card
        elevation={0}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "repeat(2, 1fr)",
          },
          gridTemplateRows: "1fr",
          margin: {
            xs: "20px",
            sm: "15px",
            lg: "22px",
          },
          padding: "32px",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          marginBottom: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "column",
            backgroundColor: "#f8fafc",
            padding: "40px 32px",
            borderRadius: "12px",
            gap: 3,
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            gutterBottom
            className="titulo"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
              fontWeight: "700",
              textAlign: "center",
              fontFamily: "system-ui, -apple-system, sans-serif",
              color: "#1e293b",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            ¡Tu Bienestar, Tu Forma!
          </Typography>
          <Typography
            sx={{
              color: "#475569",
              textAlign: "center",
              fontSize: "1rem",
              lineHeight: 1.5,
              maxWidth: "280px",
            }}
          >
            ¿Cansado de rutinas que no funcionan? ApexFit te ofrece planes de
            ejercicio y nutrición a medida, creados por IA para tus objetivos.
            ¡Transforma tu cuerpo, transforma tu vida!
          </Typography>
          <ButtonGroup
            sx={{
              gap: 1,
              "& .MuiButton-root": {
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "500",
                padding: "10px 20px",
              },
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <Link to={"/apexfit"}>"¡Empezar Ahora!"</Link>
            </Button>
          </ButtonGroup>
        </Box>
        <CardMedia
          component="img"
          image={imgApexFit}
          alt="ApexFit IA de entrenamiento personal"
          sx={{
            width: "100%",
            margin: "10px",
            borderRadius: "8px",
            "&:hover": {
              transform: "scale(1.02)",
            },
            transition: "transform 0.3s ease",
          }}
        />
      </Card>
    </>
  );
};
