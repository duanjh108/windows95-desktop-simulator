# 贡献指南

感谢您考虑为Windows 95桌面模拟器做出贡献！本文档将指导您如何参与项目开发。

## 🤝 贡献方式

### 报告问题
- 使用 [GitHub Issues](https://github.com/duanjh108/windows95-desktop-simulator/issues) 报告bugs
- 请提供详细的问题描述和复现步骤
- 包含浏览器版本和操作系统信息

### 建议功能
- 通过 Issues 提交功能请求
- 详细描述建议的功能和使用场景
- 考虑功能是否符合Windows 95的风格

### 代码贡献
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 进行开发并测试
4. 提交更改 (`git commit -m 'Add amazing feature'`)
5. 推送到分支 (`git push origin feature/amazing-feature`)
6. 创建 Pull Request

## 📝 开发规范

### 代码风格
- 使用4个空格缩进
- 使用驼峰命名法
- 为复杂逻辑添加注释
- 保持函数简洁，单一职责

### Windows 95风格要求
- 保持原汁原味的Windows 95界面
- 使用正确的颜色方案和字体
- 维护经典的3D按钮效果
- 确保交互行为与原版一致

### 兼容性要求
- 支持Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- 确保响应式设计在不同设备上正常工作
- 避免使用实验性的Web API

### 测试要求
- 在主要浏览器中测试新功能
- 确保不破坏现有功能
- 测试不同屏幕尺寸的表现

## 🏗️ 项目结构

```
windows95-desktop-simulator/
├── index.html          # 主HTML文件
├── demo.html           # 演示页面
├── styles.css          # 样式文件
├── script.js           # 主要逻辑
├── sounds/             # 音效文件
├── screenshots/        # 项目截图
└── docs/              # 文档
```

### 主要类和方法

#### Windows95Desktop 类
- `constructor()` - 初始化桌面
- `createWindow()` - 创建新窗口
- `openApplication()` - 打开应用程序
- `setupEventListeners()` - 设置事件监听

#### 应用程序开发
新应用程序应该：
1. 在 `openApplication()` 方法中添加case
2. 创建专门的 `open[AppName]()` 方法
3. 如需要，添加 `setup[AppName]()` 方法设置特定逻辑

## 🎯 开发优先级

### 高优先级
- Bug修复
- 性能优化
- 兼容性改进
- 核心功能完善

### 中优先级
- 新的系统应用程序
- 界面细节优化
- 音效系统改进

### 低优先级
- 高级功能
- 实验性特性
- 第三方集成

## 📋 Pull Request 检查清单

提交PR前请确认：

- [ ] 代码遵循项目规范
- [ ] 在主要浏览器中测试通过
- [ ] 不破坏现有功能
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 保持Windows 95的原汁原味

## 🚀 发布流程

1. 更新版本号
2. 更新CHANGELOG.md
3. 创建GitHub Release
4. 更新在线演示

## ❓ 获得帮助

- 加入讨论：[GitHub Discussions](https://github.com/duanjh108/windows95-desktop-simulator/discussions)
- 查看已有问题：[GitHub Issues](https://github.com/duanjh108/windows95-desktop-simulator/issues)
- 邮件联系：[your-email@example.com]

## 📄 许可证

通过贡献代码，您同意您的贡献将在MIT许可证下授权。

---

感谢您的贡献！🎉