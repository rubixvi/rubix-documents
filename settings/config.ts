import { OpenGraph, TwitterCard } from "@/lib/metadata";

const gtm = "GTM-XXXXXXX";

const url = "https://rubix-documents.vercel.app";
const sitename = "Documents";
const description = "This comprehensive documentation template, crafted with Next.js and available as open-source, delivers a sleek and responsive design, tailored to meet all your project documentation requirements.";
const keywords = ["Next.js", "documentation", "Rubix Studios", "open source", "SEO"];
const siteicon = "/icon.png";
const urlimage = "/images/og-image.png";
const imagealt = "Rubix Studios Documentation";
const twitterhandle = "@RubixStudios";

const companyname = "Rubix Studios";
const companylink = "https://www.rubixstudios.com.au";

const branding = true;

const rightsidebar = true;
const feedbackedit = true;
const tableofcontent = true;
const totopscroll = true;

const loadfromgithub = false;

export const Company = {
  name: companyname,
  link: companylink,
  branding: branding,
};

export const Settings = {
  gtm: gtm,
  title: sitename,
  metadataBase: url,
  description: description,
  siteicon: siteicon,
  keywords: keywords,
  rightbar: rightsidebar,
  toc: tableofcontent,
  feedback: feedbackedit,
  totop: totopscroll,
  gitload: loadfromgithub,
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