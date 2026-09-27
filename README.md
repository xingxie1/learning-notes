# 学习手记

基于 Hexo 和 Butterfly 的学习笔记博客。

- 博客：<https://xingxie1.github.io/learning-notes/>
- 仓库：<https://github.com/xingxie1/learning-notes>

## 用 VS Code 写笔记

选择“文件 → 打开文件夹”，打开整个 `E:\blog`，项目中的编辑器配置会自动生效。配置更新后可重新打开文件夹，或运行 `Developer: Reload Window`。

已配置 Markdown All in One、Markdown Preview Enhanced、markdownlint。

### 1. 新建文章

在 `source/_posts/` 新建并保存英文名的 Markdown 文件，例如 `cf-1234-a.md`。在空白文件输入前缀并按 Tab，展开模板：

| 前缀 | 用途 |
| --- | --- |
| `hexo-note` | 学习笔记：标题、日期、分类、标签和摘要 |
| `hexo-algo` | CF / ICPC 题解：题意、思路、复杂度、C++ 代码和易错点 |
| `cppblock` | C++ 代码块 |
| `mathinline` | 行内公式 |
| `mathblock` | 独立公式块 |

展开后按 Tab 依次填写标题、标签等内容。也可以在命令面板运行 `Insert Snippet` 或 `Snippets: Fill File with Snippet` 选择模板。

另一种方式是在终端运行：

```powershell
.\tools\pnpm.cmd run new -- "新笔记标题"
```

Hexo 会按 `scaffolds/post.md` 创建文章，自动填入标题、日期和分类，并生成同名的图片目录。

### 2. 预览和公式

在命令面板搜索并运行 `Markdown Preview Enhanced: Open Preview to the Side`。

增强预览与博客使用 KaTeX。公式这样写：

```markdown
行内公式：$O(n \log n)$。

$$
a^2 + b^2 = c^2
$$
```

新模板已经包含 `katex: true`。旧文章添加公式时，也要在开头两条 `---` 之间加上这一行，让博客加载公式样式。

### 3. 插入截图或图片

先保存 Markdown 文件，再复制截图，在正文编辑区按 Ctrl+V。VS Code 会把图片存到与文章同名的目录，并插入图片链接。

```text
source/_posts/
  cf-1234-a.md
  cf-1234-a/
    image.png
```

正文中的链接如下：

```markdown
![示意图](cf-1234-a/image.png)
```

该路径可在编辑器中预览，也会在生成博客时转换为正确的网址。文章改名时，请同步修改同名图片目录和正文链接。

### 4. 格式检查

markdownlint 在保存时检查格式，并自动修正可修复的问题。允许中文长段落、Hexo 使用的 HTML，以及 front matter 中的标题；正文不必重复写一级标题。

Markdown All in One 负责列表、表格和编辑快捷键，Markdown Preview Enhanced 负责预览与公式。

### 5. 预览完整博客

在终端运行：

```powershell
.\tools\pnpm.cmd run dev
```

打开 <http://localhost:4000/learning-notes/> 查看 Butterfly 的实际效果。停止服务时在终端按 Ctrl+C。

### 6. 发布

在 VS Code 的“源代码管理”中暂存文章和图片、提交，然后推送到 `main`。也可以运行：

```powershell
git add source
git commit -m "新增学习笔记"
git push origin main
```

GitHub Actions 会自动构建并发布，不需要上传 `public/`。仓库的 Actions 页面可查看发布是否成功。

如果也在 GitHub 网页编辑过文章，请在开始本地写作前先拉取最新内容。

## 依赖和构建

使用 Node.js 24、pnpm 11。换电脑后先运行 `pnpm install`。

生成静态文件：

```powershell
.\tools\pnpm.cmd run clean
.\tools\pnpm.cmd run build
```

## 文件整理

辅助命令入口统一放在 `tools/`。本机的 pnpm 程序放在 `tools/runtime/`，不提交到仓库。在项目根目录运行 `./tools/pnpm.cmd run dev` 可启动预览；换电脑后需要重新准备 pnpm 本地工具，或直接使用系统安装的 pnpm。

VS Code 文件列表隐藏了依赖、缓存、生成结果和不常编辑的工程配置。这些文件仍在原处，博客构建与发布继续使用它们。需要恢复显示时，在 `.vscode/settings.json` 的 `files.exclude` 中删除对应项或改为 `false`。

博客配置 `_config.yml`、主题配置 `_config.butterfly.yml` 和写作目录 `source/` 保持可见。

## 常用文件

- `source/_posts/`：文章及每篇文章的图片。
- `scaffolds/post.md`：Hexo 新建文章模板。
- `.vscode/markdown.code-snippets`：VS Code 笔记、题解、代码和公式模板。
- `.vscode/settings.json`：编辑器与插件配置。
- `.markdownlint.json`：Markdown 格式规则。
- `_config.yml`：博客名称、作者、网址和文章路径。
- `_config.butterfly.yml`：菜单、头像、配色、侧栏和公式样式。

现有两篇文章是示例笔记，可直接改写或删除。
