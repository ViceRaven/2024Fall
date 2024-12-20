import type { DataEnvelope, DataListEnvelope } from './dataEnvelope'
import { api } from './myFetch'

export async function getAll() {
    return api<DataListEnvelope<Exercise>>('exercises')
}

export async function getById(id: number) {
    return api<DataEnvelope<Exercise>>(`exercises/${id}`)
}

export function create(exercise: Exercise) {
    return api<DataEnvelope<Exercise>>('exercises', exercise)
}

export function update(exercise: Exercise) {
    return api<DataEnvelope<Exercise>>(`exercises/${exercise.id}`, exercise, 'PATCH')
}

export function remove(id: number) {
    return api<DataEnvelope<Exercise>>(`exercises/${id}`, undefined, 'DELETE')
}

 export function search(exercise: Exercise) {
  return api<DataEnvelope<Exercise>>(`exercises/${exercise.title}`, undefined, 'DELETE')
 }



/*import data from '../router/data/exercises.json'
import type { DataListEnvelope } from './dataEnvelope'

export function getAll(): DataListEnvelope<Exercise> {
  return {
    data: data.exercises,
    total: data.total
  }
}
*/

export interface Exercise {
  id: number
  title: string
  description: string
  difficulty: string
  }

