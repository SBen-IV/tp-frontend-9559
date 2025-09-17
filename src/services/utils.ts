import { mande } from "mande";
import type { BackendVersion } from "../models/version";

const BASE_URL = "http://localhost:8000" + "/api/v1/utils";
const api = mande(BASE_URL);

export async function getVersion(): Promise<BackendVersion> {
  const url: string = "/version";

  const data = await api.get<BackendVersion>(url).catch((err) => {
    throw new Error(err);
  });

  return data;
}
