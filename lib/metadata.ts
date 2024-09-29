export type OpenGraphImage = {
    url: string;
    width: number;
    height: number;
    alt: string;
};
  
export type OpenGraph = {
    type: "website" | "article";
    title: string;
    description: string;
    siteName: string;
    images: OpenGraphImage[];
};
  
export type TwitterCard = {
    card: "summary_large_image" | "summary" | "app" | "player";
    title: string;
    description: string;
    site: string;
    images: { url: string; alt: string }[];
};