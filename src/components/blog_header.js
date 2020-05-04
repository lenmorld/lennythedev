import React from "react"
import { StaticQuery, graphql } from 'gatsby'

const styles = {
	header: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		borderBottom: '1px solid gray'
	}
}

const Header = ({ data }) => {
	const { title, description } = data.site.siteMetadata;
	return <div style={styles.header}>
		<h1>{title}</h1>
		<p>{description}</p>
	</div>
}


const BlogHeader = () => {
	return <StaticQuery
		query={graphql`
			query {
				site {
					siteMetadata {
						title
						description
					}
				}
			}
		`}
		render={data => <Header data={data} />}
	/>
}

export default BlogHeader

