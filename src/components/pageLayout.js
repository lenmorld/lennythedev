import React from 'react'
import { Link } from 'gatsby'

const styles = {
	body: {
		margin: `0 auto`,
		// padding: `0 3rem`,

		// ### responsive ###
		// maxWidth: '600px',
		// padding: `0 7vw`, // 7vw ~ 3rem(*16px) ~ 63px
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
	{ 'name': 'Projects', path: '/projects' },
	{ 'name': 'About', path: '/about' },
	{ 'name': 'Contact', path: '/contact' },
]

const ListLink = ({ to, style, children }) => {
	return <li style={{
		marginRight: `1rem`,
		fontSize: '1rem',
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

function Social({link, name, icon}) {
	return <div style={{ marginRight: '1rem', fontSize: '1rem' }}>
		<a href={link}>{name} {icon}</a>
	</div>
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
			<hr />
			<footer style={{ paddingBottom: '1rem', display: 'flex', justifyContent: 'flexStart', flexWrap: 'wrap'}}>
				<Social link="https://twitter.com/lenmorld" name="Twitter" icon="🐥" />
				<Social link="https://dev.to/lenmorld" name="DEV" icon="👨🏽‍💻" />
				<Social link="https://ca.linkedin.com/in/lenmorld" name="LinkedIn" icon="👨🏽‍💼" />
				<Social link="https://codesandbox.io/dashboard/recent" name="Codesandbox" icon="💻" />
			</footer>
		</div >
	)
}
