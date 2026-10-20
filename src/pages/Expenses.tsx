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
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";

import type { ExpenseClaim } from "../models/ExpenseClaim";
import type { ExpenseDocument } from "../models/ExpenseDocument";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";
import { UserRole } from "../models/UserRole";

import { users } from "../mocks/users";

import {
  getExpenseClaims,
  submitExpenseClaim
} from "../services/expenseClaimService";

import { getDocuments } from "../services/expenseDocumentService";

import {
  getExpenseClaimStatusColor,
  getExpenseClaimStatusLabel
} from "../utils/expenseClaimStatusUtils";

export default function Expenses() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [documents, setDocuments] = useState<ExpenseDocument[]>([]);
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const isEmployee = user?.role === UserRole.Employee;

  useEffect(() => {
    async function loadData() {
      const claimsResponse = await getExpenseClaims();
      const documentsResponse = await getDocuments();

      setClaims(claimsResponse);
      setDocuments(documentsResponse);
    }

    loadData();
  }, []);

  const visibleClaims = claims.filter(claim => {
    const isVisibleToUser =
      !isEmployee || claim.employeeId === user?.id;

    const employee = users.find(
      item => item.id === claim.employeeId
    );

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      claim.title.toLowerCase().includes(searchText) ||
      (employee?.name ?? "").toLowerCase().includes(searchText) ||
      getExpenseClaimStatusLabel(claim.status)
        .toLowerCase()
        .includes(searchText);

    return isVisibleToUser && matchesSearch;
  });

  const getClaimTotal = (claimId: number) => {
    return documents
      .filter(document => document.expenseClaimId === claimId)
      .reduce((sum, document) => sum + (document.total ?? 0), 0);
  };

  const canSubmitClaim = (claim: ExpenseClaim) => {
    if (!user) {
      return false;
    }

    if (
      claim.status !== ExpenseClaimStatus.Draft &&
      claim.status !== ExpenseClaimStatus.Returned
    ) {
      return false;
    }

    const claimDocuments = documents.filter(
      document => document.expenseClaimId === claim.id
    );

    return claimDocuments.length > 0;
  };

  const canEditClaim = (claim: ExpenseClaim) => {
    if (!user) {
      return false;
    }

    const editableStatus =
      claim.status === ExpenseClaimStatus.Draft ||
      claim.status === ExpenseClaimStatus.Returned;

    if (!editableStatus) {
      return false;
    }

    if (user.role === UserRole.Admin) {
      return true;
    }

    if (user.role === UserRole.Employee) {
      return claim.employeeId === user.id;
    }

    if (user.role === UserRole.Accountant) {
      const employee = users.find(
        item => item.id === claim.employeeId
      );

      return (
        employee !== undefined &&
        employee.companyId === user.companyId
      );
    }

    return false;
  };

  const goToNewExpense = () => {
    navigate("/new-expense");
  };

  const handleSubmitClaim = async (
    event: React.MouseEvent,
    claim: ExpenseClaim
  ) => {
    event.stopPropagation();

    if (!user) {
      return;
    }

    try {
      const updatedClaim = await submitExpenseClaim(
        claim.id,
        user
      );

      setClaims(currentClaims =>
        currentClaims.map(currentClaim =>
          currentClaim.id === updatedClaim.id
            ? updatedClaim
            : currentClaim
        )
      );

      alert("Rendición enviada a revisión correctamente.");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "No fue posible enviar la rendición.";

      alert(message);
    }
  };

  const handleOpenClaim = (
    event: React.MouseEvent,
    claimId: number
  ) => {
    event.stopPropagation();
    navigate(`/expenses/${claimId}`);
  };

  const handleEditClaim = (
    event: React.MouseEvent,
    claimId: number
  ) => {
    event.stopPropagation();
    navigate(`/expenses/${claimId}/edit`);
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
          {isEmployee ? "Mis Rendiciones" : "Rendiciones"}
        </Typography>

        {(user?.role === UserRole.Employee ||
          user?.role === UserRole.Admin) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={goToNewExpense}
          >
            Nueva Rendición
          </Button>
        )}
      </Box>

      <TextField
        label="Buscar"
        size="small"
        fullWidth
        value={search}
        onChange={event => setSearch(event.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Rendición</TableCell>

              {!isEmployee && (
                <TableCell>Trabajador</TableCell>
              )}

              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleClaims.map(claim => {
              const employee = users.find(
                item => item.id === claim.employeeId
              );

              return (
                <TableRow
                  key={claim.id}
                  hover
                  onClick={() => navigate(`/expenses/${claim.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>
                    {claim.createdAt}
                  </TableCell>

                  <TableCell>
                    {claim.title}
                  </TableCell>

                  {!isEmployee && (
                    <TableCell>
                      {employee?.name ?? "-"}
                    </TableCell>
                  )}

                  <TableCell>
                    $
                    {getClaimTotal(claim.id).toLocaleString("es-CL")}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getExpenseClaimStatusLabel(claim.status)}
                      color={getExpenseClaimStatusColor(claim.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.5
                      }}
                    >
                      <Tooltip title="Ver rendición">
                        <IconButton
                          size="small"
                          onClick={event =>
                            handleOpenClaim(event, claim.id)
                          }
                          sx={{ color: "text.secondary" }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {canEditClaim(claim) && (
                        <Tooltip title="Editar rendición">
                          <IconButton
                            size="small"
                            onClick={event =>
                              handleEditClaim(event, claim.id)
                            }
                            sx={{ color: "text.secondary" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canSubmitClaim(claim) && (
                        <Tooltip title="Enviar a revisión">
                          <IconButton
                            size="small"
                            onClick={event =>
                              handleSubmitClaim(event, claim)
                            }
                            sx={{ color: "text.secondary" }}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}

            {visibleClaims.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isEmployee ? 5 : 6}
                  align="center"
                >
                  No se encontraron rendiciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}