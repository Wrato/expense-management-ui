import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { categories } from "../mocks/categories";

export default function Categories() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const filteredCategories =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      if (!normalizedSearch) {
        return categories;
      }

      return categories.filter(
        category =>
          category.name
            .toLowerCase()
            .includes(normalizedSearch)
      );
    }, [search]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Typography variant="h4">
          Categorías
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/categories/new")
          }
        >
          Nueva Categoría
        </Button>
      </Box>

      <TextField
        label="Buscar"
        size="small"
        fullWidth
        value={search}
        onChange={event =>
          setSearch(event.target.value)
        }
        sx={{ mb: 3 }}
      />

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold" }}
              >
                ID
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold" }}
              >
                Nombre
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCategories.map(
              category => (
                <TableRow
                  key={category.id}
                  hover
                >
                  <TableCell>
                    {category.id}
                  </TableCell>

                  <TableCell>
                    {category.name}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(
                          `/categories/${category.id}/edit`
                        )
                      }
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}