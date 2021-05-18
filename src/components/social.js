import React from 'react'

const styles = {
  container: {
    display: 'block',
    marginRight: '1rem',
  },
  icon: {
    fontSize: '1.5rem',
  },
}

export default function Social({ link, icon, containerStyles }) {
  // instantiate icon from props - has to be capitalized
  const Icon = icon

  return (
    <div style={{ ...styles.container, ...containerStyles }}>
      <div style={styles.icon}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {Icon ? <Icon /> : ''}
        </a>
      </div>
    </div>
  )
}
