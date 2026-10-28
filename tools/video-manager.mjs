import fs from 'node:fs/promises'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const dataFile=path.join(root,'src/data/stories.json')
const args=Object.fromEntries(process.argv.slice(2).flatMap((x,i,a)=>x.startsWith('--')?[[x.slice(2),a[i+1]??'']]:[]))
const stories=JSON.parse(await fs.readFile(dataFile,'utf8'))
let id=args.story, mode=args.file?'local':args.url?'external':''
let source=args.file||args.url||'', title=args.title||'', poster=args.poster||''

if(!id){
  const rl=readline.createInterface({input,output})
  console.log('\n可用故事： '+stories.map(s=>`${s.id}（${s.title}）`).join('、'))
  id=await rl.question('故事 id：')
  mode=(await rl.question('视频来源 local / external：')).trim()
  source=await rl.question(mode==='local'?'MP4 文件绝对路径：':'外部 MP4 直链：https://')
  title=await rl.question('视频标题（可留空）：')
  poster=await rl.question('封面路径或 URL（可留空，继续用占位封面）：')
  rl.close()
}
const story=stories.find(s=>s.id===id)
if(!story) throw new Error(`找不到故事 id：${id}`)
if(!['local','external'].includes(mode)) throw new Error('来源必须为 local 或 external')
if(mode==='local'){
  const abs=path.resolve(source), stat=await fs.stat(abs)
  if(path.extname(abs).toLowerCase()!=='.mp4') throw new Error('只接受 .mp4 文件')
  if(stat.size>80*1024*1024) throw new Error('文件超过 80MB。请先压缩，建议 720p/1080p、H.264、2–4Mbps。')
  const safe=`${id}-${Date.now()}.mp4`, dest=path.join(root,'public/videos',safe)
  await fs.copyFile(abs,dest); source=`videos/${safe}`
}else if(!/^https:\/\//.test(source)){throw new Error('外部视频必须使用 HTTPS 直链')}
story.video={...story.video,title:title||story.video.title,source:mode,src:source,poster:poster||story.video.poster}
await fs.writeFile(dataFile,JSON.stringify(stories,null,2)+'\n')
console.log(`已关联：${story.title} → ${source}`)
console.log('请运行 pnpm dev 预览，确认后提交 src/data/stories.json 与 public/videos/。')
