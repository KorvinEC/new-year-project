import { User } from "./user"

export type TemplateStructure = {
  title: string
  subtitle: string
}

export type CardTemplate = {
  id: number
  structure: TemplateStructure[]
  user: User
}
