import {
  Box,
  Typography,
  TextField
} from "@mui/material";

import { useEffect, useState } from "react";

import { getDocuments } from "../services/expenseDocumentService";

import DocumentTable from "../components/ExpenseDocumentTable";

import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../models/UserRole";

import type { ExpenseDocument } from "../models/ExpenseDocument";

import { users } from "../mocks/users";


export default function Documents() {

  const { user } = useAuth();


  const isEmployee =
    user?.role === UserRole.Employee;


  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);


  useEffect(() => {

    async function loadDocuments() {

      const response =
        await getDocuments();


      if (!user) {
        return;
      }


      /*
       * ADMIN
       *
       * Puede ver todos los documentos.
       */
      if (
        user.role === UserRole.Admin
      ) {

        setDocuments(response);

        return;
      }


      /*
       * EMPLOYEE
       *
       * Solamente puede ver sus propios
       * documentos.
       */
      if (
        user.role === UserRole.Employee
      ) {

        const employeeDocuments =
          response.filter(
            document =>
              document.employeeId ===
              user.id
          );


        setDocuments(
          employeeDocuments
        );

        return;
      }


      /*
       * ACCOUNTANT
       *
       * Puede ver los documentos de los
       * trabajadores pertenecientes a
       * su empresa.
       */
      if (
        user.role === UserRole.Accountant
      ) {

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


        setDocuments(
          companyDocuments
        );

      }

    }


    loadDocuments();

  }, [user]);


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
        sx={{
          mb: 3
        }}
      />


      <DocumentTable
        documents={documents}
      />

    </>
  );
}