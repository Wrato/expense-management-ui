import {
  Box,
  Button,
  TablePagination,
  Typography,
  TextField
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDocuments } from "../services/expenseDocumentService";
import DocumentTable from "../components/ExpenseDocumentTable";

import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../models/UserRole";

import type { ExpenseDocument } from "../models/ExpenseDocument";

import { users } from "../mocks/users";
import { issuerCompanies } from "../mocks/issuerCompanies";
import { projects } from "../mocks/projects";
import { expenseClaims } from "../mocks/expenseClaims";

import {
  getDocumentStatusLabel
} from "../utils/documentStatusUtils";

export default function Documents() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isEmployee =
    user?.role === UserRole.Employee;

  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);

  const [search, setSearch] =
    useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function loadDocuments() {
      const response = await getDocuments();

      if (!user) {
        return;
      }

      if (user.role === UserRole.Admin) {
        setDocuments(response);
        return;
      }

      if (user.role === UserRole.Employee) {
        const employeeDocuments =
          response.filter(
            document =>
              document.employeeId === user.id
          );

        setDocuments(employeeDocuments);
        return;
      }

      if (user.role === UserRole.Accountant) {
        const companyEmployeeIds =
          users
            .filter(
              employee =>
                employee.companyId ===
                  user.companyId &&
                employee.role ===
                  UserRole.Employee
            )
            .map(
              employee =>
                employee.id
            );

        const companyDocuments =
          response.filter(
            document =>
              document.employeeId !== null &&
              companyEmployeeIds.includes(
                document.employeeId
              )
          );

        setDocuments(companyDocuments);
      }
    }

    loadDocuments();
  }, [user]);

  const filteredDocuments =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      if (!normalizedSearch) {
        return documents;
      }

      return documents.filter(document => {
        const employee =
          users.find(
            user =>
              user.id ===
              document.employeeId
          );

        const company =
          issuerCompanies.find(
            company =>
              company.id ===
              document.issuerCompanyId
          );

        const project =
          projects.find(
            project =>
              project.id ===
              document.projectId
          );

        const expenseClaim =
          expenseClaims.find(
            claim =>
              claim.id ===
              document.expenseClaimId
          );

        const searchableText = [
          document.id,
          document.documentNumber,
          document.issueDate,
          employee?.name,
          company?.name,
          project?.name,
          expenseClaim?.title,
          getDocumentStatusLabel(
            document.status
          )
        ]
          .filter(
            value =>
              value !== null &&
              value !== undefined
          )
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch
        );
      });
    }, [documents, search]);

  const paginatedDocuments = useMemo(() => {
    const start = page * rowsPerPage;

    return filteredDocuments.slice(
      start,
      start + rowsPerPage
    );
  }, [filteredDocuments, page, rowsPerPage]);

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
          {isEmployee
            ? "Mis Documentos"
            : "Documentos"}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/documents/new")
          }
        >
          Agregar documento
        </Button>
      </Box>

      <TextField
        label="Buscar"
        size="small"
        fullWidth
        value={search}
        onChange={event => {
          setSearch(event.target.value);
          setPage(0);
        }}
        sx={{
          mb: 3
        }}
      />

      <DocumentTable
        documents={paginatedDocuments}
        showEmployee={!isEmployee}
      />

      <TablePagination
        component="div"
        count={filteredDocuments.length}
        page={page}
        onPageChange={(_, newPage) => {
          setPage(newPage);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={event => {
          setRowsPerPage(
            Number(event.target.value)
          );
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Documentos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </>
  );
}