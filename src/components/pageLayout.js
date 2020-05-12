import React from 'react'
import { Link } from 'gatsby'

const styles = {
	body: {
		margin: `0 auto`,
		// padding: `0 3rem`,

		// ### responsive ###
		// maxWidth: '600px',
		padding: `0 7vw`, // 7vw ~ 3rem(*16px) ~ 63px
		maxWidth: '80%'
	},
	header: {
		// marginBottom: `1.5rem`,
		marginTop: `1.5rem`,
		display: 'flex',
		flexDirection: 'row',
		// alignItems: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	nav: {
		listStyle: 'none',
		display: 'flex',
		flexDirection: 'row',
		// alignItems: 'center',
		flexWrap: 'wrap',
		margin: '0'
	}
}

const pages = [
	{ 'name': 'Home', path: '/' },
	{ 'name': 'Blog', path: '/blog' },
	{ 'name': 'About', path: '/about' },
	{ 'name': 'Contact', path: '/contact' },
]

const ListLink = ({ to, style, children }) => {
	return <li style={{
		marginRight: `1rem`,
		...style
	}}>
		<Link to={to}>{children}</Link>
	</li>
}

const Nav = (props) => {
	return (
		<ul style={styles.nav}>
			{pages.map(page =>
				<ListLink to={page.path}>
					{page.name}
				</ListLink>)}
		</ul>
	)
}


export default function PageLayout({ children }) {
	return (
		<div style={styles.body}>
			<header style={styles.header}>
				<Link style={{ textShadow: 'none', backgroundImage: 'none' }}>
					<h2>lennythedev</h2>
				</Link>
				<Nav />
			</header>
			<main>
				{children}
			</main>
		</div >
	)
}
