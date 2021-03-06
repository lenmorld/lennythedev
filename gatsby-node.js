const libPath = require('path')

const createTagPages = (createPage, posts) => {
  const tagsTemplate = libPath.resolve('./src/components/tags.js')
  const tagTemplate = libPath.resolve('./src/components/tag.js')

  const postsByTag = {}

  posts.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach((tag) => {
        if (!postsByTag[tag]) {
          postsByTag[tag] = []
        }

        postsByTag[tag].push(node)
      })
    }
  })

  const tags = Object.keys(postsByTag)

  // create Tags page /tags
  createPage({
    path: '/tags',
    component: tagsTemplate,
    context: {
      tags: tags.sort(),
    },
  })

  // create page for each Tag /tags/${tagName}
  tags.forEach((tagName) => {
    const postsWithTag = postsByTag[tagName]

    createPage({
      path: `/tags/${tagName}`,
      component: tagTemplate,
      context: {
        posts: postsWithTag,
        tagName,
      },
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve) => {
    const blogPostTemplate = libPath.resolve('./src/components/blogPost.js')
    resolve(
      graphql(
        `
          query {
            allMarkdownRemark(
              sort: { order: ASC, fields: [frontmatter___date] }
            ) {
              edges {
                node {
                  frontmatter {
                    path
                    title
                    tags
                    date
                    date_updated
                  }
                  excerpt
                }
              }
            }
          }
        `,
      ).then((result) => {
        const posts = result.data.allMarkdownRemark.edges

        // create tag pages
        createTagPages(createPage, posts)

        posts.forEach(({ node }, index) => {
          const { path } = node.frontmatter
          // console.log(path)
          createPage({
            path,
            component: blogPostTemplate,
            context: {
              pathSlug: path,
              prev: index === 0 ? null : posts[index - 1].node,
              next: index === posts.length - 1 ? null : posts[index + 1].node,
            },
          })

          resolve()
        })
      }),
    )
  })
}
