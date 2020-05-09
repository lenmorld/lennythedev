import React from "react"
import { Link } from "gatsby"

import PageLayout from "../components/pageLayout"

// import BlogHeader from '../components/blog_header'
const MEDIUM_SPACING = "0.75rem"

// TODO: use flex and distributed spacing instead of all this margins
const styles = {
  blogPreview: {
    marginBottom: "2rem",
  },
  blogTitleLink: {
    fontSize: "1.5rem",
    //  margin: "5px auto",
    marginBottom: MEDIUM_SPACING,
    fontWeight: "bold",
  },
  date: {
    fontSize: "1rem",
    fontStyle: "italic",
    marginBottom: MEDIUM_SPACING,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  excerpt: {
    // margin: `${MEDIUM_SPACING} auto`,
  },
}

// TODO: also put a preview here
function BlogList({ edges }) {
  return edges.map(edge => {
    const { frontmatter, excerpt } = edge.node
    const { date, path, title } = frontmatter

    return (
      <div key={path} style={styles.blogPreview}>
        <div style={styles.blogTitleLink}>
          <Link to={path}>{title}</Link>
        </div>
        <div style={styles.date}>{date}</div>
        <div style={styles.excerpt}>{excerpt}</div>
      </div>
    )
  })
}

function BlogLayout({ data }) {
  // console.log(props)
  return (
    <PageLayout>
      {/* <BlogHeader /> */}
      <div style={styles.container}>
        {/* <div>{data.allMarkdownRemark.totalCount} posts</div> */}
        <BlogList edges={data.allMarkdownRemark.edges} />
        <hr />
        <div>
          <Link to={`/tags`}>Browse by Tag</Link>
        </div>
      </div>
    </PageLayout>
  )
}

export const query = graphql`
  query BlogListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            path
            date(formatString: "MMM DD, YYYY")
          }
          excerpt
        }
      }
    }
  }
`

export default BlogLayout
