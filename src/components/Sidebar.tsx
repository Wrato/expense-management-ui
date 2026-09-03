import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  ListItemIcon,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../models/UserRole";

const drawerWidth = 240;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: [UserRole.Admin, UserRole.Accountant, UserRole.Employee],
  },
  {
    text: "Documentos",
    icon: <ReceiptIcon />,
    path: "/documents",
    roles: [UserRole.Admin, UserRole.Accountant, UserRole.Employee],
  },
  {
    text: "Rendiciones",
    icon: <AssignmentIcon />,
    path: "/expenses",
    roles: [UserRole.Admin, UserRole.Accountant, UserRole.Employee],
  },
  {
    text: "Empresas",
    icon: <BusinessIcon />,
    path: "/issuer-companies",
    roles: [UserRole.Admin],
  },
  {
    text: "Categorías",
    icon: <CategoryIcon />,
    path: "/categories",
    roles: [UserRole.Admin],
  },
  {
    text: "Usuarios",
    icon: <PeopleIcon />,
    path: "/users",
    roles: [UserRole.Admin],
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {menuItems
          .filter((item) => user && item.roles.includes(user.role))
          .map(({ text, icon, path }) => (
            <ListItemButton
              key={path}
              component={NavLink}
              to={path}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,

                "&.active": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",

                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                  },
                },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
      </List>
    </Drawer>
  );
}