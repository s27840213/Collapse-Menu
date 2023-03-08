export interface IMenuItem {
  name: string
  id: string
  items?: IMenuItem[]
}

export type DrinksMap = Map<string, { name: string; path: Array<number> }>
