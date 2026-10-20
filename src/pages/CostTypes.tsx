
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { useEffect, useMemo, useState } from "react";

import type { CostType } from "../models/CostType";

import {
  getCostTypes,
  createCostType,
  updateCostType
} from "../services/costTypeService";

export default function CostTypes() {
  const [costTypes, setCostTypes] = useState<CostType[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CostType | null>(null);
  const [saving, setSaving] = useState(false);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(1);
  const [parentId, setParentId] = useState<number | "">("");

  async function loadCostTypes() {
    const response = await getCostTypes();
    setCostTypes(response);
  }

  useEffect(() => {
    loadCostTypes();
  }, []);

  const filteredCostTypes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = costTypes.filter(item => {
      const parent = costTypes.find(
        candidate => candidate.id === item.parentId
      );

      const text = [
        item.code,
        item.description,
        parent?.description ?? "",
        `nivel ${item.level}`
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(normalizedSearch);
    });

    return filtered.sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }

      return a.code.localeCompare(b.code);
    });
  }, [costTypes, search]);

  const availableParents = costTypes.filter(
    item => item.level === level - 1
  );

  const resetForm = () => {
    setCode("");
    setDescription("");
    setLevel(1);
    setParentId("");
    setEditing(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: CostType) => {
    setEditing(item);
    setCode(item.code);
    setDescription(item.description);
    setLevel(item.level);
    setParentId(item.parentId ?? "");
    setDialogOpen(true);
  };

  const handleClose = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    setParentId("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const input = {
        code,
        description,
        level,
        parentId: level === 1 ? null : parentId === "" ? null : parentId
      };

      if (editing) {
        await updateCostType(editing.id, input);
      } else {
        await createCostType(input);
      }

      await loadCostTypes();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible guardar el tipo de costo.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const getLevelLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Nivel 1";
      case 2:
        return "Nivel 2";
      case 3:
        return "Nivel 3";
      default:
        return `Nivel ${value}`;
    }
  };

  const getParentDescription = (item: CostType) => {
    if (item.parentId === null) {
      return "—";
    }

    return (
      costTypes.find(
        candidate => candidate.id === item.parentId
      )?.description ?? "No encontrado"
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2
        }}
      >
        <Typography variant="h4">
          Tipos de costo
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo tipo de costo
        </Button>
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
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Tipo de costo padre</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCostTypes.map(item => (
              <TableRow key={item.id} hover>
                <TableCell>{item.code}</TableCell>

                <TableCell>
                  {item.description}
                </TableCell>

                <TableCell>
                  <Chip
                    label={getLevelLabel(item.level)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  {getParentDescription(item)}
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="Editar tipo de costo">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(item)}
                      sx={{ color: "text.secondary" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {filteredCostTypes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron tipos de costo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing ? "Editar tipo de costo" : "Nuevo tipo de costo"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1
            }}
          >
            <TextField
              label="Nivel"
              select
              fullWidth
              value={level}
              disabled={Boolean(editing)}
              onChange={event =>
                handleLevelChange(Number(event.target.value))
              }
              helperText={
                editing
                  ? "El nivel no se puede modificar después de crear el registro."
                  : "Selecciona el nivel que deseas crear."
              }
            >
              <MenuItem value={1}>Nivel 1</MenuItem>
              <MenuItem value={2}>Nivel 2</MenuItem>
              <MenuItem value={3}>Nivel 3</MenuItem>
            </TextField>

            {level > 1 && (
              <TextField
                label="Tipo de costo padre"
                select
                fullWidth
                value={parentId}
                onChange={event =>
                  setParentId(
                    event.target.value === ""
                      ? ""
                      : Number(event.target.value)
                  )
                }
                required
                helperText={
                  `Selecciona el tipo de costo de nivel ${level - 1}.`
                }
              >
                {availableParents.map(parent => (
                  <MenuItem
                    key={parent.id}
                    value={parent.id}
                  >
                    {parent.code} — {parent.description}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="Código"
              fullWidth
              required
              value={code}
              onChange={event => setCode(event.target.value)}
            />

            <TextField
              label="Descripción"
              fullWidth
              required
              value={description}
              onChange={event =>
                setDescription(event.target.value)
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
