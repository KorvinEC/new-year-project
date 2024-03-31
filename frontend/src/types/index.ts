export type CurrentUserInfo = {
    id: number
    nickname: string
}

// Authorization

export type LoginInfo = {
    username: string
    password: string
}

export type AuthorizationInfo = {
    access_token: string
    token_type: string
}

// Templates

export type TemplateStructureType = {
    title: string
    subtitle: string
}

type TemplateUser = {
    id: number
    nickname: string
}

export type TemplateType = {
    id: number
    structure: TemplateStructureType[]
    user: TemplateUser
}

// Cards

export type CardInfoType = {
    id: number
    title: string
    subtitle: string
    description: string
    image_url: string
}

export type CardData = {
    nominations: CardInfoType[]
    suggestions: CardInfoType[]
}

export type CardType = {
    id: number
    data: CardData
}

type CreateCardInfoType = {
    id: number
    title: string
    subtitle: string
    description: string
    image: File
}

export type CreateCardType = {
    card_template_id: number | null
    card_nominations_data: CreateCardInfoType[]
    card_suggestions_data: CreateCardInfoType[]
};