export type MediaVideo = { title: string; source: '' | 'local' | 'external'; src: string; poster: string }
export type GalleryImage = { src: string; alt: string; caption?: string }
export type Story = { id: string; order: number; visible: boolean; number: string; title: string; subtitle: string; excerpt: string; cover: string; body: string[]; history: string; gallery: GalleryImage[]; video: MediaVideo }
