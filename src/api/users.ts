import type { UsuarioCrear } from '../models/users'
import axiosInstance from './index'

export async function createUser(user: UsuarioCrear) {
  await axiosInstance.post('/api/v1/users/signup', user)
} 
