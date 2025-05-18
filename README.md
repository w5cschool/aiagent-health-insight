# 🩺 HIA (Health Insights Agent)

AI Agent to analyze blood reports and provide detailed health insights.

人工智能代理，用于分析血液报告并提供详细的健康见解。

<p align="center">
  <a href="https://github.com/harshhh28/hia/issues"><img src="https://img.shields.io/github/issues/harshhh28/hia"></a> 
  <a href="https://github.com/harshhh28/hia/stargazers"><img src="https://img.shields.io/github/stars/harshhh28/hia"></a>
  <a href="https://github.com/harshhh28/hia/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg">
  </a>
</p>

<p align="center">
  <a href="#-features">Features | 功能特点</a> |
  <a href="#%EF%B8%8F-tech-stack">Tech Stack | 技术栈</a> |
  <a href="#-installation">Installation | 安装</a> |
  <a href="#-contributing">Contributing | 贡献</a> |
  <a href="#%EF%B8%8F-author">Author | 作者</a>
</p>

<p align="center">
  <a href="https://github.com/harshhh28/hia"><img src="https://raw.githubusercontent.com/harshhh28/hia/main/public/HIA_demo.gif" alt="Usage Demo"></a>
</p>

## 🌟 Features | 功能特点

### English
- Intelligent agent-based architecture with multi-model cascade system
- In-context learning from previous analyses and knowledge base building
- Medical report analysis with personalized health insights
- PDF upload, validation and text extraction (up to 20MB)
- Secure user authentication and session management
- Session history with report analysis tracking
- Modern, responsive UI with real-time feedback

### 中文
- 基于智能代理的架构，采用多模型级联系统
- 支持从历史分析中学习并构建知识库
- 医疗报告分析，提供个性化健康见解
- PDF 文件上传、验证和文本提取（最大支持 20MB）
- 安全的用户认证和会话管理
- 会话历史记录和报告分析追踪
- 现代化响应式用户界面，支持实时反馈

## 🛠️ Tech Stack | 技术栈

### English
- **Frontend Framework**: Streamlit
  - A Python framework for building data science and ML web apps
  - Rich UI components and real-time updates
  - Easy to use and rapid development
- **AI Integration**: Multi-model architecture via Groq
  - Primary: LLaMA-3.3-70B-Versatile
  - Secondary: LLaMA-3-8B-8192
  - Tertiary: Mixtral-8x7B-32768
  - Fallback: Gemma-7B-IT
- **Database**: Supabase
  - Open-source Firebase alternative
  - PostgreSQL database
  - Built-in authentication
  - Real-time subscriptions
- **PDF Processing**: PDFPlumber
  - PDF file handling and validation
  - Text extraction capabilities
- **Authentication**: Supabase Auth
  - Secure user authentication
  - Session management
  - Email confirmation support

### 中文
- **前端框架**: Streamlit
  - 用于构建数据科学和机器学习 Web 应用的 Python 框架
  - 丰富的 UI 组件和实时更新功能
  - 简单易用，支持快速开发
- **AI 集成**: 通过 Groq 实现的多模型架构
  - 主要模型: LLaMA-3.3-70B-Versatile
  - 次要模型: LLaMA-3-8B-8192
  - 第三级模型: Mixtral-8x7B-32768
  - 备用模型: Gemma-7B-IT
- **数据库**: Supabase
  - 开源的 Firebase 替代方案
  - PostgreSQL 数据库
  - 内置认证系统
  - 实时数据订阅
- **PDF 处理**: PDFPlumber
  - PDF 文件处理和验证
  - 文本提取功能
- **认证系统**: Supabase Auth
  - 安全的用户认证
  - 会话管理
  - 支持邮件确认

## 🚀 Installation | 安装

### Requirements | 系统要求 📋

#### English
- Python 3.8+
- Streamlit 1.30.0+
- Supabase account
- Groq API key
- PDFPlumber
- Python-magic-bin (Windows) or Python-magic (Linux/Mac)

#### 中文
- Python 3.8+
- Streamlit 1.30.0+
- Supabase 账号
- Groq API 密钥
- PDFPlumber
- Python-magic-bin (Windows) 或 Python-magic (Linux/Mac)

