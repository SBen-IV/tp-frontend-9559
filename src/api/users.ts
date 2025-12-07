import type { User, UserCreate } from "../models/users";
import type { UserLogin } from "../models/users";
import { useAuthStore } from "@/stores/auth";
import axiosInstance from "./index";
import type { AxiosRequestConfig } from "axios";
import { useUserStore } from "@/stores/user";

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

  const responseToken = await axiosInstance.post(
    "/api/v1/login/access-token",
    formData,
  );
  const token = responseToken.data.access_token;

  authStore.login(token);

  const userStore = useUserStore();

  const responseUser = await axiosInstance.get(`${BASE_URL}/me`);

  userStore.set(responseUser.data);

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

export async function getUserById(userId: string): Promise<User> {
  const response = await axiosInstance.get(`${BASE_URL}/${userId}`);

  return response.data;
}
