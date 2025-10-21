import * as React from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useState } from "react";
import getItemsCarritoSer from "../services/getItemsCarritoSer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function CarritoBadge() {
  const { tokenCliente, rolTypeCliente } = useContext(AuthContext);

  const [cantidad, setCantidad] = useState(0);
  useEffect(() => {
    getItemsCarritoSer()
      .then((res) =>
        setCantidad(res.data.reduce((acum, item) => item.cantidad + acum, 0))
      )
      .catch((err) => console.log(err));
  }, []);

  return (
    <Link to={"/carrito"}>
      <IconButton aria-label="cart">
        <StyledBadge
          badgeContent={tokenCliente && rolTypeCliente ? cantidad : 0}
          color="secondary"
        >
          <ShoppingCartIcon />
        </StyledBadge>
      </IconButton>
    </Link>
  );
}
