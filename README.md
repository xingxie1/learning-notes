# 学习手记

基于 [Hexo](https://hexo.io/) 和 [Butterfly](https://butterfly.js.org/) 主题的学习笔记博客，配置为发布到 `https://xingxie1.github.io/learning-notes/`。

## 本地使用

需要 Node.js 24 和 pnpm 11。

```bash
pnpm install
pnpm run dev
```

打开 `http://localhost:4000/learning-notes/` 预览。构建静态文件：

```bash
pnpm run clean
pnpm run build
```

生成结果在 `public/`，无需提交该目录。

## 写学习笔记

在 `source/_posts/` 新建 Markdown 文件，或运行：

```bash
pnpm run new -- "新笔记标题"
```

文章模板包含“问题、思路与实践、总结”三个部分。文章开头的 front matter 可以设置 `title`、`date`、`categories`、`tags`、`description` 和 `cover`。网站会自动生成归档、分类、标签和本地搜索索引。

`source/_posts/` 里的两篇文章是示例内容。准备公开使用时，请改写或删除它们。博客名称、作者、URL 和文章路径在 `_config.yml` 中；菜单、头像、配色与侧栏在 `_config.butterfly.yml` 中。

## 发布到 GitHub Pages

1. 在 GitHub 账号 `xingxie1` 下创建公开仓库 `learning-notes`。
2. 将本目录推送到仓库的 `main` 分支。
3. 在仓库 **Settings → Pages → Build and deployment** 中，选择 **GitHub Actions**。
4. `.github/workflows/pages.yml` 会自动安装依赖、构建网站并发布。完成后访问 `https://xingxie1.github.io/learning-notes/`。

以后每次修改文章并推送到 `main`，网站都会自动更新。仓库改名或使用自定义域名时，需要同步修改 `_config.yml` 的 `url` 与 `root`。具体步骤见 [Hexo 的 GitHub Pages 文档](https://hexo.io/docs/github-pages)和 [GitHub Pages 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
