import type { Method } from 'alova'
import router from '@/router'

// 自定义 API 错误类
export class ApiError extends Error {
  code: number
  data?: any

  constructor(message: string, code: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

// API 响应结构类型
interface ApiResponse {
  code: number
  msg?: string
  data?: any
  success?: boolean
  total?: number
  more?: boolean
}

// 处理成功响应
export async function handleAlovaResponse(
  response: UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult | UniApp.DownloadSuccessData,
) {
  const globalToast = useGlobalToast()
  // 从UniApp响应中提取状态码和数据
  const { statusCode, data } = response as UniNamespace.RequestSuccessCallbackResult
  console.log(statusCode, 'statusCodestatusCode')

  // 处理401/403错误（如果不是在handleAlovaResponse中处理的）
  if ((statusCode === 401 || statusCode === 403)) {
    // 如果是未授权错误，清除用户信息并跳转到登录页
    globalToast.error({ msg: '登录已过期，请重新登录！', duration: 500 })
    const timer = setTimeout(() => {
      clearTimeout(timer)
      router.replaceAll({ name: 'login' })
    }, 500)

    throw new ApiError('登录已过期，请重新登录！', statusCode, data)
  }

  // Handle HTTP error status codes
  if (statusCode >= 400) {
    globalToast.error(`请求失败，状态码: ${statusCode}`)
    throw new ApiError(`请求失败，状态码: ${statusCode}`, statusCode, data)
  }

  // The data is already parsed by UniApp adapter
  const json = data as ApiResponse
  // 开发环境下记录响应日志
  if (import.meta.env.MODE === 'development') {
    console.log('[Alova Response]', json)
  }

  // Return data for successful responses
  return json
}

// 处理请求错误
export function handleAlovaError(error: any, method: Method) {
  const globalToast = useGlobalToast()
  // Log error in development
  if (import.meta.env.MODE === 'development') {
    console.error('[Alova Error]', error, method)
  }

  // 处理401/403错误（如果不是在handleAlovaResponse中处理的）
  if (error instanceof ApiError && (error.code === 401 || error.code === 403)) {
    // 如果是未授权错误，清除用户信息并跳转到登录页
    globalToast.error({ msg: '登录已过期，请重新登录！', duration: 500 })
    const timer = setTimeout(() => {
      clearTimeout(timer)
      router.replaceAll({ name: 'login' })
    }, 500)
    throw new ApiError('登录已过期，请重新登录！', error.code, error.data)
  }

  // Handle different types of errors
  if (error.name === 'NetworkError') {
    globalToast.error('网络错误，请检查您的网络连接')
  }
  else if (error.name === 'TimeoutError') {
    globalToast.error('请求超时，请重试')
  }
  else if (error instanceof ApiError) {
    globalToast.error(error.message || '请求失败')
  }
  else {
    globalToast.error('发生意外错误')
  }

  throw error
}
