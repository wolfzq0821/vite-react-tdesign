import { CONTENT_TYPE } from 'constants/index'
import service from './service'

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType } = option

  return service.request({
    url,
    method,
    params,
    data,
    responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      token: '',
      ...headers,
    },
  })
}

export default {
  get: <T = any>(option: AxiosConfig) => request({ method: 'get', ...option }) as Promise<IResponse<T>>,
  post: <T = any>(option: AxiosConfig) => request({ method: 'post', ...option }) as Promise<IResponse<T>>,
  delete: <T = any>(option: AxiosConfig) => request({ method: 'delete', ...option }) as Promise<IResponse<T>>,
  put: <T = any>(option: AxiosConfig) => request({ method: 'put', ...option }) as Promise<IResponse<T>>,
  cancelRequest: (url: string | string[]) => service.cancelRequest(url),
  cancelAllRequest: () => service.cancelAllRequest(),
}
