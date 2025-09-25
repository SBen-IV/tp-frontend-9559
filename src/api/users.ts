import type { UserCreate } from '../models/users'
import type { UserLogin } from '../models/users'
import axiosInstance from './index'
import { useCookies } from "vue3-cookies";

export async function createUser(user: UserCreate) {
  await axiosInstance.post('/api/v1/users/signup', user)
} 

export async function loginUser(user: UserLogin) {
  const { cookies } = useCookies();
	const formData = new FormData();

	formData.append('username', user.email);
	formData.append('password', user.contraseña);
  console.log('formData: ', formData)

  const response = await axiosInstance.post('/api/v1/login/access-token', formData)
  const token = response.data.access_token
  
  console.log(response)

  cookies.set("token", token);

  return token
}