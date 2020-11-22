import React from 'react'
import { Link } from 'gatsby'

import PageLayout from './pageLayout'

// TODO: DRY with blog.js
// TODO: use flex and distributed spacing instead of all this margins
const MEDIUM_SPACING = '0.75rem'
const styles = {
  blogPreview: {
    marginBottom: '2rem',
  },
  blogTitleLink: {
    fontSize: '1.5rem',
    //  margin: "5px auto",
    marginBottom: MEDIUM_SPACING,
    fontWeight: 'bold',
  },
  date: {
    fontSize: '1rem',
    fontStyle: 'italic',
    marginBottom: MEDIUM_SPACING,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  excerpt: {
    // margin: `${MEDIUM_SPACING} auto`,
  },
  active: {
    color: '#053A00', // TODO: consolidate with style.css
  },
}

function BlogList({ posts }) {
  return posts.map((post) => {
    //  const { frontmatter, excerpt } = edge.node;
    const { frontmatter, excerpt } = post
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

const TagsTemplate = (props) => {
  const { pageContext } = props
  // console.log(pageContext)

  const { posts, tagName } = pageContext

  return (
    <PageLayout>
      {/* TODO: code font */}
      <h4 style={styles.active}>
        Browse by tag: <i>{tagName}</i>
      </h4>
      <BlogList posts={posts} />
      {/* <ul style={styles.listContainer}>
				{
					posts.map(post => {
						const { frontmatter } = post;

						return (<li key={frontmatter.path}>
							<Link to={frontmatter.path}>
								<h2>{frontmatter.title}</h2>
							</Link>
							<div>Tags: {frontmatter.tags.join(", ")}</div>
						</li>)
					})
				}
			</ul> */}
      <footer>
        <hr />
        <Link to="/tags">👆 Back to Tags</Link>
      </footer>
    </PageLayout>
  )
}

export default TagsTemplate
