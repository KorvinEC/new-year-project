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

