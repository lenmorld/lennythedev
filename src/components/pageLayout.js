import React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'

import { FaTwitter, FaDev, FaGithubAlt } from 'react-icons/fa'
import { FiCodesandbox } from 'react-icons/fi'
import Social from './social'
import Nav from './nav'

const styles = {
  body: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // other styles in global.css header {}
  },
  left: {
    marginBottom: '1rem',
  },
  heading: {
    margin: 0,
  },
  right: {
    display: 'flex',
    marginBottom: '1rem',
  },
  main: {
    // marginTop: '1.5rem',
    // minHeight: '75vh',
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

export default function PageLayout({
  children,
  metaPageImage = 'https://res.cloudinary.com/dvfhgkkpe/image/upload/v1601847024/lennythedev/opengraph_image_lennythe__dev.png',
  metaPageUrl = 'https://lennythedev.com',
  metaPageName = 'Lennythedev Page',
  metaDescription = 'lennythedev page',
}) {
  return (
    <div className="page" style={styles.body}>
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

      <header>
        <div className="left" style={styles.left}>
          <h3 style={styles.heading}>
            <Link to="/">lennythedev</Link>
          </h3>
        </div>
        <div style={styles.right}>
          <Nav />
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
}
