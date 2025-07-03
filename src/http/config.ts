import { STATUS_CODE, SUCCESS_CODE } from 'constants/index'
import { objToFormData } from 'utils'
import qs from 'qs'
import type { AxiosResponse, InternalAxiosRequestConfig } from './types'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  // 把对象序列化成 键值对用 &链接 的方式 以符合 application/x-www-form-urlencoded 的传输方式
  if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    config.data = qs.stringify(config.data)
  } else if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data' &&
    !(config.data instanceof FormData)
  ) {
    // multipart/form-data 方式把不是 FormData 数据格式的转换为 formData 数据
    config.data = objToFormData(config.data)
  }

  if (config.method === 'get' && config.params) {
    // get 使用 params 传递的参数，转换成 url 的方式
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }

  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  }
  if (response.data.code === SUCCESS_CODE || !STATUS_CODE.includes(response?.data?.code)) {
    // code === 0 或者不在规定的 code 码之中的 直接返回数据 在业务中处理
    return response.data
  }
  console.log(response?.data?.message)
  if (response?.data?.code === 401) {
    // 退出登录
  } else if (STATUS_CODE.includes(response?.data?.code)) {
    // TODO: 其他和后端约定的 code 码处理方式 【1， 500】 之类的
    console.log(response?.data?.message)
  }
}

export { defaultRequestInterceptors, defaultResponseInterceptors }
