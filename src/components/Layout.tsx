import { Box } from "@mui/material";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}