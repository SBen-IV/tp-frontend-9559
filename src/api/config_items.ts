// import type { UserCreate } from '../models/users'
// import type { UserLogin } from '../models/users'
// import { useAuthStore } from '@/stores/auth';
import type { ConfigItemCreate } from "../models/config_items";
import axiosInstance from "./index";
// import { useCookies } from "vue3-cookies";

export async function createConfigItem(configItem: ConfigItemCreate) {
  await axiosInstance.post("/api/v1/config-items", configItem);
}

// export async function loginUser(user: UserLogin) {
//   const authStore = useAuthStore();
//   const formData = new FormData();
//
//   formData.append("username", user.email);
//   formData.append("password", user.contraseña);
//   console.log("formData: ", formData);
//
//   const response = await axiosInstance.post(
//     "/api/v1/login/access-token",
//     formData,
//   );
//   const token = response.data.access_token;
//
//   console.log(response);
//
//   authStore.login(token);
//
//   return token;
// }
