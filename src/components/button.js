import React from 'react'

const defaultStyles = {

}

// TODO: useMemo or something for styles
// and write about it
export default function Button({ children, styles }) {
	return (
		<button style={{ defaultStyles, ...styles }}>
			{children}
		</button>
	)
}