# 🖥️ Windows 95 桌面模拟器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> 一个高度还原的Windows 95桌面体验Web应用程序，使用现代Web技术重现经典操作系统界面。

## ✨ 项目亮点

- 🎯 **像素级精确还原** - 完全复制Windows 95的视觉和交互体验
- ⚡ **现代Web技术** - 使用HTML5/CSS3/ES6+实现经典界面
- 🎮 **完整功能** - 包含窗口管理、应用程序和系统工具
- 📱 **响应式设计** - 适配桌面和移动设备
- 🎵 **沉浸体验** - 经典音效系统增强真实感
- 🔧 **易于扩展** - 模块化架构便于添加新功能

## 🚀 在线体验

[🖱️ 点击这里体验在线演示](https://your-username.github.io/windows95-desktop-simulator/)

或者直接下载代码本地运行：

```bash
git clone https://github.com/your-username/windows95-desktop-simulator.git
cd windows95-desktop-simulator
# 直接在浏览器中打开 index.html 或使用本地服务器
python -m http.server 8000  # Python 3
# 或
php -S localhost:8000       # PHP
```

## 📸 项目截图

<div align="center">
  <img src="screenshots/desktop.png" alt="Windows 95桌面" width="800"/>
  <p><em>经典的Windows 95桌面界面</em></p>
</div>

<div align="center">
  <table>
    <tr>
      <td><img src="screenshots/notepad.png" alt="记事本" width="300"/></td>
      <td><img src="screenshots/calculator.png" alt="计算器" width="300"/></td>
      <td><img src="screenshots/paint.png" alt="画图" width="300"/></td>
    </tr>
    <tr>
      <td align="center"><em>记事本应用</em></td>
      <td align="center"><em>计算器应用</em></td>
      <td align="center"><em>画图应用</em></td>
    </tr>
  </table>
</div>

## 🎯 功能特性

### 🖥️ 桌面环境
- ✅ 经典的Windows 95绿色渐变背景
- ✅ 桌面图标管理（拖拽、选择、双击打开）
- ✅ 右键上下文菜单（排列图标、刷新、属性等）
- ✅ 完整任务栏（开始按钮、任务区域、系统托盘、时钟）
- ✅ 实时时钟显示

### 📋 开始菜单系统
- ✅ 经典Windows 95开始按钮样式和动画
- ✅ 分级菜单结构（程序、文档、设置等）
- ✅ 程序分类（附件、游戏、系统工具）
- ✅ 系统功能（查找、帮助、运行、关机）

### 🪟 窗口管理系统
- ✅ 经典3D边框、标题栏、控制按钮
- ✅ 完整窗口操作（拖拽移动、调整大小、最小化/最大化/关闭）
- ✅ 智能Z-index层级管理
- ✅ 活动窗口高亮显示
- ✅ 任务栏按钮与窗口状态实时同步

### 📱 内置应用程序
- ✅ **记事本** - 完整文本编辑功能，包含菜单栏
- ✅ **计算器** - 标准计算器，支持基本数学运算
- ✅ **画图** - 基本绘图工具（画笔、橡皮擦、图形等）
- ✅ **我的电脑** - 文件系统浏览器界面
- ✅ **回收站** - 垃圾回收功能
- ✅ **扫雷** - 完整可玩的经典扫雷游戏

### 🎵 音效系统
- ✅ 系统启动音效
- ✅ 按钮点击音效
- ✅ 错误提示音效
- ✅ 基于Web Audio API
- ✅ 可配置音效开关

### 🎨 界面设计
- ✅ 像素级精确的Windows 95界面还原
- ✅ 经典3D按钮效果和颜色方案
- ✅ 正确的系统字体和图标
- ✅ 完整的滚动条样式
- ✅ 响应式布局适配

## 🛠️ 技术架构

### 前端技术栈
- **HTML5** - 语义化标记和现代Web API
- **CSS3** - 高级样式特性和动画
- **JavaScript ES6+** - 现代JavaScript特性
- **CSS Grid/Flexbox** - 灵活布局系统
- **Web Audio API** - 音效播放支持

### 架构设计
```
Windows95Desktop (主类)
├── 🖥️ 桌面管理
│   ├── 图标管理
│   ├── 右键菜单
│   └── 背景设置
├── 📋 开始菜单
│   ├── 菜单渲染
│   ├── 事件处理
│   └── 子菜单管理
├── 🪟 窗口管理
│   ├── 窗口创建
│   ├── 层级管理
│   ├── 拖拽功能
│   └── 状态同步
├── 📱 应用系统
│   ├── 记事本
│   ├── 计算器
│   ├── 画图
│   └── 扫雷游戏
└── 🎵 音效系统
    ├── 音频加载
    ├── 播放控制
    └── 配置管理
```

### 核心特性
- **面向对象设计** - 清晰的类结构和职责分离
- **事件驱动架构** - 响应式用户交互处理
- **模块化应用** - 每个应用程序独立实现
- **状态管理** - 统一的窗口和应用状态管理
- **性能优化** - 高效的DOM操作和事件处理

## 📁 项目结构

```
windows95-desktop-simulator/
├── 📄 index.html              # 主HTML文件
├── 📄 demo.html               # 项目演示页面
├── 🎨 styles.css              # 完整CSS样式
├── ⚙️ script.js               # 核心JavaScript逻辑
├── 📁 sounds/                 # 音效文件目录
│   ├── 🔊 startup.wav         # 系统启动音
│   ├── 🔊 click.wav           # 点击音效
│   ├── 🔊 error.wav           # 错误音效
│   └── 📖 README.md           # 音效说明
├── 📁 screenshots/            # 项目截图
├── 📖 README.md               # 项目说明
└── 📜 LICENSE                 # MIT许可证
```

## 🎮 使用指南

### 基本操作
1. **打开应用** - 双击桌面图标或通过开始菜单
2. **移动窗口** - 拖拽窗口标题栏
3. **调整窗口** - 点击最小化/最大化/关闭按钮
4. **切换窗口** - 点击任务栏按钮
5. **右键菜单** - 在桌面空白处右键点击

### 快捷键
- `Ctrl + Esc` - 打开/关闭开始菜单
- `Alt + Tab` - 切换窗口（计划中）
- `F5` - 刷新桌面（计划中）

### 应用程序使用
- **记事本** - 直接输入文本，使用菜单栏功能
- **计算器** - 点击数字和运算符按钮进行计算
- **画图** - 选择工具后在画布上绘制
- **扫雷** - 左键点击方块，右键标记地雷

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 | 状态 |
|--------|----------|------|
| Chrome | 80+ | ✅ 完全支持 |
| Firefox | 75+ | ✅ 完全支持 |
| Safari | 13+ | ✅ 完全支持 |
| Edge | 80+ | ✅ 完全支持 |
| Opera | 67+ | ✅ 完全支持 |

## 📈 开发路线图

### 🎯 第一阶段 (已完成)
- [x] 基本桌面环境搭建
- [x] 完整窗口管理系统
- [x] 开始菜单和任务栏
- [x] 核心应用程序开发
- [x] 音效系统集成

### 🚀 第二阶段 (开发中)
- [ ] 完整文件管理器（Windows资源管理器）
- [ ] 控制面板设置界面
- [ ] 更多系统工具（设备管理器、磁盘管理等）
- [ ] 个性化设置（壁纸、主题、屏保）
- [ ] 改进音效系统

### 🌟 第三阶段 (计划中)
- [ ] 网络功能模拟（拨号网络、IE浏览器）
- [ ] 更多游戏（纸牌、三维弹球）
- [ ] 办公套件（写字板、通讯簿）
- [ ] 开发者工具（注册表编辑器、命令提示符）
- [ ] 性能优化和错误处理

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看以下指南：

### 贡献类型
- 🐛 **Bug报告** - 发现问题请提交Issue
- ✨ **新功能** - 建议新功能或改进
- 📖 **文档** - 改进文档和说明
- 🎨 **界面** - 优化UI/UX设计
- 🔧 **代码** - 提交代码修复或功能

### 开发流程
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 保持Windows 95的原汁原味风格
- 使用清晰的变量和函数命名
- 添加必要的注释和文档
- 确保代码在主流浏览器中正常工作
- 遵循现有的代码风格

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

```
MIT License

Copyright (c) 2024 Windows95 Desktop Simulator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 致谢

- **Microsoft** - 感谢创造了经典的Windows 95操作系统
- **开源社区** - 提供了优秀的Web技术和工具
- **贡献者们** - 感谢所有为项目做出贡献的开发者

## 📞 联系方式

- 项目主页：[GitHub Repository](https://github.com/your-username/windows95-desktop-simulator)
- 问题反馈：[Issues](https://github.com/your-username/windows95-desktop-simulator/issues)
- 功能请求：[Feature Requests](https://github.com/your-username/windows95-desktop-simulator/issues/new?template=feature_request.md)

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给个Star支持一下！</p>
  <p>Made with ❤️ by Windows 95 enthusiasts</p>
</div>