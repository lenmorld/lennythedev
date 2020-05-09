import React from 'react'
import { graphql, Link } from 'gatsby'

import PageLayout from './pageLayout'

const Template = (props) => {
	console.log(props)

	const { data, pageContext } = props
	const { markdownRemark } = data
	const { html, frontmatter } = markdownRemark
	const { title, date } = frontmatter

	const { next, prev } = pageContext

	return (
		<PageLayout>
			<article>
				<h1>{title}</h1>
				<div>
					<span style={{ fontSize: '1rem', fontStyle: 'italic' }}>{date}</span>
					<div dangerouslySetInnerHTML={{ __html: html }}></div>
				</div>
			</article>
			<footer>
				<hr />
				<div>
					{
						prev && <Link to={prev.frontmatter.path}>
							⬅ Previous post
							</Link>
					}
					<span style={{ marginRight: '1rem' }}></span>
					{
						next && <Link to={next.frontmatter.path}>
							Next post ➡</Link>
					}
				</div>
			</footer>
		</PageLayout>
	)
}

export const query = graphql`
	query($pathSlug: String!) {
		markdownRemark(frontmatter: {path: {eq: $pathSlug}}) {
			html
			frontmatter {
				title
				date(formatString: "MMM DD, YYYY")
			}
  		}
	}
`

export default Template