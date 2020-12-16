import React from 'react'
import { FaExternalLinkSquareAlt, FaGithubSquare } from 'react-icons/fa'
import { Remarkable } from 'remarkable'

import PageLayout from '../components/pageLayout'

import projects from '../../projectsData'

const markdown = new Remarkable()

const styles = {
  grid: {
    display: 'grid',
    columnGap: '4rem',
    rowGap: '1rem',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    // grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

    // display: "flex",
    // flexDirection: "row",
    // flexWrap: "wrap",
  },
  card: {
    flexBasis: '500px',
  },
  tag: {
    marginRight: '5px',
    // border: "1px solid gray",
    padding: '3px 5px',
    fontSize: '0.75rem',
    borderRadius: '2px',
    // color: "#1d048d",
    // backgroundColor: "white",
    color: 'white',
    backgroundColor: '#1d048d',
  },
  img: {
    marginBottom: '0.75rem',
    border: '1px solid lightgray',
  },
}

// TODO: DRY it up with TagsList
const Tag = ({ tag }) => {
  return <div style={styles.tag}>{tag}</div>
}

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
      }}
    >
      {liveLink && (
        <div>
          <a href={liveLink} rel="noopener noreferrer" target="_blank">
            <FaExternalLinkSquareAlt style={{ verticalAlign: 'middle' }} />
            &nbsp;
            <span>Visit site</span>
          </a>
        </div>
      )}
      {githubLink && (
        <div>
          <a href={githubLink} rel="noopener noreferrer" target="_blank">
            <FaGithubSquare style={{ verticalAlign: 'middle' }} />
            &nbsp;
            <span>Github</span>
          </a>
        </div>
      )}
    </div>

    <a
      href={liveLink || githubLink || otherLink || '#'}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img src={imageLink} alt={name} style={styles.img} />
    </a>

    {/* tags */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.75rem',
      }}
    >
      {tags.map((tag) => (
        <Tag tag={tag} />
      ))}
    </div>
    <p dangerouslySetInnerHTML={{ __html: markdown.render(description) }} />
  </div>
)

export default function Projects() {
  return (
    <PageLayout>
      <h1>Open source contributions</h1>
      <h1>Projects</h1>
      <div style={styles.grid}>
        {projects.map((proj) => (
          <Project key={proj.id} project={proj} />
        ))}
      </div>
    </PageLayout>
  )
}
