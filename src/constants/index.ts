/**
 * 请求成功状态码
 */
export const SUCCESS_CODE = 0

/**
 * 和后端约定的公共 code 码
 */
export const STATUS_CODE = [1, 10, 500]

/**
 * 请求contentType
 */
export const CONTENT_TYPE: AxiosContentType = 'application/json'

/**
 * 请求超时时间
 */
export const REQUEST_TIMEOUT = 60000

/**
 * 不重定向白名单
 */
export const NO_REDIRECT_WHITE_LIST = ['/login']

/**
 * 不重置路由白名单
 */
export const NO_RESET_WHITE_LIST = ['Redirect', 'RedirectWrap', 'Login', 'NoFind', 'Root']

/**
 * 是否根据headers->content-type自动转换数据格式
 */
export const TRANSFORM_REQUEST_DATA = true

/**
 * 状态码
 */
export const CONTENT_STATUS_CODE = [
  {
    code: 400,
    label: '错误的请求',
  },
  {
    code: 403,
    label: '拒绝访问',
  },
  {
    code: 404,
    label: '请求错误,未找到该资源',
  },
  {
    code: 405,
    label: '请求方法未允许',
  },
  {
    code: 408,
    label: '请求超时',
  },
  {
    code: 500,
    label: '服务器端出错',
  },
  {
    code: 501,
    label: '网络未实现',
  },
  {
    code: 502,
    label: '网络错误',
  },
  {
    code: 503,
    label: '服务不可用',
  },
  {
    code: 504,
    label: '网络超时',
  },
  {
    code: 505,
    label: 'http版本不支持该请求',
  },
]
