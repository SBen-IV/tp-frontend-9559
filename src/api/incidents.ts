import axiosInstance from "./index";
import type { Incident, IncidentCreate, IncidentEdit } from "@/models/incidents";

const BASE_URL: string = "/api/v1/incidents";

export async function createIncident(incident: IncidentCreate) {
  return await axiosInstance.post(BASE_URL, incident);
}

export async function getAllIncidents() : Promise<Incident[]> {
  const response =  await axiosInstance.get(`${BASE_URL}`);
  
  return response.data
}

export async function updateIncident(incidentID: string, incident: IncidentEdit) : Promise<Incident> {
  const response =  await axiosInstance.patch(`${BASE_URL}/${incidentID}`, incident);
  
  return response.data
}