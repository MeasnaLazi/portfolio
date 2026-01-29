import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;

    a {
      &:hover,
      &:focus {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>⚡</text></svg>")
            20 0,
          auto;
      }
    }
  }

  footer {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-top: 20px;
  }
`;

const StyledGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 15px;
  margin-top: 50px;
  position: relative;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;
const StyledPost = styled.li`
  transition: var(--transition);
  cursor: default;

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .post__inner {
        transform: translateY(-7px);
      }
    }
  }
`;

const BookPage = ({ location, data }) => {
  const books = data.book.edges.filter(({ node }) => node);

  return (
    <Layout location={location}>
      <Helmet title="Library" />

      <StyledMainContainer>
        <header>
          <h1 className="big-heading">Library</h1>
          <p className="subtitle">
            <p>
              a collection of books, I have read.
            </p>
          </p>
        </header>

        <StyledGrid>
          {books.length > 0 &&
            books.map(({ node }, i) => {
              const { frontmatter } = node;

              return (
                <StyledPost key={i}>
                  <BookItem book={frontmatter} />
                </StyledPost>
              );
            })}
        </StyledGrid>
      </StyledMainContainer>
    </Layout>
  );
};

BookPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default BookPage;

export const pageQuery = graphql`
  {
      book: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/book/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              author
              category
              cover {
                childImageSharp {
                  gatsbyImageData(height: 300, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF], aspectRatio:0.775)
                }
              }
              link
            }
          }
        }
      }
    }
`;

const BookItem = prop => {
  const StyledBookItem = styled.div`
      padding-right: 10px ;
      padding-left: 10px;
      text-align: center;
      `;
  const { title, cover, link } = prop.book;
  const image = getImage(cover);
  
  return (<StyledBookItem >
    <a href={link} target="_blank" rel="noopener noreferrer">
      <GatsbyImage image={image} alt={title} />
    </a>
  </StyledBookItem>);
};
