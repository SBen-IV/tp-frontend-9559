import axiosInstance from "./index";
import type { Problem, ProblemCreate } from "@/models/problems";

const BASE_URL: string = "/api/v1/problems";

export async function createProblem(problem: ProblemCreate) {
  return await axiosInstance.post(BASE_URL, problem);
}

export async function getAllProblems(): Promise<Problem[]> {
  const response = await axiosInstance.get(BASE_URL);

  return response.data;
}
