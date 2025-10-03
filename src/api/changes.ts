import type { ChangeCreate } from "@/models/changes";
import axiosInstance from "./index";

const BASE_URL: string = "/api/v1/changes";

export async function createChange(change: ChangeCreate) {
  return await axiosInstance.post(BASE_URL, change);
}