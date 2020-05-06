import React from 'react'
import { Link } from 'gatsby'

import BlogHeader from '../components/blog_header'

const styles = {
	blogTitleLink: {
		fontSize: '20px',
		margin: '10px auto',
		fontWeight: 'bold'
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
}

// TODO: also put a preview here
function BlogList({ edges }) {
	return edges.map(edge => {
		const { frontmatter } = edge.node
		const { date, path, title } = frontmatter

		return (<div key={path}>
			<div style={styles.blogTitleLink}>
				<Link to={path}>{title}</Link>
			</div>
		</div>)
	})
}

function BlogLayout({ data }) {
	// console.log(props)
	return <div>
		<BlogHeader />
		<div style={styles.container}>
			<BlogList edges={data.allMarkdownRemark.edges} />
			<hr />
			<div>
				<Link to={`/tags`}>Browse by Tag</Link>
			</div>
		</div>
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