import { Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {

  const { user } = useAuth();

  return (
    <>
    
      <Typography variant="h4">
        Bienvenido {user?.name}
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Rol: {user?.role}
      </Typography>

    </>
  );
}