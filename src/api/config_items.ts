import type {
  ConfigItem,
  ConfigItemCreate,
  ConfigItemEdit,
} from "../models/config_items";
import axiosInstance from "./index";

const BASE_URL: string = "/api/v1/config-items";

export async function createConfigItem(configItem: ConfigItemCreate) {
  return await axiosInstance.post(BASE_URL, configItem);
}

export async function getConfigItemById(configItemId: string) {
  const response = await axiosInstance.get(`${BASE_URL}/${configItemId}`);

  return response.data
}

export async function getAllConfigItems(): Promise<ConfigItem[]> {
  const response = await axiosInstance.get(`${BASE_URL}`);

  return response.data;
}

export async function updateConfigItem(
  configItemID: string,
  configItem: ConfigItemEdit,
): Promise<ConfigItem> {
  const response = await axiosInstance.patch(
    `${BASE_URL}/${configItemID}`,
    configItem,
  );

  return response.data;
}

export async function deleteConfigItem(configItemID: string) {
  return await axiosInstance.delete(`${BASE_URL}/${configItemID}`);
}
