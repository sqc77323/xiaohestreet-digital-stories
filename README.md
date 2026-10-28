# 小河直街数字故事卡

这是一个可直接部署到 GitHub Pages 的移动端 H5 项目。网站使用 Vite、React 和 TypeScript，不需要数据库、服务器或付费 API。故事内容由 JSON 管理；视频可通过本地管理脚本实际复制并关联；正式部署后可批量生成 PNG 与 SVG 二维码。

## 一 启动项目

需要 Node.js 20 以上和 pnpm。

```bash
pnpm install
pnpm dev
```

终端会显示本地预览地址。生产构建与检查：

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm preview
```

构建结果位于 `dist/`。项目使用 Hash 路由，故事地址形如 `#/stories/canal`，因此 GitHub Pages 上直接打开和刷新详情页不会产生 404。所有资源均通过 Vite 相对基路径加载，支持仓库子路径。

## 二 上传自己的 MP4 视频

推荐使用管理工具，它会真实复制文件并更新故事配置，不是网页里的虚假上传按钮：

```bash
pnpm video:manage
```

按提示选择故事、来源和文件。也可以直接传参数：

```bash
node tools/video-manager.mjs \
  --story canal \
  --file "/绝对路径/运河码头.mp4" \
  --title "运河码头"
```

工具会把文件复制到 `public/videos/`，并自动更新 `src/data/stories.json`。外部 MP4 直链使用：

```bash
node tools/video-manager.mjs \
  --story canal \
  --url "https://cdn.example.com/canal.mp4" \
  --title "运河码头"
```

外链必须为 HTTPS，并且服务器需要允许跨域访问和 Range 请求。网页播放器使用 `controls`、`playsInline` 和 `preload="metadata"`，不会自动播放声音；兼容微信内置浏览器、iPhone Safari 与安卓 Chrome。

建议单个视频不超过 30MB，脚本的硬限制为 80MB。推荐 H.264＋AAC、720×1280 或 1080×1920、2–4Mbps、开启 faststart。可用 FFmpeg 压缩：

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 25 -preset medium \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

## 三 替换视频封面

把 JPG、PNG、WebP 或 SVG 放入 `public/media/`，然后修改故事的 `video.poster`：

```json
"poster": "media/posters/canal.jpg"
```

也可在运行 `pnpm video:manage` 时填写封面路径。当前三个封面均明确标记为“影像档案待补充”的占位素材，不代表已有视频。

## 四 新增或修改故事

编辑 `src/data/stories.json`。复制现有对象并修改以下字段：

- `id`：唯一英文标识，生成详情地址和二维码时使用
- `order`：首页与目录排序，数字越小越靠前
- `visible`：`false` 时不在网站与二维码清单中显示
- `title`、`subtitle`、`excerpt`：标题与摘要
- `cover`：封面图，相对于 `public/` 的路径
- `body`：正文段落数组
- `history`：史料边界或来源说明
- `gallery`：图片、替代文本和图注
- `video`：视频标题、来源、地址和封面

图片放入 `public/media/images/`。修改后运行 `pnpm test`，脚本会检查重复 ID、必要字段和本地资源路径。

删除故事时直接移除对应 JSON 对象；临时隐藏时把 `visible` 改成 `false`。

## 五 部署到 GitHub Pages

本项目已部署到：<https://sqc77323.github.io/xiaohestreet-digital-stories/>，源码仓库为：<https://github.com/sqc77323/xiaohestreet-digital-stories>。

如需在新的仓库重新部署：

1. 在 GitHub 新建一个空仓库。
2. 在本目录执行：

   ```bash
   git init
   git add .
   git commit -m "完成小河直街数字故事卡"
   git branch -M main
   git remote add origin https://github.com/你的账号/你的仓库.git
   git push -u origin main
   ```

3. 打开仓库 `Settings → Pages`，在 `Build and deployment` 中把 Source 选择为 `GitHub Actions`。
4. 等待 `Deploy GitHub Pages` 工作流完成。以后推送到 `main` 会自动检查、构建和部署。

## 六 生成正式二维码

部署成功前不要生成二维码。先把最终 HTTPS 地址写入 `config/site.json`：

```json
{
  "siteUrl": "https://你的账号.github.io/你的仓库"
}
```

然后执行：

```bash
pnpm qr:generate
```

输出位于 `qrcodes/`，每个可见故事和首页各生成一份高容错 PNG、可编辑 SVG，并保存 `urls.json` 对照表。新增故事后重新执行即可自动补码。

也可以不修改配置，临时传入地址：

```bash
SITE_URL=https://你的账号.github.io/你的仓库 pnpm qr:generate
```

当地址为空、不是 HTTPS 或仍未确定时，脚本会拒绝生成，避免把 localhost 或示例地址误当正式二维码。

## 七 更新已经上线的网站

1. 修改 `src/data/stories.json`、替换 `public/media/` 文件，或运行视频管理工具。
2. 执行 `pnpm test && pnpm build`。
3. 提交并推送：

   ```bash
   git add .
   git commit -m "更新故事内容"
   git push
   ```

GitHub Actions 会自动重新部署。只要仓库名和故事 `id` 不变，现有二维码无需重新印刷；如果新增故事、修改 `id` 或更换仓库地址，应重新生成二维码。

## 项目结构

```text
src/data/stories.json      故事与视频配置
src/main.tsx               页面与交互
src/styles.css             江南主题视觉系统
public/media/              图片及视频占位封面
public/videos/             本地 MP4 目录
tools/video-manager.mjs    本地视频管理工具
tools/generate-qr.mjs      正式二维码批量生成
tools/validate-content.mjs 内容与路径检查
.github/workflows/         GitHub Pages 自动部署
config/site.json           正式站点地址
```

## 内容说明

示例街景图片来自项目预调研附件。历史文字依据杭州市拱墅区政府等公开资料整理；未把平台评论或探索性调研数据写成长期统计，也没有生成或冒充真实历史视频。
