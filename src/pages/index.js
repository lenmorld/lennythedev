import React from "react"
import { Link } from "gatsby"
import Header from "../components/header"

export default function Home() {
	return (<div style={{ color: `purple`, fontSize: `72px` }}>
		<nav>
			<Link to="/contact">Contact</Link>
		</nav>
		<Header title="lennythedev" />
		<img src="https://source.unsplash.com/86b0GW7aLUw/400x200" alt="" />
	</div>)
}

