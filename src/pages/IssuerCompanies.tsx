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
  TableRow,
  Chip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { issuerCompanies } from "../mocks/issuerCompanies";
import { categories } from "../mocks/categories";

export default function IssuerCompanies() {

  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const filteredCompanies =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      if (!normalizedSearch) {
        return issuerCompanies;
      }

      return issuerCompanies.filter(
        company => {
          const category =
            categories.find(
              category =>
                category.id ===
                company.categoryId
            );

          const searchableText = [
            company.rut,
            company.name,
            category?.name
          ]
            .filter(
              value =>
                value !== null &&
                value !== undefined
            )
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch
          );
        }
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
          Empresas
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/issuer-companies/new")
          }
        >
          Nueva Empresa
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
                RUT
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold" }}
              >
                Nombre
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold" }}
              >
                Categoría
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold" }}
              >
                Estado
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCompanies.map(
              company => {
                const category =
                  categories.find(
                    category =>
                      category.id ===
                      company.categoryId
                  );

                return (
                  <TableRow
                    key={company.id}
                    hover
                  >
                    <TableCell>
                      {company.rut}
                    </TableCell>

                    <TableCell>
                      {company.name}
                    </TableCell>

                    <TableCell>
                      {category?.name ?? "-"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          company.active
                            ? "Activa"
                            : "Inactiva"
                        }
                        color={
                          company.active
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          navigate(
                            `/issuer-companies/${company.id}/edit`
                          )
                        }
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}