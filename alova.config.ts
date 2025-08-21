/* eslint-disable no-irregular-whitespace */

import type { Config } from '@alova/wormhole'

// For more config detailed visit:
// https://alova.js.org/tutorial/getting-started/extension-integration

export default <Config>{
  generator: [
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      // OpenAPI 文档地址（支持本地文件或在线地址）
      input: 'https://petstore3.swagger.io/api/v3/openapi.json',
      /**
       * input file platform. Currently only swagger is supported.
       * When this parameter is specified, the input field only needs to specify the document address without specifying the openapi file
       */
      // 文档平台类型
      platform: 'swagger',

      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      // 生成代码的输出目录
      output: 'src/api',

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      // 响应数据的媒体类型
      responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      // 请求体数据的媒体类型
      bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // 生成的 API 版本
      version: 3,

      /**
       * type of generated code. The options ​​are `auto/ts/typescript/module/commonjs`.
       */
      // 生成代码类型
      type: 'typescript',

      /**
       * exported global api name, you can access the generated api globally through this name, default is `Apis`.
       * it is required when multiple generators are configured, and it cannot be repeated
       */
      // 全局 API 名称
      global: 'Apis',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescripor object is not converted
       */
      // API 处理函数
      handleApi: (apiDescriptor) => {
        // Skip logging to console
        // console.log(apiDescriptor)

        // Filter out any deprecated APIs if needed
        // 过滤掉已废弃的 API
        if (apiDescriptor.deprecated) {
          return undefined // Skip this API
        }
        // You can transform the API descriptor here if needed
        // For example, add custom headers, modify parameters, etc.

        return apiDescriptor
      },
    },
  ],

  /**
   * extension only
   * whether to automatically update the interface, enabled by default, check every 5 minutes, closed when set to `false`
   */
  // 自动更新配置
  autoUpdate: {
    // 编辑器启动时更新
    launchEditor: true,
    // 每5分钟检查更新
    interval: 5 * 60 * 1000,
  },
}
