import React from 'react'
import { Link } from 'gatsby'

const styles = {
	tagsContainer: {
		display: 'flex',
		listStyle: 'none'
	},
	tag: {
		margin: '0 5px',
		border: '1px solid gray',
		padding: '10px',
		backgroundColor: 'white',
		borderRadius: '5px'
	}
}

const TagsTemplate = (props) => {
	console.log(props)

	const { pageContext } = props
	const { tags } = pageContext

	return (
		<div>
			<h1>Tags</h1>
			< hr />
			<ul style={styles.tagsContainer}>
				{
					tags.map(tag =>
						<li key={tag} style={styles.tag}>
							<Link to={`tags/${tag}`}>
								{tag}
							</Link>
						</li>)
				}
			</ul>

		</div>
	)
}

export default TagsTemplate