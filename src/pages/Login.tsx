import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const doLogin = async () => {
    
    const user = await login({
      username,
      password
    });

    if (user) {
      loginContext(user);
      navigate("/dashboard");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 10
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Sistema de Rendiciones
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 3 }}
        >
          Iniciar Sesión
        </Typography>

        <Box component="form" 
            onSubmit={(e) => {
              e.preventDefault();
              void doLogin();
            }} 
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Ingresar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}