### Getting Started | 开始使用 📝

1. Clone the repository | 克隆仓库:

```bash
git clone https://github.com/harshhh28/hia.git
cd hia
```

2. Install dependencies | 安装依赖:

```bash
pip install -r requirements.txt
```

3. Required environment variables | 所需环境变量 (in `.streamlit/secrets.toml`):

```toml
SUPABASE_URL = "your-supabase-url"
SUPABASE_KEY = "your-supabase-key"
GROQ_API_KEY = "your-groq-api-key"
```

4. Set up Supabase database schema | 设置 Supabase 数据库架构:

The application requires the following tables in your Supabase database | 应用需要在 Supabase 数据库中创建以下表:

![database schema](https://raw.githubusercontent.com/harshhh28/hia/main/public/db/schema.png)

You can use the SQL script provided at `public/db/script.sql` <a href="https://www.github.com/harshhh28/hia/blob/main/public/db/script.sql">[link]</a> to set up the required database schema | 您可以使用 `public/db/script.sql` 提供的 SQL 脚本来设置所需的数据库架构.

(PS: You can turn off the email confirmation on signup in Supabase settings -> signup -> email | 提示：您可以在 Supabase 设置 -> signup -> email 中关闭注册时的邮件确认)

5. Run the application | 运行应用:

```bash
streamlit run src\main.py
```

## 📁 Project Structure | 项目结构

```
hia/
├── requirements.txt
├── README.md
├── src/
│   ├── main.py                 # Application entry point | 应用入口点
│   ├── auth/                   # Authentication related modules | 认证相关模块
│   │   ├── auth_service.py     # Supabase auth integration | Supabase 认证集成
│   │   └── session_manager.py  # Session management | 会话管理
│   ├── components/             # UI Components | UI 组件
│   │   ├── analysis_form.py    # Report analysis form | 报告分析表单
│   │   ├── auth_pages.py       # Login/Signup pages | 登录/注册页面
│   │   ├── footer.py          # Footer component | 页脚组件
│   │   └── sidebar.py         # Sidebar navigation | 侧边栏导航
│   ├── config/                # Configuration files | 配置文件
│   │   ├── app_config.py      # App settings | 应用设置
│   │   └── prompts.py         # AI prompts | AI 提示词
│   ├── services/              # Service integrations | 服务集成
│   │   └── ai_service.py      # AI service integration | AI 服务集成
│   ├── agents/                # Agent-based architecture components | 基于代理的架构组件
│   │   ├── agent_manager.py   # Agent management | 代理管理
│   │   └── model_fallback.py  # Model fallback logic | 模型回退逻辑
│   └── utils/                 # Utility functions | 工具函数
│       ├── validators.py      # Input validation | 输入验证
│       └── pdf_extractor.py   # PDF processing | PDF 处理
```

## 👥 Contributing | 贡献

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, the development workflow, coding standards, and more.

欢迎贡献！请阅读我们的[贡献指南](CONTRIBUTING.md)，了解如何提交拉取请求、开发工作流程、编码标准等详细信息。

We appreciate all contributions, from reporting bugs and improving documentation to implementing new features.

我们感谢所有形式的贡献，从报告错误和改进文档到实现新功能。

## 👨‍💻 Contributors | 贡献者

Thanks to all the amazing contributors who have helped improve this project!

感谢所有帮助改进这个项目的优秀贡献者！

| Avatar | Name | GitHub | Role | Contributions |
|--------|------|--------|------|---------------|
| <img src="https://github.com/harshhh28.png" width="50px" height="50px" alt="harshhh28"/> | Harsh Gajjar | [harshhh28](https://github.com/harshhh28) | Project Creator & Maintainer | Core implementation, Documentation |

<!-- To future contributors: Your profile will be added here when your PR is merged! -->

## 📄 License | 许可证

This project is licensed under the MIT License - see the LICENSE file for details.

本项目采用 MIT 许可证 - 详情请查看 LICENSE 文件。

## 🙋‍♂️ Author | 作者

Created by [Harsh Gajjar](https://harshgajjar.vercel.app)

由 [Harsh Gajjar](https://harshgajjar.vercel.app) 创建
