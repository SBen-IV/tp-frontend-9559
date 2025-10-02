import axiosInstance from "@/api";

const BASE_URL = "http://localhost:8000" + "/api/v1/utils";

export async function getVersion() {
  return await axiosInstance.get(`${BASE_URL}/version`);
}
