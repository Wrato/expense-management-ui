import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de Rendiciones
        </Typography>

        <Typography sx={{ mr: 2 }}>
          {user?.name}
        </Typography>

        <Button color="inherit" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}