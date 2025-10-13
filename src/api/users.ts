import type { User, UserCreate } from "../models/users";
import type { UserLogin } from "../models/users";
import { useAuthStore } from "@/stores/auth";
import axiosInstance from "./index";
import type { AxiosRequestConfig } from "axios";

const BASE_URL: string = "/api/v1/users";

export async function createUser(user: UserCreate) {
  await axiosInstance.post(`${BASE_URL}/signup`, user);
}

export async function loginUser(user: UserLogin) {
  const authStore = useAuthStore();
  const formData = new FormData();

  formData.append("username", user.email);
  formData.append("password", user.contraseña);
  console.log("formData: ", formData);

  const response = await axiosInstance.post(
    "/api/v1/login/access-token",
    formData,
  );
  const token = response.data.access_token;

  console.log(response);

  authStore.login(token);

  return token;
}

export async function getAllUsers(rol?: string): Promise<User[]> {
  const params: AxiosRequestConfig = {};

  if (rol) {
    params.params = { ...params.params, rol: rol };
  }

  const response = await axiosInstance.get(`${BASE_URL}`, params);

  return response.data;
}
