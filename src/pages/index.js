import React from 'react'

import PageLayout from '../components/pageLayout'

const SafeLink = ({ name, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    {name}
  </a>
)

export default function Home() {
  return (
    <PageLayout>
      {/* <img src="https://source.unsplash.com/86b0GW7aLUw/400x200" alt="" /> */}
      <h1>👋 Hey there, I'm Lenny 🤓</h1>
      <br />
      <p>
        👨🏽‍💻 Full-stack web developer. Lifelong learner. Currently into anything
        web: UI, backend and everything in between. 💻
      </p>

      <p>
        When I'm not on my day job 👨🏽‍💼 at AppDirect helping democratize
        businesses tools with a subscription commerce platform, I prepare
        workshop material 👨🏽‍🏫, write articles on my{' '}
        <SafeLink name="blog" link="/blog" /> and on{' '}
        <SafeLink name="DEV" link="https://dev.to/lenmorld" />
        ✍🏽, and work on personal projects 🗂, occasionally on a coffee shop 😄.
      </p>

      <p>
        Check out my contributions to open-source projects on{' '}
        <a href="https://github.com/lenmorld">Github</a> and my regular (mostly
        on-and-off 😅) learnings on{' '}
        <SafeLink name="Twitter" link="https://twitter.com/lennythedev2" />.
      </p>
      <p>
        By the way, I'm also a mentor 🧑🏽‍💼. Reach out via one of my socials 👇🏽
        if you're interested.
      </p>

      <p>
        I'm currently learning (context-switching 😏) between React, Node,
        GraphQL, vanilla JS + HTML + CSS 📚
      </p>

      <p>
        When I'm not coding (or reading about coding 📖), you can find me
        playing basketball 🏀 (missing a wide-open shot), gaming basketball (NBA
        2k) 🎮, guitar-ing 🎸 (taking forever to learn a song and eventually
        forgetting it), and swimming 🏊🏽‍♂️ (can hardly do a lap). 😁
      </p>

      <p>
        I believe that it's all about the journey 🚗, not the destination ⛰.
        There are no limits to knowledge and our potential, so better cherish
        the learning 😊. I'd love for you to follow my journey as I carve my own
        path 🛣, but I'd love it even more to know about yours 🏆. Say hi and
        don't be a stranger! 👇🏽
      </p>

      <p>
        ...and yes, I love emojis 😆 😎 and over-priced coffee ☕️ because I'm a
        millenial 😂.
      </p>
    </PageLayout>
  )
}
