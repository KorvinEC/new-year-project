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

type CardFieldType = {
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
    nominations: CardFieldType[]
    suggestions: CardFieldType[]
  }
}

type NominationType = {
  title: string
  subtitle: string
  description: string
}

type SuggestionType = {
  description: string
}

export type CreateCardApiType = {
  card_template_id: number
  card_nominations_data: NominationType[]
  card_suggestions_data: SuggestionType[]
}
