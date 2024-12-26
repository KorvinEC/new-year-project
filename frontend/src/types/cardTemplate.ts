import { User } from "./user"

export type TemplateStructureType = {
  id: number
  title: string
  subtitle: string
}

export type CardTemplate = {
  id: number
  structure: TemplateStructureType[]
  user: User
}
