import { OpenGraph, TwitterCard } from "@/lib/metadata";
import { 
  gtm, gtmconnected, url, sitename, description, keywords, siteicon, urlimage, imagealt, 
  twitterhandle, companyname, companylink, branding, rightsidebar, feedbackedit, 
  tableofcontent, totopscroll, loadfromgithub 
} from "@/settings/settings";

export const Company = {
  name: companyname,
  link: companylink,
  branding: branding,
};

export const Settings = {
  gtm: gtm,
  gtmconnected: gtmconnected,
  rightbar: rightsidebar,
  toc: tableofcontent,
  feedback: feedbackedit,
  totop: totopscroll,
  gitload: loadfromgithub,

  title: sitename,
  metadataBase: url,
  description: description,
  siteicon: siteicon,
  keywords: keywords,
  openGraph: {
    type: "website",
    title: sitename,
    description: description,
    siteName: sitename,
    images: [
      {
        url: urlimage,
        width: 1200,
        height: 630,
        alt: imagealt,
      },
    ],
  } as OpenGraph,
  twitter: {
    card: "summary_large_image",
    title: sitename,
    description: description,
    site: twitterhandle,
    images: [
      {
        url: urlimage,
        alt: imagealt,
      },
    ],
  } as TwitterCard,
  canonical: url,
};