export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json }

export interface Company {
  legal_name: string
  ein: string | null
  [key: string]: Json
}

export interface Individual {
  id: string
  first_name: string
  last_name: string
  [key: string]: Json
}

export interface Employment {
  id: string
  title: string | null
  [key: string]: Json
}

export interface DirectoryResponse {
  individuals: Individual[]
}
