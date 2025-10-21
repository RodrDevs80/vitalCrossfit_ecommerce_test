import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function CategoriaCard({ img, titulo, id }) {
  return (
    <Card
      sx={{
        width: "90%",
        border: "1px solid rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column", // Esto hace que los elementos se apilen verticalmente
      }}
    >
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain", // Cambiado de 'cover' a 'contain'
          backgroundRepeat: "no-repeat", // Evita que se repita la imagen
          backgroundPosition: "center", // Centra la imagen
          "&:hover": {
            scale: "1.1",
          },
        }}
        image={img}
        title={titulo}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {titulo}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: "auto" }}>
        {" "}
        {/* Empuja los botones al final */}
        <Button size="small">
          <Link to={`/`}>Home</Link>
        </Button>
        <Button size="small">
          <Link to={`/categorias/${id}`}>Mas info</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
