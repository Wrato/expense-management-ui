import {
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import { useState } from "react";

import { categories } from "../mocks/categories";

export default function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit =
    id !== undefined;

  const category = isEdit
  ? categories.find(
      category => category.id === Number(id)
    )
  : undefined;

    const [name, setName] = useState(
    category?.name ?? ""
    );

  const handleSave = () => {
    if (!name.trim()) {
      alert(
        "El nombre de la categoría es obligatorio."
      );
      return;
    }

    if (isEdit) {
      const category =
        categories.find(
          category =>
            category.id === Number(id)
        );

      if (!category) {
        alert(
          "Categoría no encontrada."
        );
        return;
      }

      category.name =
        name.trim();
    } else {
      const newId =
        Math.max(
          0,
          ...categories.map(
            category => category.id
          )
        ) + 1;

      categories.push({
        id: newId,
        name: name.trim()
      });
    }

    navigate("/categories");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3
        }}
      >
        <Button
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            navigate("/categories")
          }
        >
          Volver
        </Button>

        <Typography variant="h4">
          {isEdit
            ? "Editar Categoría"
            : "Nueva Categoría"}
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          maxWidth: 700
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <TextField
            label="Nombre"
            value={name}
            onChange={event =>
              setName(
                event.target.value
              )
            }
            required
            fullWidth
            autoFocus
          />

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: 2,
              mt: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                navigate("/categories")
              }
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={
                <SaveIcon />
              }
              onClick={handleSave}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}