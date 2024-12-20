import type { DataEnvelope, DataListEnvelope } from './dataEnvelope'
import { api } from './myFetch'

export async function getAll() {
  return api<DataListEnvelope<User>>('users')
}

export async function getById(id: number) {
  return api<DataEnvelope<User>>(`users/${id}`)
}

export function create(user: User) {
  return api<DataEnvelope<User>>('users', user)
}

export function update(user: User) {
  return api<DataEnvelope<User>>(`users/${user.id}`, user, 'PATCH')
}

export function remove(id: number) {
  return api<DataEnvelope<User>>(`users/${id}`, undefined, 'DELETE')
}
 export function search(user: User) {
  return api<DataEnvelope<User>>(`users/${user.firstName}`)
}





export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  profilePic: string
  adminAccess: boolean
}

