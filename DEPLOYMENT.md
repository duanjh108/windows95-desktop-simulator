# 🚀 GitHub 仓库创建和部署指南

## 📝 步骤1: 创建GitHub仓库

### 方法一：通过GitHub网页创建（推荐）

1. 打开 [GitHub](https://github.com) 并登录您的账户
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `windows95-desktop-simulator`
   - **Description**: `🖥️ A highly accurate Windows 95 desktop experience recreated with modern web technologies`
   - **Visibility**: Public（推荐，让更多人能体验）
   - **不要勾选** "Add a README file"（我们已经有了）
   - **不要勾选** "Add .gitignore"（我们已经有了）
   - **License**: MIT（可选，我们已经包含了LICENSE文件）

4. 点击 "Create repository"

### 方法二：使用GitHub CLI（如果已安装）

如果您有GitHub CLI，可以运行：

```bash
# 在项目目录中运行
gh repo create windows95-desktop-simulator --public --description "🖥️ A highly accurate Windows 95 desktop experience recreated with modern web technologies"
```

## 📤 步骤2: 推送代码到GitHub

在项目目录中运行以下命令：

```bash
# 切换到项目目录
cd C:\tmp\github-copilot

# 添加远程仓库（请替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/windows95-desktop-simulator.git

# 设置默认分支为main（现代Git标准）
git branch -M main

# 推送代码到GitHub
git push -u origin main
```

## 🌐 步骤3: 启用GitHub Pages（可选）

为了让其他人能在线体验您的项目：

1. 在GitHub仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 文件夹
5. 点击 "Save"
6. 几分钟后，您的项目将在以下地址可用：
   `https://YOUR_USERNAME.github.io/windows95-desktop-simulator/`

## 📝 步骤4: 更新README.md中的链接

创建仓库后，请更新README.md中的以下链接：

1. 替换所有的 `your-username` 为您的实际GitHub用户名
2. 更新在线演示链接
3. 确保所有GitHub链接指向正确的仓库

可以使用以下命令批量替换（请先替换YOUR_USERNAME）：

```bash
# 替换README.md中的用户名
sed -i 's/your-username/YOUR_USERNAME/g' README.md
```

或者手动编辑文件。

## 🎯 步骤5: 验证部署

1. 访问您的GitHub仓库页面确认代码已上传
2. 如果启用了GitHub Pages，访问在线地址测试功能
3. 检查README.md在GitHub上的显示效果
4. 确认所有链接都正常工作

## 🔧 故障排除

### 推送失败
如果推送失败，可能需要：

1. **验证Git凭据**：
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **使用Personal Access Token**：
   - 在GitHub设置中创建Personal Access Token
   - 推送时使用token作为密码

3. **检查远程仓库URL**：
   ```bash
   git remote -v
   ```

### GitHub Pages不工作
1. 确认仓库是public
2. 检查GitHub Pages设置
3. 等待几分钟让部署完成
4. 检查浏览器控制台是否有错误

## 📚 后续步骤

1. **添加项目截图**：
   - 在仓库中创建 `screenshots` 文件夹
   - 添加桌面和应用程序的截图
   - 更新README.md中的图片链接

2. **完善文档**：
   - 添加更详细的使用说明
   - 创建开发文档
   - 添加API文档（如果适用）

3. **社区建设**：
   - 启用GitHub Discussions
   - 创建Issue模板
   - 设置贡献者指南

4. **推广项目**：
   - 在社交媒体分享
   - 提交到awesome列表
   - 写博客介绍项目

## 🎉 完成！

恭喜！您的Windows 95桌面模拟器现在已经在GitHub上发布了。其他开发者可以：

- ⭐ Star您的项目
- 🍴 Fork并贡献代码
- 🐛 报告问题和建议
- 🌐 在线体验您的作品

记得定期更新项目，回应社区反馈，让项目变得更好！