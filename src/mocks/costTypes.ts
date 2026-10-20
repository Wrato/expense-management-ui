
import type { CostType } from "../models/CostType";

export const costTypes: CostType[] = [
  {
    id: 1,
    code: "OPER",
    description: "Operacional",
    parentId: null,
    level: 1
  },
  {
    id: 2,
    code: "OPER-TRANS",
    description: "Transporte",
    parentId: 1,
    level: 2
  },
  {
    id: 3,
    code: "OPER-TRANS-TAXI",
    description: "Taxi",
    parentId: 2,
    level: 3
  },
  {
    id: 4,
    code: "OPER-TRANS-COM",
    description: "Combustible",
    parentId: 2,
    level: 3
  },
  {
    id: 5,
    code: "OPER-ALIM",
    description: "Alimentación",
    parentId: 1,
    level: 2
  },
  {
    id: 6,
    code: "OPER-ALIM-RES",
    description: "Restaurante",
    parentId: 5,
    level: 3
  }
];
