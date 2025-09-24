import type { UserCreate } from '../models/users'
import axiosInstance from './index'

export async function createUser(user: UserCreate) {
  await axiosInstance.post('/api/v1/users/signup', user)
} 
