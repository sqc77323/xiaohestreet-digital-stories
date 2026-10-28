# 测试报告

执行日期：2026年10月28日

| 检查项 | 结果 |
|---|---|
| 故事 JSON 结构及本地资源路径 | 通过，3个故事、3个显示 |
| TypeScript 类型检查 | 通过 |
| Vite 生产构建 | 通过 |
| GitHub Pages 子路径资源 | 通过，使用相对 base 与 Hash 路由 |
| 首页浏览器渲染 | 通过 |
| 故事详情直达 | 通过，`#/stories/canal` |
| 未配置视频时的占位状态 | 通过，明确显示“影像档案待补充” |
| 正式二维码保护 | 通过，未设置 HTTPS 地址时拒绝生成 |
| 正式二维码解码 | 通过，首页及3个故事地址一一对应 |
| GitHub Actions 构建和部署 | 通过 |
| 正式页面可达性 | 通过，首页及3个故事地址均返回 HTTP 200 |
| 构建体积 | 通过，`dist` 约 1.7MB（未加入视频） |

构建命令：`pnpm test && pnpm typecheck && pnpm build`

正式站点：<https://sqc77323.github.io/xiaohestreet-digital-stories/>

源码仓库：<https://github.com/sqc77323/xiaohestreet-digital-stories>

正式二维码位于 `qrcodes/`：`index` 对应首页，`canal`、`home`、`renewal` 分别对应三个故事。PNG 和 SVG 均已生成并完成实际解码检查。
