import React from "react"
import { FaExternalLinkSquareAlt, FaGithubSquare } from "react-icons/fa"
import PageLayout from "../components/pageLayout"

const styles = {
  grid: {
    display: "grid",
    columnGap: "4rem",
    rowGap: "1rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    // grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

    // display: "flex",
    // flexDirection: "row",
    // flexWrap: "wrap",
  },
  card: {
    flexBasis: "500px",
  },
  tag: {
    marginRight: "5px",
    // border: "1px solid gray",
    padding: "3px 5px",
    fontSize: "0.75rem",
    borderRadius: "2px",
    // color: "#1d048d",
    // backgroundColor: "white",
    color: "white",
    backgroundColor: "#1d048d",
  },
  img: {
    marginBottom: "0.75rem",
  },
}

// TODO: DRY it up with TagsList
const Tag = ({ tag }) => {
  return <div style={styles.tag}>{tag}</div>
}

const projects = [
  {
    id: "projecty1",
    name: "Projecty1",
    liveLink: "https://lennythedev.com",
    githubLink: "https://github.com/lenmorld",
    imageLink:
      "https://res.cloudinary.com/dvfhgkkpe/image/upload/v1603799558/react_workshop_slides/2.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis magna vel mauris venenatis, id imperdiet justo pharetra. Morbi id volutpat ipsum, sit amet fringilla nisl. Suspendisse suscipit nec turpis nec placerat. Curabitur vulputate, velit id fringilla accumsan, velit urna interdum justo, in porta tortor neque luctus eros. Curabitur id dictum sem.",
    tags: ["css", "html"],
  },
  {
    id: "projecty2",
    name: "Projecty2",
    liveLink: "lennythedev.com",
    githubLink: "https://github.com/lenmorld",
    imageLink:
      "https://res.cloudinary.com/dvfhgkkpe/image/upload/v1603799558/react_workshop_slides/2.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis magna vel mauris venenatis, id imperdiet justo pharetra. Morbi id volutpat ipsum, sit amet fringilla nisl. Suspendisse suscipit nec turpis nec placerat. Curabitur vulputate, velit id fringilla accumsan, velit urna interdum justo, in porta tortor neque luctus eros. Curabitur id dictum sem.",
    tags: ["react", "gatsby", "vanilla"],
  },
  {
    id: "projecty3",
    name: "Projecty2",
    liveLink: "lennythedev.com",
    githubLink: "https://github.com/lenmorld",
    imageLink:
      "https://res.cloudinary.com/dvfhgkkpe/image/upload/v1603799558/react_workshop_slides/2.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis magna vel mauris venenatis, id imperdiet justo pharetra. Morbi id volutpat ipsum, sit amet fringilla nisl. Suspendisse suscipit nec turpis nec placerat. Curabitur vulputate, velit id fringilla accumsan, velit urna interdum justo, in porta tortor neque luctus eros. Curabitur id dictum sem.",
    tags: ["react", "gatsby"],
  },
]

const Project = ({
  project: {
    name,
    liveLink,
    githubLink,
    imageLink,
    otherLink,
    description,
    tags,
  },
}) => (
  <div style={styles.card}>
    <h2>{name}</h2>
    {/* Links */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.75rem",
      }}
    >
      {liveLink && (
        <div>
          <a href={liveLink}>
            <FaExternalLinkSquareAlt style={{ verticalAlign: "middle" }} />
            &nbsp;
            <span>Visit site</span>
          </a>
        </div>
      )}
      {githubLink && (
        <div>
          <a href={githubLink}>
            <FaGithubSquare style={{ verticalAlign: "middle" }} />
            &nbsp;
            <span>Github</span>
          </a>
        </div>
      )}
    </div>

    <a href={liveLink || githubLink || otherLink || "#"}>
      <img src={imageLink} alt={name} style={styles.img} />
    </a>

    {/* tags */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "0.75rem",
      }}
    >
      {tags.map((tag) => (
        <Tag tag={tag} />
      ))}
    </div>
    <p>{description}</p>
  </div>
)

export default function Projects() {
  return (
    <PageLayout>
      <h1>Projects</h1>
      <div style={styles.grid}>
        {projects.map((proj) => (
          <Project key={proj.id} project={proj} />
        ))}
      </div>
    </PageLayout>
  )
}
