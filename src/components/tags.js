import React from 'react'

import PageLayout from "../components/pageLayout"

import TagsList from "./tagsList"

const TagsTemplate = (props) => {
	console.log(props)

	const { pageContext } = props
	const { tags } = pageContext

	return (
		<PageLayout>
			<h1>Tags</h1>
			<TagsList tags={tags} />
		</PageLayout>
	)
}

export default TagsTemplate