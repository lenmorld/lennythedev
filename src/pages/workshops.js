import React from 'react'
import { graphql } from 'gatsby'
import PageLayout from '../components/pageLayout'

function Workshops({ data }) {
  console.log(data)

  return (
    <PageLayout>
      <article>
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      </article>
    </PageLayout>
  )
}

export const query = graphql`
  query WorkshopPage {
    markdownRemark(frontmatter: { title: { regex: "/workshop/i" } }) {
      frontmatter {
        title
      }
      html
    }
  }
`

export default Workshops
