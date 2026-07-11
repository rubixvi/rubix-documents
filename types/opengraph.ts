export interface OpenGraphImage {
  alt: string
  height: number
  url: string
  width: number
}

export interface OpenGraph {
  description: string
  images: OpenGraphImage[]
  siteName: string
  title: string
  type: 'website' | 'article'
}

export interface TwitterCard {
  card: 'summary_large_image' | 'summary' | 'app' | 'player'
  description: string
  images: { url: string; alt: string }[]
  site: string
  title: string
}
