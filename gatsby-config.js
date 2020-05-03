module.exports = {
  siteMetadata: {
    title: 'lennythedev',
    siteUrl: 'https://lennythedev.com',
    description: 'dev adventures of Lenny'
  },
  plugins: [
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`
      }
    }
  ]
}