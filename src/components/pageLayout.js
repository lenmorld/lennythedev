import React from 'react'
import { Link } from 'gatsby'

const styles = {
	body: {
		margin: `0 auto`,
		padding: `0 2rem`,
		maxWidth: 600
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
		marginRight: `1rem`, ...style
	}}>
		<Link to={to}>{children}</Link>
	</li>
}

const Nav = (props) => {
	return (
		<ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
			<header style={{ marginBottom: `1.5rem`, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
