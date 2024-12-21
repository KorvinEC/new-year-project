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

export type User = {
  id: number
  nickname: string
}
