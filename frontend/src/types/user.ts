export interface TokenType { 
  access_token: string
  token_type: string 
}

export interface LoginType {
  username: string
  password: string
}

export interface RegisterType {
  nickname: string
  username: string
  password: string
  image: File
}

type Image = {
  url: string
  id: number
}

export type UserType = {
  id: number
  nickname: string
  image: Image | undefined
}
