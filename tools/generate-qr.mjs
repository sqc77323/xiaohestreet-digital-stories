import fs from 'node:fs/promises'
import path from 'node:path'
import QRCode from 'qrcode'
import { fileURLToPath } from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const cfg=JSON.parse(await fs.readFile(path.join(root,'config/site.json'),'utf8'))
const stories=JSON.parse(await fs.readFile(path.join(root,'src/data/stories.json'),'utf8')).filter(s=>s.visible).sort((a,b)=>a.order-b.order)
const siteUrl=(process.env.SITE_URL||cfg.siteUrl||'').replace(/\/$/,'')
if(!/^https:\/\//.test(siteUrl)){
  console.error('未生成二维码：请在 config/site.json 填写已部署的 HTTPS siteUrl，或设置 SITE_URL 环境变量。')
  process.exit(2)
}
const out=path.join(root,'qrcodes');await fs.mkdir(out,{recursive:true})
const entries=[...(cfg.qrIncludeHome?[['home',`${siteUrl}/#/`]]:[]),...stories.map(s=>[s.id,`${siteUrl}/#/stories/${encodeURIComponent(s.id)}`])]
for(const [name,url] of entries){
  await QRCode.toFile(path.join(out,`${name}.png`),url,{errorCorrectionLevel:'H',width:1600,margin:4,color:{dark:'#173631',light:'#FFFFFF'}})
  await fs.writeFile(path.join(out,`${name}.svg`),await QRCode.toString(url,{type:'svg',errorCorrectionLevel:'H',margin:4,color:{dark:'#173631',light:'#FFFFFF'}}))
  console.log(`${name}: ${url}`)
}
await fs.writeFile(path.join(out,'urls.json'),JSON.stringify(Object.fromEntries(entries),null,2)+'\n')
