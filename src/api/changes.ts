import type { Change, ChangeAudit, ChangeCreate, ChangeEdit } from "@/models/changes";
import axiosInstance from "./index";

const BASE_URL: string = "/api/v1/changes";

export async function createChange(change: ChangeCreate) {
  return await axiosInstance.post(BASE_URL, change);
}

export async function getChangeByID(changeID: string): Promise<Change> {
  const response = await axiosInstance.get(`${BASE_URL}/${changeID}`);

  return response.data
}

export async function getAllChanges(): Promise<Change[]> {
  const response = await axiosInstance.get(`${BASE_URL}`);

  return response.data;
}

export async function updateChange(
  changeID: string,
  change: ChangeEdit,
): Promise<Change> {
  const response = await axiosInstance.patch(`${BASE_URL}/${changeID}`, change);

  return response.data;
}

export async function deleteChange(changeID: string) {
  return await axiosInstance.delete(`${BASE_URL}/${changeID}`);
}

export async function getChangeAuditsByID(changeID: string): Promise<ChangeAudit[]> {
  const response = await axiosInstance.get(`${BASE_URL}/${changeID}`);

  return response.data;
}
