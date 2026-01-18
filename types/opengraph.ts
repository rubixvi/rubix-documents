export interface OpenGraphImage {
  url: string
  width: number
  height: number
  alt: string
}

export interface OpenGraph {
  type: 'website' | 'article'
  title: string
  description: string
  siteName: string
  images: OpenGraphImage[]
}

export interface TwitterCard {
  card: 'summary_large_image' | 'summary' | 'app' | 'player'
  title: string
  description: string
  site: string
  images: { url: string; alt: string }[]
}
