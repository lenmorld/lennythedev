import React from 'react'

import BlogHeader from '../components/blog_header'

function BlogList({ edges }) {
	return edges.map(edge => {
		return (<div key={edge.node.frontmatter.path}>
			{/* <div>{edge.node.frontmatter.date}</div> */}
			<h3>{edge.node.frontmatter.title}</h3>
		</div>)
	})
}

function BlogLayout({ data }) {
	// console.log(props)
	return <div>
		<BlogHeader />
		<BlogList edges={data.allMarkdownRemark.edges} />
	</div>
}

export const query = graphql`
	query BlogListQuery {
		allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}) {
			edges {
				node {
					frontmatter {
						title
						path
						date
					}
				}
			}
  		}
	}
`

export default BlogLayout