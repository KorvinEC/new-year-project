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
}

type Image = {
  url: string
  id: number
}

export type User = {
  id: number
  nickname: string
  image: Image
}
