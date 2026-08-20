/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://kuyenchile.cl',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/checkout/success', '/checkout/failure', '/checkout/pending', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout/*', '/api/*'],
      },
    ],
  },
};
