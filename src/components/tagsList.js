import React from 'react'

import { Link } from 'gatsby'

const styles = {
	tagsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginBottom: '1rem',
		// listStyle: 'none',
		flexWrap: 'wrap'
	},
	tag: {
		margin: '0.25rem 0.5rem 0.25rem 0',
		border: '1px solid gray',
		padding: '10px',
		backgroundColor: 'white',
		borderRadius: '5px'
	}
}

const TagsList = ({ tags }) => (

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
)

export default TagsList