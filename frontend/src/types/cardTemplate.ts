import { Page } from "./pages"
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

export type CardTemplateApi = Page & {
  items: CardTemplate[]
}
