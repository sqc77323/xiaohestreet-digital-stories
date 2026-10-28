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
| 构建体积 | 通过，`dist` 约 1.7MB（未加入视频） |

构建命令：`pnpm test && pnpm typecheck && pnpm build`

当前没有 GitHub 仓库远程地址或授权，因此未执行推送和线上部署；`config/site.json` 中的正式地址保持为空，`qrcodes/` 中没有伪正式二维码。
