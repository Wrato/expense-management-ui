import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { issuerCompanies } from "../mocks/issuerCompanies";
import { categories } from "../mocks/categories";
import { projects } from "../mocks/projects";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

import {
  getDocuments,
  updateDocument
} from "../services/expenseDocumentService";


export default function DocumentEdit() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [document, setDocument] =
    useState<ExpenseDocument | null>(null);


  const [documentNumber, setDocumentNumber] =
    useState("");

  const [issueDate, setIssueDate] =
    useState("");

  const [total, setTotal] =
    useState("");

  const [issuerCompanyId, setIssuerCompanyId] =
    useState("");

  const [issuerCompanyRut, setIssuerCompanyRut] =
    useState("");

  const [projectId, setProjectId] =
    useState<number | null>(null);


  useEffect(() => {

    async function loadDocument() {

      const documentId = Number(id);

      const response =
        await getDocuments();


      const selectedDocument =
        response.find(
          document =>
            document.id === documentId
        );


      if (!selectedDocument) {
        return;
      }


      /*
       * Los documentos APPROVED están
       * bloqueados y no pueden editarse.
       */
      if (
        selectedDocument.status ===
        DocumentStatus.Approved
      ) {

        navigate(
          `/documents/${selectedDocument.id}`
        );

        return;
      }


      setDocument(
        selectedDocument
      );


      setDocumentNumber(
        selectedDocument.documentNumber ?? ""
      );


      setIssueDate(
        selectedDocument.issueDate ?? ""
      );


      setTotal(
        selectedDocument.total?.toString() ?? ""
      );


      setIssuerCompanyId(
        selectedDocument.issuerCompanyId?.toString() ?? ""
      );


      setIssuerCompanyRut(
        selectedDocument.issuerCompanyRut ?? ""
      );


      setProjectId(
        selectedDocument.projectId
      );
    }


    loadDocument();

  }, [id, navigate]);


  if (!document) {

    return (
      <Typography>
        Documento no encontrado
      </Typography>
    );

  }


  /*
   * Un documento APPROVED no puede modificarse.
   */
  if (
    document.status ===
    DocumentStatus.Approved
  ) {

    return (
      <>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3
          }}
        >

          <Button
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() =>
              navigate(
                `/documents/${document.id}`
              )
            }
          >
            Volver
          </Button>


          <Typography variant="h4">
            Documento #{document.id}
          </Typography>

        </Box>


        <Paper sx={{ p: 3 }}>

          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Documento aprobado
          </Typography>


          <Typography
            color="text.secondary"
          >
            Este documento ya fue aprobado y no
            puede ser modificado.
          </Typography>

        </Paper>

      </>
    );

  }


  const handleSave = async () => {

    /*
     * Si el documento estaba REJECTED,
     * significa que fue corregido.
     *
     * Al guardarlo vuelve a PENDING.
     */
    const updatedDocument: ExpenseDocument = {

      ...document,

      documentNumber:
        documentNumber || null,

      issueDate:
        issueDate || null,

      total:
        total
          ? Number(total)
          : null,

      issuerCompanyId:
        issuerCompanyId
          ? Number(issuerCompanyId)
          : null,

      issuerCompanyRut:
        issuerCompanyRut.trim() || null,

      projectId,

      status:
        document.status ===
        DocumentStatus.Rejected
          ? DocumentStatus.Pending
          : DocumentStatus.Pending
    };


    try {

      await updateDocument(
        updatedDocument
      );


      alert(
        document.status ===
        DocumentStatus.Rejected
          ? "Documento corregido correctamente y quedó pendiente."
          : "Documento actualizado correctamente"
      );


      navigate(
        `/documents/${document.id}`
      );

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el documento"
      );

    }

  };


  const selectedCompany =
    issuerCompanies.find(
      company =>
        company.id.toString() ===
        issuerCompanyId
    );


  const selectedCategory =
    selectedCompany
      ? categories.find(
          category =>
            category.id ===
            selectedCompany.categoryId
        )
      : null;


  return (
    <>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3
        }}
      >

        <Button
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            navigate(
              `/documents/${document.id}`
            )
          }
        >
          Cancelar
        </Button>


        <Typography variant="h4">
          Editar Documento #{document.id}
        </Typography>

      </Box>


      <Paper sx={{ p: 3 }}>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)"
            },
            gap: 3
          }}
        >

          <TextField
            label="Número de documento"
            value={documentNumber}
            onChange={event =>
              setDocumentNumber(
                event.target.value
              )
            }
            fullWidth
          />


          <TextField
            label="Fecha de emisión"
            type="date"
            value={issueDate}
            onChange={event =>
              setIssueDate(
                event.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
            fullWidth
          />


          <TextField
            label="Fecha de envío"
            value={
              document.sentAt
                ? new Date(
                    document.sentAt
                  ).toLocaleString(
                    "es-CL"
                  )
                : "-"
            }
            disabled
            fullWidth
          />


          <TextField
            label="Total"
            type="number"
            value={total}
            onChange={event =>
              setTotal(
                event.target.value
              )
            }
            fullWidth
          />


          <FormControl fullWidth>

            <InputLabel id="issuer-company-label">
              Empresa emisora
            </InputLabel>


            <Select
              labelId="issuer-company-label"
              label="Empresa emisora"
              value={issuerCompanyId}
              onChange={event =>
                setIssuerCompanyId(
                  event.target.value
                )
              }
            >

              <MenuItem value="">
                <em>Sin asignar</em>
              </MenuItem>


              {issuerCompanies
                .filter(
                  company =>
                    company.active
                )
                .map(company => (

                  <MenuItem
                    key={company.id}
                    value={
                      company.id.toString()
                    }
                  >
                    {company.name}
                  </MenuItem>

                ))}

            </Select>

          </FormControl>


          <TextField
            label="RUT empresa emisora"
            value={issuerCompanyRut}
            onChange={event =>
              setIssuerCompanyRut(
                event.target.value
              )
            }
            fullWidth
          />


          <TextField
            label="Categoría"
            value={
              selectedCategory?.name ??
              "Sin asignar"
            }
            fullWidth
            disabled
          />


          <FormControl fullWidth>

            <InputLabel id="project-label">
              Proyecto
            </InputLabel>


            <Select
              labelId="project-label"
              label="Proyecto"
              value={
                projectId ?? 0
              }
              onChange={event => {

                const value =
                  Number(
                    event.target.value
                  );


                setProjectId(
                  value === 0
                    ? null
                    : value
                );

              }}
            >

              <MenuItem value={0}>
                <em>Sin asignar</em>
              </MenuItem>


              {projects.map(project => (

                <MenuItem
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </MenuItem>

              ))}

            </Select>

          </FormControl>

        </Box>


        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            gap: 2
          }}
        >

          <Button
            onClick={() =>
              navigate(
                `/documents/${document.id}`
              )
            }
          >
            Cancelar
          </Button>


          <Button
            variant="contained"
            startIcon={
              <SaveIcon />
            }
            onClick={handleSave}
          >
            Guardar cambios
          </Button>

        </Box>

      </Paper>

    </>
  );
}