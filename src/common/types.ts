/*
 Meta is meant to be JSON-like and understandable to the typescript compiler.
*/

export interface Meta {
  [key: string]:
    | null
    | boolean
    | number
    | string
    | Array<null | boolean | number | string | Meta>
    | Meta;
}
