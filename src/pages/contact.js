import React from 'react'

import { FaTwitter } from 'react-icons/fa'
import Social from '../components/social'

// import Header from "../components/header"

import PageLayout from '../components/pageLayout'

export default function Contact() {
  return (
    <PageLayout>
      <h1>Contact</h1>
      <p>
        <span>Send me a message on </span>
        <span>
          <Social
            link="https://twitter.com/lennythedev2"
            name="Twitter"
            icon={FaTwitter}
            containerStyles={{ display: 'inline-block', marginLeft: '0.5rem' }}
          />
        </span>
      </p>
    </PageLayout>
  )
}
