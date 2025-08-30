import { createAlova } from 'alova'
import vueHook from 'alova/vue'
import AdapterUniapp from '@alova/adapter-uniapp'
import mockAdapter from '../mock/mockAdapter'
import { handleAlovaError, handleAlovaResponse } from './handlers'

export const alovaInstance = createAlova({
  // 基础URL - 支持环境变量配置
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://test-zfb-api.pipiyigou.com/zfb',
  // 使用 uni-app 适配器，支持 Mock 数据
  ...AdapterUniapp({
    mockRequest: mockAdapter,
    // 通过环境变量控制是否使用模拟请求适配器
    // mockRequest: process.env.NODE_ENV === 'development' ? mockAdapter : undefined
  }),
  // Vue 3 状态钩子
  statesHook: vueHook,
  // 全局请求拦截器
  beforeRequest: (method) => {
    // Add content type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method.type)) {
      method.config.headers['Content-Type'] = 'application/json'
    }

    // 为 GET 请求添加时间戳防止缓存
    if (method.type === 'GET' && CommonUtil.isObj(method.config.params)) {
      method.config.params._t = Date.now()
    }

    // 开发环境下记录请求日志
    if (import.meta.env.MODE === 'development') {
      console.log(`[Alova Request] ${method.type} ${method.url}`, method.data || method.config.params)
      console.log(`[API Base URL] ${import.meta.env.VITE_API_BASE_URL}`)
      console.log(`[Environment] ${import.meta.env.VITE_ENV_NAME}`)
    }
  },

  // 全局响应拦截器
  responded: {
    // 成功处理器 - 在 handlers.ts 中定义
    onSuccess: handleAlovaResponse,

    // 错误处理器 - 在 handlers.ts 中定义
    onError: handleAlovaError,

    // 完成处理器 - 成功或失败后都会执行
    onComplete: async () => {
      // 可以在这里进行清理或日志记录
    },
  },

  // We'll use the middleware in the hooks
  // middleware is not directly supported in createAlova options

  // 请求超时时间（60秒）
  timeout: 60000,
  // 设置为null即可全局关闭全部请求缓存
  cacheFor: null,
})

export default alovaInstance
