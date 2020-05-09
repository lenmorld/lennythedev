import React from 'react'
import { Link } from 'gatsby'

import PageLayout from "../components/pageLayout"

const styles = {
	tagsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		// listStyle: 'none',
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
		<PageLayout>
			<h1>Tags</h1>
			<div style={styles.tagsContainer}>
				{
					tags.map(tag =>
						<span key={tag} style={styles.tag}>
							<Link to={`tags/${tag}`}>
								{tag}
							</Link>
						</span>)
				}
			</div>
		</PageLayout>
	)
}

export default TagsTemplate