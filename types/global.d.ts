import { RawAxiosRequestHeaders } from 'axios'

declare interface Fn<T = any> {
  (...arg: T[]): T
}

declare type Nullable<T> = T | null

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare type Recordable<T = any, K extends string | number | symbol = string> = Record<
  K extends null | undefined ? string : K,
  T
>

declare type RemoveReadonly<T> = {
  -readonly [P in keyof T]: T[P]
}

declare global {
  type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'

  type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>

  type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
  }

  interface AxiosConfig {
    url?: string
    params?: any
    data?: any
    method?: AxiosMethod
    headers?: RawAxiosRequestHeaders
    responseType?: AxiosResponseType
  }
}
