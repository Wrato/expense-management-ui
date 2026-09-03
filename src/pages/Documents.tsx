import {
  Box,
  Typography,
  TextField
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";

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

  const isEmployee =
    user?.role === UserRole.Employee;

  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);

  const [search, setSearch] =
    useState("");

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
      </Box>

      <TextField
        label="Buscar"
        size="small"
        fullWidth
        value={search}
        onChange={event =>
          setSearch(event.target.value)
        }
        sx={{
          mb: 3
        }}
      />

      <DocumentTable
        documents={filteredDocuments}
        showEmployee={!isEmployee}
      />
    </>
  );
}