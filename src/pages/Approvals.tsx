import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import type {
  ExpenseClaim
} from "../models/ExpenseClaim";

import type {
  ExpenseDocument
} from "../models/ExpenseDocument";

import {
  ExpenseClaimStatus
} from "../models/ExpenseClaimStatus";

import {
  getExpenseClaims
} from "../services/expenseClaimService";

import {
  getDocuments
} from "../services/expenseDocumentService";

import {
  users
} from "../mocks/users";

import {
  getExpenseClaimStatusColor,
  getExpenseClaimStatusLabel
} from "../utils/expenseClaimStatusUtils";


export default function Approvals() {

  const navigate = useNavigate();


  const [claims, setClaims] =
    useState<ExpenseClaim[]>([]);

  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);


  useEffect(() => {

    async function loadData() {

      const claimsResponse =
        await getExpenseClaims();

      const documentsResponse =
        await getDocuments();


      const submittedClaims =
        claimsResponse.filter(
          claim =>
            claim.status ===
            ExpenseClaimStatus.Submitted
        );


      setClaims(
        submittedClaims
      );

      setDocuments(
        documentsResponse
      );

    }


    loadData();

  }, []);


  const getEmployeeName = (
    employeeId: number | null
  ) => {

    if (employeeId === null) {
      return "-";
    }


    return users.find(
      user =>
        user.id === employeeId
    )?.name ?? "-";

  };


  const getClaimTotal = (
    claimId: number
  ) => {

    return documents
      .filter(
        document =>
          document.expenseClaimId ===
          claimId
      )
      .reduce(
        (sum, document) =>
          sum + (document.total ?? 0),
        0
      );

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
          Aprobaciones
        </Typography>

      </Box>


      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Fecha
              </TableCell>

              <TableCell>
                Rendición
              </TableCell>

              <TableCell>
                Trabajador
              </TableCell>

              <TableCell align="right">
                Total
              </TableCell>

              <TableCell>
                Estado
              </TableCell>

              <TableCell>
                Acción
              </TableCell>

            </TableRow>

          </TableHead>


          <TableBody>

            {claims.map(
              claim => (

                <TableRow
                  key={claim.id}
                  hover
                >

                  <TableCell>
                    {new Date(
                      claim.createdAt
                    ).toLocaleDateString(
                      "es-CL"
                    )}
                  </TableCell>


                  <TableCell>
                    {claim.title}
                  </TableCell>


                  <TableCell>
                    {getEmployeeName(
                      claim.employeeId
                    )}
                  </TableCell>


                  <TableCell align="right">
                    $
                    {getClaimTotal(
                      claim.id
                    ).toLocaleString(
                      "es-CL"
                    )}
                  </TableCell>


                  <TableCell>

                    <Chip
                      label={
                        getExpenseClaimStatusLabel(
                          claim.status
                        )
                      }
                      size="small"
                      color={
                        getExpenseClaimStatusColor(
                          claim.status
                        )
                      }
                    />

                  </TableCell>


                  <TableCell>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/expenses/${claim.id}/review`
                        )
                      }
                    >
                      Revisar
                    </Button>

                  </TableCell>

                </TableRow>

              )
            )}


            {claims.length === 0 && (

              <TableRow>

                <TableCell
                  colSpan={6}
                  align="center"
                >
                  No hay rendiciones pendientes de aprobación.
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </TableContainer>

    </>
  );
}