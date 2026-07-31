// Site-wide constants. BOOK_DEMO_URL can be swapped for a scheduling link
// (e.g. Cal.com) without touching any component.
export const CONTACT_EMAIL = 'info@gobesmart.nl';
export const BOOK_DEMO_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Demo request')}`;
export const CONTACT_URL = `mailto:${CONTACT_EMAIL}`;
export const LINKEDIN_COMPANY_URL = 'https://www.linkedin.com/company/go-be-smart/';

export const TEAM_LINKEDIN = {
  keje: 'https://www.linkedin.com/in/keje-sinnige/',
  charlie: 'https://www.linkedin.com/in/charlie-zinken-04a3a286/',
  age: 'https://www.linkedin.com/in/agetjalma/',
} as const;

// Header/footer nav. Adding the blog later = one entry here + a route folder.
export const NAV_ITEMS: { key: string; path: string }[] = [
  { key: 'home', path: '/' },
  { key: 'product', path: '/product' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
];
