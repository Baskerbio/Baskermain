import { useEffect } from 'react';
import { useRoute } from 'wouter';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const SEO_KEYWORDS = [
  'Basker',
  'Basker Bio',
  'Baskerbio',
  'free link platform',
  'free linkinbio platform',
  'link in bio',
  'link-in-bio',
  'decentralized bluesky',
  'AT Protocol',
  'Bluesky links',
  'social media link',
  'bio link',
  'personal link page',
  'link aggregator',
  'social media profile',
  'basker.bio',
  'bsky',
  'atproto',
  'decentralized social',
  'open source link platform',
  'free portfolio link',
  'social link manager',
  'free link sharing',
  'custom bio link',
  'social media management',
  'link sharing platform',
  'bio link service',
  'social link tool',
  'free social link',
  'link page builder'
];

export function SEOHead({ 
  title = 'Basker - Free Link-in-Bio Platform on AT Protocol', 
  description = 'Create your free link-in-bio page on Basker. Decentralized, powered by Bluesky and AT Protocol. Add unlimited links, widgets, and customize your profile.',
  keywords = '',
  image = 'https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg',
  type = 'website'
}: SEOHeadProps) {
  const [match] = useRoute('/:handle');

  useEffect(() => {
    // Combine provided keywords with default keywords
    const allKeywords = keywords 
      ? `${keywords}, ${SEO_KEYWORDS.join(', ')}`
      : SEO_KEYWORDS.join(', ');

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update or create property meta tags (for Open Graph)
    const updatePropertyTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update title
    document.title = title;

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', allKeywords);
    updateMetaTag('author', 'Basker');
    updateMetaTag('robots', 'index, follow');

    // Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:url', window.location.href);
    updatePropertyTag('og:site_name', 'Basker');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Additional SEO tags
    updateMetaTag('theme-color', '#8b5cf6');
    updateMetaTag('apple-mobile-web-app-title', 'Basker');
    updateMetaTag('application-name', 'Basker');

    // Update existing meta tags if they exist
    const seoTitle = document.getElementById('seo-title');
    if (seoTitle) seoTitle.textContent = title;

    const seoDesc = document.getElementById('seo-description');
    if (seoDesc) seoDesc.setAttribute('content', description);

    const seoKeywords = document.getElementById('seo-keywords');
    if (seoKeywords) seoKeywords.setAttribute('content', allKeywords);

    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.getElementById('og-description');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogImage = document.getElementById('og-image');
    if (ogImage) ogImage.setAttribute('content', image);
  }, [title, description, keywords, image, type, match]);

  return null;
}
