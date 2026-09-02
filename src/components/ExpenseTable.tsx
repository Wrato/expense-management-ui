import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

interface Expense {
  id: number;
  fecha: string;
  proveedor: string;
  monto: number;
  estado: string;
}

interface Props {
  expenses: Expense[];
}

export default function ExpenseTable({ expenses }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.fecha}</TableCell>
              <TableCell>{expense.proveedor}</TableCell>
              <TableCell>{expense.monto}</TableCell>
              <TableCell>{expense.estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}