import type { Story } from './types'
export const asset=(p:string)=>p.startsWith('http')?p:`${import.meta.env.BASE_URL}${p.replace(/^\//,'')}`
export const storiesPath=(id:string)=>`#/stories/${encodeURIComponent(id)}`
export const visibleStories=(items:Story[])=>items.filter(x=>x.visible).sort((a,b)=>a.order-b.order)
