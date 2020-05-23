import React from "react"
import { Link } from "gatsby"

import PageLayout from "../components/pageLayout"

export default function Home() {
  return (
    <PageLayout>
      {/* <img src="https://source.unsplash.com/86b0GW7aLUw/400x200" alt="" /> */}
      <h1>👋 Hey, I'm Lenny</h1>
      <p>
        👨🏽‍💻 Full-stack web developer. Lifelong learner. Currently into anything web: UI, backend and everything in between. 💻
      </p>

      <p>
        When I'm not on my day job 👨🏽‍💼 at Autodesk helping people <i>make anything</i> through software, I prepare workshop material 👨🏽‍🏫, and write articles on this site and on <a href="https://dev.to/lenmorld">dev.to</a> ✍🏽. I'm also doing (on-and-off-ing 😅) the <a href="https://twitter.com/lenmorld">#100daysOfCode</a>. Lastly, I'm also a mentor. Reach out via one of my socials 👇🏽 if you're interested.
      </p>

      <p>
        My present choice of (context-switch 😏) learning: React, vanilla JS + HTML + CSS, Rails, and Node
      </p>

      <p>
        When I'm not coding (or reading about coding 📚), you can find me playing basketball 🏀 (missing a wide-open shot), guitar-ing 🎸 (taking forever to learn a chord), and swimming 🏊🏽‍♂️ (can hardly do a lap). 
        Did I mention I'm still learning to do them? I probably love these things more than they love me back, but I love the learning part so it's all good 😁
      </p>
    </PageLayout>
  )
}
