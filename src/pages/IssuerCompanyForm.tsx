import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import { useState } from "react";

import { issuerCompanies } from "../mocks/issuerCompanies";
import { categories } from "../mocks/categories";

export default function IssuerCompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit =
    id !== undefined;

  const company = isEdit
    ? issuerCompanies.find(
        company => company.id === Number(id)
        )
    : undefined;
    
  const [rut, setRut] = useState(
    company?.rut ?? ""
    );

    const [name, setName] = useState(
    company?.name ?? ""
    );

    const [categoryId, setCategoryId] =
    useState<number | "">(
        company?.categoryId ?? ""
    );

    const [active, setActive] = useState(
    company?.active ?? true
    );

  const handleSave = () => {
    if (
      !rut.trim() ||
      !name.trim() ||
      categoryId === ""
    ) {
      alert(
        "Completa todos los campos obligatorios."
      );
      return;
    }

    if (isEdit) {
      const company =
        issuerCompanies.find(
          company =>
            company.id === Number(id)
        );

      if (!company) {
        alert(
          "Empresa no encontrada."
        );
        return;
      }

      company.rut = rut.trim();
      company.name = name.trim();
      company.categoryId =
        categoryId;
      company.active = active;
    } else {
      const newId =
        Math.max(
          0,
          ...issuerCompanies.map(
            company => company.id
          )
        ) + 1;

      issuerCompanies.push({
        id: newId,
        rut: rut.trim(),
        name: name.trim(),
        categoryId,
        active
      });
    }

    navigate("/issuer-companies");
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
            navigate(
              "/issuer-companies"
            )
          }
        >
          Volver
        </Button>

        <Typography variant="h4">
          {isEdit
            ? "Editar Empresa"
            : "Nueva Empresa"}
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
            label="RUT"
            value={rut}
            onChange={event =>
              setRut(
                event.target.value
              )
            }
            required
            disabled={isEdit}
            fullWidth
          />

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
          />

          <FormControl
            fullWidth
            required
          >
            <InputLabel>
              Categoría
            </InputLabel>

            <Select
              value={categoryId}
              label="Categoría"
              onChange={event =>
                setCategoryId(
                  event.target.value as number
                )
              }
            >
              {categories.map(
                category => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={event =>
                  setActive(
                    event.target.checked
                  )
                }
              />
            }
            label={
              active
                ? "Empresa activa"
                : "Empresa inactiva"
            }
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
                navigate(
                  "/issuer-companies"
                )
              }
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={
                <SaveIcon />
              }
              onClick={
                handleSave
              }
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}