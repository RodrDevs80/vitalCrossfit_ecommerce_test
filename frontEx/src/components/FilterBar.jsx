import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchQuery: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (onFilterChange) {
      onFilterChange({ ...filters, [name]: value });
    }
  };

  const toggleFilter = (filterName) => {
    const newValue = !filters[filterName];
    setFilters((prev) => ({
      ...prev,
      [filterName]: newValue,
    }));
    if (onFilterChange) {
      onFilterChange({ ...filters, [filterName]: newValue });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Botón de Ofertas */}
        <Button
          variant={filters.showOffers ? "contained" : "outlined"}
          color="secondary"
          onClick={() => toggleFilter("showOffers")}
        >
          <Link to={"/ofertas"}>Ofertas</Link>
        </Button>

        <Divider orientation="vertical" flexItem />

        {/* Botón de Categorías */}
        <Button
          variant={filters.showOffers ? "contained" : "outlined"}
          color="secondary"
          onClick={() => toggleFilter("showOffers")}
        >
          <Link to={"/categorias"}>Categorías</Link>
        </Button>

        {/* Buscador por palabras clave */}
        <TextField
          label="Buscar producto"
          name="searchQuery"
          value={filters.searchQuery}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
          size="small"
          placeholder="Palabras clave..."
        />
      </Box>
    </Paper>
  );
};

export default FilterBar;
