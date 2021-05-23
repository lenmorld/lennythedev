import React from 'react'
import { graphql, Link } from 'gatsby'

import PageLayout from './pageLayout'

import TagsList from './tagsList'

const Template = (props) => {
  const { data, pageContext } = props
  const { markdownRemark } = data
  const { html, frontmatter } = markdownRemark
  const { title, date, tags, description, date_updated } = frontmatter

  const { next, prev } = pageContext

  return (
    <PageLayout>
      <article>
        <h1>{title}</h1>
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <b>{description}</b>
          </div>
          <div style={{ fontSize: '1rem', fontStyle: 'italic' }}>
            <span>{date}</span>
            {date_updated && (
              <span>&nbsp;・&nbsp;Updated on {date_updated}</span>
            )}
          </div>
          <TagsList tags={tags} />
          <hr />
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
      <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
        {prev && <Link to={prev.frontmatter.path}>⬅ Previous post</Link>}
        {next && prev && <span style={{ marginRight: '1rem' }} />}
        {next && <Link to={next.frontmatter.path}>Next post ➡</Link>}
      </div>
    </PageLayout>
  )
}

export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: { eq: $pathSlug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
        tags
        description
        cover_image
        date_updated(formatString: "MMM DD, YYYY")
      }
    }
  }
`

export default Template
