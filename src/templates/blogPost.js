import React from 'react'
import { graphql, Link } from 'gatsby'

const Template = (props) => {
	console.log(props)

	const { data, pageContext } = props
	const { markdownRemark } = data
	const { html, frontmatter } = markdownRemark
	const { title } = frontmatter

	const { next, prev } = pageContext

	return (
		<div>
			<h1>{title}</h1>
			<div>
				<div dangerouslySetInnerHTML={{ __html: html }}></div>
			</div>
			<hr />
			<div>
				{
					prev && <Link to={prev.frontmatter.path}>⏮Prev</Link>
				}
				<span style={{ margin: '0 5px' }}></span>
				{
					next && <Link to={next.frontmatter.path}>Next ⏭</Link>
				}
			</div>
		</div>
	)
}

export const query = graphql`
	query($pathSlug: String!) {
		markdownRemark(frontmatter: {path: {eq: $pathSlug}}) {
			html
			frontmatter {
				title
			}
  		}
	}
`

export default Template