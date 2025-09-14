import { useGet } from "../composables/useFetch";

const BASE_URL = "http://localhost:8000" + "/api/v1/utils/";

export async function getVersion() {
  const url: string = BASE_URL + "version";
  const { data, error } = await useGet(url);

  if (!data) {
    return error;
  }

  return data;
}
