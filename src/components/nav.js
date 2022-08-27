import React, { useState } from 'react'
import styled from 'styled-components'

import { FiMenu } from 'react-icons/fi'
import { GrClose } from 'react-icons/gr'
import ListLink from './link'
import ThemeSwitch from './themeSwitch'

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Projects', path: '/projects' },
  // { name: 'Workshops', path: '/workshops' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const NavStyled = styled.nav`
  display: flex;
  flex-direction: column;

  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* flex-wrap: wrap; */
    margin: 0;
    padding: 0;
  }

  ul li {
    margin-right: 0.75rem;
  }

  .menu {
    display: none;
    cursor: pointer;
    font-size: 1.5rem;
  }

  .close {
    display: none;
    cursor: pointer;
    font-size: 1.5rem;

    margin: 2rem;
  }

  @media screen and (max-width: 750px) {
    ul li {
      display: none;

      margin-right: 0;
    }

    .menu {
      display: block;
    }

    // use & to target all instances of nav
    &.responsive {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      /* background: rgba(255, 255, 255, 0.9); */
      background: rgba(255, 255, 255);
    }

    &.responsive ul {
      flex-direction: column;

      li {
        display: block;

        font-size: 1.5rem;
        margin-bottom: 0.75rem;
      }
    }

    &.responsive .menu {
      display: none;
    }

    &.responsive .close {
      display: block;
      align-self: flex-end;
    }

    &.responsive::before {
      display: block;
    }
  }
`

function Nav() {
  const [showMobileNav, toggleMobileNav] = useState(false)

  const closeMobileNav = () => toggleMobileNav(false)
  const openMobileNav = () => toggleMobileNav(true)

  return (
    <NavStyled className={showMobileNav ? 'responsive' : ''}>
      {showMobileNav && <GrClose className="close" onClick={closeMobileNav} />}
      {!showMobileNav && <FiMenu className="menu" onClick={openMobileNav} />}
      <ul>
        {pages.map((page) => (
          <ListLink key={page.name} to={page.path}>
            {page.name}
          </ListLink>
        ))}
        <li>
          <ThemeSwitch />
        </li>
      </ul>
    </NavStyled>
  )
}

export default Nav
