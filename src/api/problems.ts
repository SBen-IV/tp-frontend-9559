import axiosInstance from "./index";
import type { ProblemCreate } from "@/models/problems";

const BASE_URL: string = "/api/v1/problems";

export async function createProblem(problem: ProblemCreate) {
  return await axiosInstance.post(BASE_URL, problem);
}
