import React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'

import { FaTwitter, FaDev, FaGithubAlt } from 'react-icons/fa'
import { FiCodesandbox } from 'react-icons/fi'

import { ThemeContext } from '../context/ThemeContext'
import ThemeSwitch from './themeSwitch'
import Social from './social'

const styles = {
  body: {},
  header: {
    marginTop: `1.5rem`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  heading: {
    margin: '1rem 2rem 0 0',
  },
  nav: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: '1rem 0 0 0',
  },
  theme: {
    margin: '1rem 0 0 0',
  },
  main: {
    // marginTop: '1.5rem',
    minHeight: '75vh',
  },
  footer: {
    borderTop: '1px solid gray',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
}

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Projects', path: '/projects' },
  // { name: 'Workshops', path: '/workshops' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const ListLink = ({ to, style, children }) => {
  return (
    <li
      style={{
        marginRight: `0.75rem`,
        fontSize: '1rem',
        ...style,
      }}
    >
      <Link to={to}>{children}</Link>
    </li>
  )
}

const Nav = () => {
  return (
    <ul style={styles.nav}>
      {pages.map((page) => (
        <ListLink key={page.name} to={page.path}>
          {page.name}
        </ListLink>
      ))}
    </ul>
  )
}

export default function PageLayout({
  children,
  metaPageImage = 'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1601847024/lennythedev/opengraph_image_lennythe__dev.png',
  metaPageUrl = 'https://lennythedev.com',
  metaPageName = 'Lennythedev Page',
  metaDescription = 'lennythedev page',
}) {
  return (
    <ThemeContext.Consumer>
      {(theme) => {
        const themeStyles = theme.isDark
          ? {
              backgroundColor: '#2a2b2d',
              color: 'white',
            }
          : {
              backgroundColor: 'white',
              color: '#2a2b2d',
            }

        return (
          <div style={{ ...styles.body, ...themeStyles }}>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Lenny the Dev</title>
              <link rel="canonical" href="https://lennythedev.com" />

              {/* OpenGraph data */}
              <meta property="og:title" content={metaPageName} />
              <meta property="og:url" content={metaPageUrl} />
              <meta property="og:type" content="website" />
              <meta property="og:image" content={metaPageImage} />
              <meta property="og:site_name" content="lennythedev" />
              <meta property="og:locale" content="en_CA" />
              <meta property="og:description" content={metaDescription} />
            </Helmet>

            {/* <h1 style={{ color: 'var(--color-primary)' }}>HAHAHA</h1> */}

            <header style={styles.header}>
              <h3 style={styles.heading}>
                <Link to="/">lennythedev</Link>
              </h3>
              <Nav />
              <div style={styles.theme}>
                <ThemeSwitch />
              </div>
            </header>
            <main style={styles.main}>{children}</main>
            <footer style={styles.footer}>
              <Social
                link="https://twitter.com/lennythedev2"
                name="Twitter"
                icon={FaTwitter}
              />
              <Social
                link="https://codesandbox.io/dashboard/recent"
                name="Codesandbox"
                icon={FiCodesandbox}
              />
              <Social link="https://dev.to/lenmorld" name="DEV" icon={FaDev} />
              <Social
                link="https://github.com/lenmorld"
                name="Github"
                icon={FaGithubAlt}
              />
            </footer>
          </div>
        )
      }}
    </ThemeContext.Consumer>
  )
}
