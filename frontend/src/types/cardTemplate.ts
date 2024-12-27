import { UserType } from "./user"

export type TemplateStructureType = {
  title: string
  subtitle: string
}

export type CardTemplate = {
  id: number
  structure: TemplateStructureType[]
  user: UserType
}
