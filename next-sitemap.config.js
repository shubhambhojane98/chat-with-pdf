module.exports = {
  siteUrl: "https://www.pdfdialogue.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: "./public",
  generateIndexSitemap: true,
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    // Add other static or dynamic paths here
  ],
};
