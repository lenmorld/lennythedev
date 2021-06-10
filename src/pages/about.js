import React from 'react'
import PageLayout from '../components/pageLayout'

export default function About() {
  return (
    <PageLayout>
      <h1>About me</h1>
      <div>
        <ul>
          <li>I like going to high places that has a nice view</li>
          <li>I believe that kindness is more powerful than skill</li>
          <li>I believe that self-care is essential to progress</li>
          <li>
            I used to be a technician, repairing PCs and installing routers
          </li>
          <li>I switched from electronics to networks to web dev</li>
          <li>I like making lists...</li>
          <li>...and forgetting about them</li>
        </ul>
      </div>
      <img
        src="https://res.cloudinary.com/dvfhgkkpe/image/upload/c_scale,w_353/v1590186732/lennythedev/lenny_mountain.jpg"
        alt=""
      />
    </PageLayout>
  )
}
