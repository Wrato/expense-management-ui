export interface CostType {
  id: number;
  code: string;
  description: string;
  parentId: number | null;
  level: number;
}