import axios from 'axios'
import type { AxiosError } from 'axios'
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'

import { CONTENT_STATUS_CODE, REQUEST_TIMEOUT } from 'constants/index'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, RequestConfig } from './types'

export const PATH_URL = ''

const abortControllerMap: Map<string, AbortController> = new Map()

const axiosInstance: AxiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: PATH_URL,
})

axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  const url = res.url || ''
  res.signal = controller.signal
  abortControllerMap.set(url, controller)

  return res
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    abortControllerMap.delete(url)
    // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
    return res
  },
  (error: AxiosError) => {
    console.log(`err： ${error}`) // for debug
    console.error(error.message)
    showHttpWorkErrorMsg(error)
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.request.use(defaultRequestInterceptors)
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

const service = {
  request: (config: RequestConfig) =>
    new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }

      axiosInstance
        .request(config)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    }),
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  },
}

// 匹配显示对应状态码 提示文字
const showHttpWorkErrorMsg = (error: AxiosError) => {
  if (error.status && CONTENT_STATUS_CODE.some((item) => item.code === error.status)) {
    CONTENT_STATUS_CODE.forEach((e) => {
      if (error.status && e.code === error.status) {
        console.log(e.label)
      }
    })
  } else {
    console.log(error.message)
  }
}

export default service
