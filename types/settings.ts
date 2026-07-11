import {
  branding,
  companylink,
  companyname,
  description,
  feedbackedit,
  gtm,
  gtmconnected,
  imagealt,
  keywords,
  loadfromgithub,
  rightsidebar,
  siteicon,
  sitename,
  tableofcontent,
  totopscroll,
  twitterhandle,
  url,
  urlimage,
} from '@/settings/main'
import { type OpenGraph, type TwitterCard } from '@/types/opengraph'

interface AppSettings {
  branding: boolean
  canonical: string
  description: string
  feedback: boolean
  gitload: boolean
  gtm: string
  gtmconnected: boolean
  keywords: string[]
  link: string
  metadataBase: string
  name: string
  openGraph: OpenGraph
  rightbar: boolean
  siteicon: string
  title: string
  toc: boolean
  totop: boolean
  twitter: TwitterCard
}

export const Settings: AppSettings = {
  name: companyname,
  link: companylink,
  branding,
  gtm,
  gtmconnected,
  rightbar: rightsidebar,
  toc: tableofcontent,
  feedback: feedbackedit,
  totop: totopscroll,
  gitload: loadfromgithub,

  title: sitename,
  metadataBase: url,
  description,
  siteicon,
  keywords,
  openGraph: {
    type: 'website',
    title: sitename,
    description,
    siteName: sitename,
    images: [
      {
        url: urlimage,
        width: 1200,
        height: 630,
        alt: imagealt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: sitename,
    description,
    site: twitterhandle,
    images: [
      {
        url: urlimage,
        alt: imagealt,
      },
    ],
  },
  canonical: url,
}
