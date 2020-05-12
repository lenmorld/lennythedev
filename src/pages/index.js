import React from "react"
import { Link } from "gatsby"

import PageLayout from "../components/pageLayout"

export default function Home() {
  return (
    <PageLayout>
      {/* <img src="https://source.unsplash.com/86b0GW7aLUw/400x200" alt="" /> */}
      <h1>👋 Hi, I'm Lenny</h1>
      <p>
        👨🏽‍💻 I'm a full-stack web developer. I love to learn anything web: UI, backend and everything in between.
      </p>

      <p>
        When I'm not on my day job at Autodesk helping people <i>make anything</i> through software, I write workshop material and articles in this blog and at <a href="https://dev.to/lenmorld">DEV</a>. I'm also currently participating in <a href="https://twitter.com/lenmorld">#100daysOfCode</a>.
      </p>

      <p>
        My current focus of learning (but mostly context-switching 😅): React, Rails, and Node
      </p>

      <p>
        When I'm not coding, you can find me doing/learning any of these activities as emojis. Often though, they don't like me as much as I like them 😁
      </p>
      <p>
        🏊🏽‍♂️ 🏀 🎸
      </p>
    </PageLayout>
  )
}
