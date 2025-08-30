import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  rules: [
    ['text-333', { color: '#333' }],
    ['text-666', { color: '#666' }],
    ['text-999', { color: '#999' }],
    ['text-fff', { color: '#fff' }],
    ['text-primary', { color: '#1cbde6' }],
    ['text-danger', { color: '#f11c1c' }],
    ['text-warning', { color: '#e6a23c' }],
    ['bg-primary', { background: '#1cbde6' }],
    [/^w([.\d]+)$/, ([_, num]) => ({ width: `${num}%` })],
    [/^h([.\d]+)$/, ([_, num]) => ({ height: `${num}%` })],
  ],
  presets: [
    presetUni({
      attributify: {
        prefixedOnly: true,
      },
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      // HBuilderX 必须针对要使用的 Collections 做异步导入
      // collections: {
      //   carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
      // },
    }),
    presetUno(),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
