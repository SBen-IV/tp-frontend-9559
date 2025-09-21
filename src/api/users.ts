import type { UsuarioCrear } from '../models/users'
import axiosInstance from './index'

export async function createUser(user: UsuarioCrear) {
  const { data } = await axiosInstance.post('/api/v1/users/signup', user)
  return data
}