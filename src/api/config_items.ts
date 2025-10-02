import type { ConfigItemCreate } from "../models/config_items";
import axiosInstance from "./index";

const BASE_URL: string = "/api/v1/config-items";

export async function createConfigItem(configItem: ConfigItemCreate) {
  return await axiosInstance.post(BASE_URL, configItem);
}

export async function getConfigItemById(configItemId: string) {
  return await axiosInstance.get(`${BASE_URL}/${configItemId}`);
}
