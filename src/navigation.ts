import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'Blog', href: getBlogPermalink() },
    { text: 'About', href: getPermalink('/about') },
  ],
  actions: [{ text: 'GitHub', href: 'https://github.com/hon454', target: '_blank', icon: 'tabler:brand-github' }],
};

export const footerData = {
  links: [],
  secondaryLinks: [{ text: 'RSS', href: getAsset('/rss.xml') }],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/hon454' },
  ],
  footNote: `
    © 2026 Jihoon Jeon. Built with AstroWind.
  `,
};
