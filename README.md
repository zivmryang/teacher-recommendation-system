# 教师推荐系统

[![Node.js CI](https://github.com/your-repo/teacher-recommendation-system/actions/workflows/node.js.yml/badge.svg)](https://github.com/your-repo/teacher-recommendation-system/actions/workflows/node.js.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 项目介绍

教师推荐系统是一个用于管理外教和学校岗位匹配的智能平台，主要功能包括：

- 外教信息管理
- 学校岗位管理
- 智能推荐匹配
- 推荐流程跟踪
- 数据统计分析

## 技术栈

### 后端
- Node.js (Koa框架)
- MongoDB
- TypeScript
- RESTful API

### 前端
- Vue.js 3
- Vite
- Element Plus
- Axios

## 项目结构

```
teacher-recommendation-system/
├── backend/            # 后端代码
│   ├── src/           # 源代码
│   ├── tests/         # 测试代码
│   └── package.json   # 后端依赖
├── frontend/          # 前端代码
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   └── package.json   # 前端依赖
├── docs/              # 项目文档
└── README.md          # 项目说明
```

## 快速开始

### 环境要求
- Node.js 16+
- MongoDB 4.4+
- Yarn 1.22+

### 安装依赖
```bash
# 后端
cd backend
yarn install

# 前端
cd frontend
yarn install
```

### 运行开发环境
```bash
# 启动后端
cd backend
yarn dev

# 启动前端
cd frontend
yarn dev
```

## 贡献指南
欢迎提交Pull Request。对于重大变更，请先开Issue讨论。

## 许可证
[MIT](LICENSE)
