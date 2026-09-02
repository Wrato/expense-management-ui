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

import { issuerCompanies } from "../mocks/issuerCompanies";
import { categories } from "../mocks/categories";

export default function IssuerCompanies() {

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
        >
          Nueva Empresa
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
              <TableCell>RUT</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {issuerCompanies.map((company) => {

              const category = categories.find(
                category => category.id === company.categoryId
              );

              return (
                <TableRow key={company.id}>

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
                    <Button size="small">
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