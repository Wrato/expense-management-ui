import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import { users } from "../mocks/users";
import { issuerCompanies } from "../mocks/issuerCompanies";
import { UserRole } from "../models/UserRole";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = id !== undefined;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [companyId, setCompanyId] = useState<number | "">("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const user = users.find(
      user => user.id === Number(id)
    );

    if (!user) return;

    setName(user.name);
    setUsername(user.username);
    setRole(user.role);
    setCompanyId(user.companyId ?? "");
    setPhone(user.phone ?? "");
  }, [id, isEdit]);

  const handleSave = () => {
    if (
      !name.trim() ||
      !username.trim() ||
      role === ""
    ) {
      alert(
        "Completa todos los campos obligatorios."
      );
      return;
    }

    if (isEdit) {
      const user = users.find(
        user => user.id === Number(id)
      );

      if (!user) {
        alert("Usuario no encontrado.");
        return;
      }

      user.name = name.trim();
      user.username = username.trim();
      user.role = role;
      user.companyId =
        companyId === "" ? null : companyId;
      user.phone =
        phone.trim() === ""
          ? null
          : phone.trim();
    } else {
      const newId =
        Math.max(
          0,
          ...users.map(user => user.id)
        ) + 1;

      users.push({
        id: newId,
        username: username.trim(),
        password: "1234",
        name: name.trim(),
        role,
        companyId:
          companyId === ""
            ? null
            : companyId,
        phone:
          phone.trim() === ""
            ? null
            : phone.trim()
      });
    }

    navigate("/users");
  };

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
          alignItems: "center",
          gap: 1,
          mb: 3
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate("/users")
          }
        >
          Volver
        </Button>

        <Typography variant="h4">
          {isEdit
            ? "Editar Usuario"
            : "Nuevo Usuario"}
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
              setName(event.target.value)
            }
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Usuario"
            value={username}
            onChange={event =>
              setUsername(event.target.value)
            }
            required
            fullWidth
            disabled={isEdit}
          />

          <FormControl
            fullWidth
            required
          >
            <InputLabel>
              Rol
            </InputLabel>

            <Select
              value={role}
              label="Rol"
              onChange={event =>
                setRole(
                  event.target.value as UserRole
                )
              }
            >
              <MenuItem
                value={UserRole.Employee}
              >
                Trabajador
              </MenuItem>

              <MenuItem
                value={UserRole.Accountant}
              >
                Contador
              </MenuItem>

              <MenuItem
                value={UserRole.Admin}
              >
                Administrador
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>
              Empresa
            </InputLabel>

            <Select
              value={companyId}
              label="Empresa"
              onChange={event =>
                setCompanyId(
                  event.target.value === ""
                    ? ""
                    : Number(
                        event.target.value
                      )
                )
              }
            >
              <MenuItem value="">
                Sin empresa
              </MenuItem>

              {issuerCompanies
                .filter(company => company.active)
                .map(company => (
                  <MenuItem
                    key={company.id}
                    value={company.id}
                  >
                    {company.name} - {company.rut}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Teléfono"
            value={phone}
            onChange={event =>
              setPhone(event.target.value)
            }
            placeholder="56912345678"
            fullWidth
            helperText="Número utilizado para identificar documentos recibidos por WhatsApp."
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                navigate("/users")
              }
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
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