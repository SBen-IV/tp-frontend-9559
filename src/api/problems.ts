import axiosInstance from "./index";
import type { Problem, ProblemCreate, ProblemEdit } from "@/models/problems";

const BASE_URL: string = "/api/v1/problems";

export async function createProblem(problem: ProblemCreate) {
  return await axiosInstance.post(BASE_URL, problem);
}

export async function getAllProblems(): Promise<Problem[]> {
  const response = await axiosInstance.get(BASE_URL);

  return response.data;
}

export async function getProblemById(problemId: string) {
  const response = await axiosInstance.get(`${BASE_URL}/${problemId}`);

  return response.data;
}

export async function updateProblem(
  problemID: string,
  problem: ProblemEdit,
): Promise<Problem> {
  const response = await axiosInstance.patch(
    `${BASE_URL}/${problemID}`,
    problem,
  );

  return response.data;
}

export async function deleteProblem(problemID: string) {
  return await axiosInstance.delete(`${BASE_URL}/${problemID}`);
}
