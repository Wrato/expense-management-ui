
import type { CostType } from "../models/CostType";
import { costTypes } from "../mocks/costTypes";

export interface CostTypeInput {
  code: string;
  description: string;
  level: number;
  parentId: number | null;
}

function validateCostType(
  input: CostTypeInput,
  currentId?: number
): void {
  const code = input.code.trim();
  const description = input.description.trim();

  if (!code || !description) {
    throw new Error("El código y la descripción son obligatorios.");
  }

  if (![1, 2, 3].includes(input.level)) {
    throw new Error("El nivel debe ser 1, 2 o 3.");
  }

  const duplicateCode = costTypes.some(
    item =>
      item.code.toLowerCase() === code.toLowerCase() &&
      item.id !== currentId
  );

  if (duplicateCode) {
    throw new Error("Ya existe un tipo de costo con ese código.");
  }

  if (input.level === 1) {
    if (input.parentId !== null) {
      throw new Error("Un tipo de nivel 1 no puede tener padre.");
    }
    return;
  }

  if (input.parentId === null) {
    throw new Error("Debes seleccionar un tipo de costo padre.");
  }

  const parent = costTypes.find(
    item => item.id === input.parentId
  );

  if (!parent) {
    throw new Error("El tipo de costo padre no existe.");
  }

  if (parent.level !== input.level - 1) {
    throw new Error(
      "El padre debe pertenecer al nivel inmediatamente anterior."
    );
  }

  if (parent.id === currentId) {
    throw new Error("Un tipo de costo no puede ser su propio padre.");
  }
}

export async function getCostTypes(): Promise<CostType[]> {
  return [...costTypes];
}

export async function getCostTypesByLevel(
  level: number
): Promise<CostType[]> {
  return costTypes.filter(item => item.level === level);
}

export async function getChildCostTypes(
  parentId: number
): Promise<CostType[]> {
  return costTypes.filter(item => item.parentId === parentId);
}

export async function getCostTypeById(
  id: number
): Promise<CostType | undefined> {
  return costTypes.find(item => item.id === id);
}

export async function createCostType(
  input: CostTypeInput
): Promise<CostType> {
  validateCostType(input);

  const newCostType: CostType = {
    id: Math.max(0, ...costTypes.map(item => item.id)) + 1,
    code: input.code.trim(),
    description: input.description.trim(),
    parentId: input.level === 1 ? null : input.parentId,
    level: input.level
  };

  costTypes.push(newCostType);

  return { ...newCostType };
}

export async function updateCostType(
  id: number,
  input: CostTypeInput
): Promise<CostType> {
  const index = costTypes.findIndex(item => item.id === id);

  if (index === -1) {
    throw new Error("No se encontró el tipo de costo.");
  }

  const current = costTypes[index];

  if (input.level !== current.level) {
    throw new Error(
      "No se puede cambiar el nivel de un tipo de costo existente."
    );
  }

  validateCostType(input, id);

  const updatedCostType: CostType = {
    ...current,
    code: input.code.trim(),
    description: input.description.trim(),
    parentId: input.level === 1 ? null : input.parentId
  };

  costTypes[index] = updatedCostType;

  return { ...updatedCostType };
}
