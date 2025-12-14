export interface SeoData {
  title: string;
  description: string;
  image?: string;
  // Absolute path override, e.g. '/' for the /home route
  canonicalPath?: string;

  // e.g. 'noindex, follow' for 404
  robots?: string;
}
