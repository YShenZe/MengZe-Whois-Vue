# MengZe-Whois

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo-url)

基于 Vue 3 + Element Plus 的 WHOIS 域名信息查询工具，支持以下功能：
- 域名 WHOIS 信息查询
- 中英文字段自动翻译
- 查询结果截图保存
- 原始数据查看
- 响应式布局

## 技术栈
**前端**  
Vue 3 + Vite + Element Plus + html2canvas  

**后端**  
Netlify Functions + whois 模块  

## 部署到 Netlify

### 一键部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo-url)

### 手动部署
1. 登录 [Netlify](https://app.netlify.com/) 控制台
2. 选择 "Import from Git" -> 选择你的代码仓库
3. 配置构建设置：
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. 点击 "Deploy site" 完成部署

## 本地开发
```sh
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```