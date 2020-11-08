import React from "react";
import { graphql, Link } from "gatsby";

import PageLayout from "./pageLayout";

import TagsList from "../components/tagsList";

const Template = (props) => {
  console.log(props);

  const { data, pageContext } = props;
  const { markdownRemark } = data;
  const { html, frontmatter } = markdownRemark;
  const { title, date, tags, description } = frontmatter;

  const { next, prev } = pageContext;

  // h1 style={{ fontSize: "2rem", color: "#1d048d", margin: "1.25rem auto" }}

  return (
    <PageLayout>
      <article>
        <h1>
          {title}
        </h1>
        <div>
          <div style={{ marginBottom: "0.5rem" }}>
            <b>{description}</b>
          </div>
          <span style={{ fontSize: "1rem", fontStyle: "italic" }}>{date}</span>
          <TagsList tags={tags} />
          <hr />
          <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
      </article>
      <div style={{ marginTop: "3rem", marginBottom: "1rem" }}>
        {prev && <Link to={prev.frontmatter.path}>⬅ Previous post</Link>}
        {next && prev && <span style={{ marginRight: "1rem" }}></span>}
        {next && <Link to={next.frontmatter.path}>Next post ➡</Link>}
      </div>
    </PageLayout>
  );
};

export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: { eq: $pathSlug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
        tags
        description
      }
    }
  }
`;

export default Template;
