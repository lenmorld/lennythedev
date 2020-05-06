import React from 'react'
import { Link } from 'gatsby'

const styles = {
	listContainer: {
		display: 'flex',
		listStyle: 'none'
	},
}

const TagsTemplate = (props) => {
	const { pageContext } = props
	// console.log(pageContext)

	const { posts, tagName } = pageContext

	return (
		<div>
			<h1>Posts about {tagName}</h1>
			<hr />
			<ul style={styles.listContainer}>
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
			</ul>
		</div>
	)
}

export default TagsTemplate