module.exports = {
  siteMetadata: {
    title: 'lennythedev',
    siteUrl: 'https://lennythedev.com',
    description: 'dev adventures of Lenny'
  },
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`
          }
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`
      }
    }
  ]
}