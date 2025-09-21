import type { UsuarioCrear } from '../models/users'
import axiosInstance from './index'

export async function createUser(user: UsuarioCrear) {
  try {
    await axiosInstance.post('/api/v1/users/signup', user)
  } catch(err: any) {
    const data = err.response.data
    throw new Error(data.detail)
  }
} 