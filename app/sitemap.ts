import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const links = [
    {
      url: 'http://letsgo-th.com/',
      lastModified: new Date(),
    },
  ];
  return links;
}
