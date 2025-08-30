# Wot Demo 项目分析文档

## 项目概述

这是一个基于 [vitesse-uni-app](https://github.com/uni-helper/vitesse-uni-app) 的深度整合 Wot UI 组件库的快速起手项目。

## 技术栈

- ⚡️ Vue 3 + Vite + pnpm + esbuild
- 🎨 UnoCSS - 高性能且极具灵活性的即时原子化 CSS 引擎
- 🐂 Wot UI - 基于 Vue3+TS 开发的 uni-app 组件库
- 🎉 Uni Mini Router - 适用于 uni-app & vue3 的轻量级路由库
- 🎉 Alova - 轻量级请求策略库

## 项目结构

```
.
├── .vscode/               # VSCode 配置
├── src/
│   ├── api/              # API 请求
│   ├── components/       # 公共组件
│   ├── composables/      # 组合式函数
│   ├── customize-tab-bar/# 自定义 tabBar
│   ├── layouts/          # 布局组件
│   ├── pages/            # 页面组件
│   ├── store/            # 状态管理
│   └── utils/            # 工具函数
├── .editorconfig         # 编辑器配置
├── .gitignore            # Git 忽略配置
├── .npmrc                # npm 配置
├── .nvmrc                # Node 版本管理
├── .versionrc            # 版本控制配置
├── alova.config.ts       # Alova 配置
├── commitlint.config.js  # commit 信息校验配置
├── manifest.config.ts    # 应用配置
├── package.json          # 项目依赖
├── pages.config.ts       # 页面配置
├── README.md            # 项目说明
├── tsconfig.json        # TypeScript 配置
├── uno.config.ts        # UnoCSS 配置
└── vite.config.ts       # Vite 配置
```

## 主要依赖

### 核心依赖

- `vue`: ^3.4.38
- `pinia`: ^2.3.1 (状态管理)
- `vue-i18n`: ^9.14.0 (国际化)
- `wot-design-uni`: ^1.11.1 (UI 组件库)
- `alova`: ^3.3.4 (请求库)
- `uni-mini-router`: ^0.1.6 (路由管理)

### 开发依赖

- `@dcloudio/vite-plugin-uni`: 3.0.0
- `@uni-helper/*`: 一系列 uni-app 开发辅助工具
- `unocss`: ^0.62.3 (原子化 CSS 引擎)
- `typescript`: ~5.5.4
- `eslint`: ^9.9.1 (代码检查)

## 开发脚本

```bash
# 开发环境
pnpm dev

# 构建生产环境
pnpm build

# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 提交代码 (使用 commitizen)
pnpm commit
```

## 项目配置

### Vite 配置

- 使用 `@dcloudio/vite-plugin-uni` 作为 uni-app 的 Vite 插件
- 集成了 UnoCSS 支持
- 配置了自动导入和组件自动注册
- 支持 TypeScript

### 路由配置

- 基于文件系统的路由
- 支持子包 (subPackages)
- 自动生成路由类型定义

### UI 组件

- 使用 Wot Design Uni 作为基础组件库
- 支持暗黑模式
- 支持自定义主题
- 内置 70+ 高质量组件

## 开发规范

- 使用 ESLint + Prettier 统一代码风格
- 使用 TypeScript 进行类型检查
- 使用 Git Hooks 进行提交前检查
- 使用 Conventional Commits 规范提交信息

## 部署说明

项目支持多种平台部署，包括：

- H5
- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ 小程序
- 快应用
- App (iOS/Android)

## 相关链接

- [Wot UI 文档](https://wot-design-uni.cn/)
- [Alova 文档](https://alova.js.org/)
- [UnoCSS 文档](https://unocss.dev/)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
