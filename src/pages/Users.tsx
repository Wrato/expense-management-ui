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

import { users } from "../mocks/users";
import { issuerCompanies } from "../mocks/issuerCompanies";
import { UserRole } from "../models/UserRole";

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter(user => {
      const company = issuerCompanies.find(
        company => company.id === user.companyId
      );

      const roleLabel =
        user.role === UserRole.Admin
          ? "Administrador"
          : user.role === UserRole.Accountant
            ? "Contador"
            : "Trabajador";

      const searchableText = [
        user.name,
        user.username,
        user.phone,
        company?.name,
        company?.rut,
        roleLabel
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
    });
  }, [search]);

  const getRoleLabel = (
    role: UserRole
  ): string => {
    switch (role) {
      case UserRole.Admin:
        return "Administrador";

      case UserRole.Accountant:
        return "Contador";

      case UserRole.Employee:
        return "Trabajador";

      default:
        return role;
    }
  };

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
          Usuarios
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/users/new")
          }
        >
          Nuevo Usuario
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
              <TableCell sx={{ fontWeight: "bold" }}>
                Nombre
              </TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>
                Usuario
              </TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>
                Rol
              </TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>
                Empresa
              </TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>
                Teléfono
              </TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map(user => {
              const company =
                issuerCompanies.find(
                  company =>
                    company.id ===
                    user.companyId
                );

              return (
                <TableRow
                  key={user.id}
                  hover
                >
                  <TableCell>
                    {user.name}
                  </TableCell>

                  <TableCell>
                    {user.username}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getRoleLabel(
                        user.role
                      )}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {company?.name ?? "-"}
                  </TableCell>

                  <TableCell>
                    {user.phone ?? "-"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(
                          `/users/${user.id}/edit`
                        )
                      }
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}