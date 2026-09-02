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

import { categories } from "../mocks/categories";

export default function Categories() {

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
        >
          Nueva Categoría
        </Button>

      </Box>

      <TextField
        label="Buscar"
        size="small"
        fullWidth
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>

        <Table>

          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {categories.map((category) => (

              <TableRow key={category.id}>

                <TableCell>
                  {category.id}
                </TableCell>

                <TableCell>
                  {category.name}
                </TableCell>

                <TableCell>
                  <Button size="small">
                    Editar
                  </Button>
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </TableContainer>
    </>
  );
}