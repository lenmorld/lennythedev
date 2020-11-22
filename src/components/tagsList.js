import React from 'react'

import { Link } from 'gatsby'

const styles = {
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '1rem',
    marginTop: '1rem',
    // listStyle: 'none',
    flexWrap: 'wrap',
  },
  tag: {
    margin: '0.25rem 0.5rem 0.25rem 0',
    border: '1px solid gray',
    padding: '10px',
    borderRadius: '5px',
    // backgroundColor: "white",
    // color: "#1d048d",
    // color: "white",
    // backgroundColor: "#1d048d",
  },
  link: {
    // color: "white",
    textShadow: 'none',
  },
}

const Tag = ({ link, name }) => (
  <div style={styles.tag} className="tag">
    <Link to={link} style={styles.link}>
      {name}
    </Link>
  </div>
)

const TagsList = ({ tags }) => (
  <div style={styles.tagsContainer}>
    {tags.map((tag) => (
      <Tag link={`tags/${tag}`} name={tag} key={tag} />
    ))}
  </div>
)

export default TagsList
