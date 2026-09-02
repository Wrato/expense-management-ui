import type { Project } from "../models/Project";
import { projects } from "../mocks/projects";

export async function getProjects(): Promise<Project[]> {
  return projects;
}