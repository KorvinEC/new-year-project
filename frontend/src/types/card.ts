import { Page } from "./pages"
import { UserType } from "./user"

export type CreateCardFieldType = {
  title: string
  subtitle: string
  description: string
}

export type CreateCardType = {
  card_template_id: number
  card_nominations_data: CreateCardFieldType[]
  card_suggestions_data: CreateCardFieldType[]
}

export type CardFieldsType = {
  id: number
  title: string
  subtitle: string,
  description: string,
  image_url: string,
  image_uuid: string
}

export type CardType = {
  id: number,
  data: {
    nominations: CardFieldsType[]
    suggestions: CardFieldsType[]
  }
  user: UserType
}

export type CardApi = Page & {
  items: CardType[]
}

type NominationType = {
  title: string
  subtitle: string
  description: string
}

type SuggestionType = {
  description: string
}

export type CardDataFieldType = "nominations" | "suggestions"

export type ImageToAddType = {
  index: number
  card_data_type: CardDataFieldType
  image_file: File
}

export type AddImageToCardApiType = {
  card_id: number
  data_id: number
  card_data_type: CardDataFieldType
  image_file: File
}

export type CreateCardApiType = {
  card_template_id: number
  card_nominations_data: NominationType[]
  card_suggestions_data: SuggestionType[]
}
