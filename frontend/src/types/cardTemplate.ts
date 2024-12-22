import { User } from "./user"

export type TemplateStructureType = {
  title: string
  subtitle: string
}

export type CardTemplate = {
  id: number
  structure: TemplateStructure[]
  user: User
}
