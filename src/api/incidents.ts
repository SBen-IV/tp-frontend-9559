import axiosInstance from "./index";
import type { IncidentCreate } from "@/models/incidents";

const BASE_URL: string = "/api/v1/incidents";

export async function createIncident(incident: IncidentCreate) {
  return await axiosInstance.post(BASE_URL, incident);
}