import React, { useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const StyledBookSection = styled.div`
  .div-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .view-all {
    width: 75px;
    text-align: center;
    margin-top: 10px;
  }
`;

const Book = () => {
  const data = useStaticQuery(graphql`
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
  `);

  const books = data.book.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealViewAll = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealViewAll.current, srConfig());
    
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };

  return (
    <StyledBookSection>
      <section id="book">
        <div className='div-section'>
          <h2 className="numbered-heading" ref={revealTitle}>
                Some Books I’ve Read
          </h2>
          <Link className="inline-link archive-link view-all" to="/book" ref={revealViewAll}>
            View All
          </Link>
        </div>
        <Carousel
          swipeable={false}
          draggable={false}
          responsive={responsive}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={200}
          containerClass="carousel-container"
        >
          {books &&
            books.map(({ node }, i) => {
              const { frontmatter } = node;
              return <BookItem key={i} book={frontmatter} />;
            })
          }
        </Carousel>
      </section>
    </StyledBookSection>
  );
};

const BookItem = prop => {
  const StyledBookItem = styled.div`
    padding-right: 10px ;
    padding-left: 10px;
    `;
  const { title, cover, link } = prop.book;
  const image = getImage(cover);

  return (<StyledBookItem >
    <a href={link} target="_blank" rel="noopener noreferrer">
      <GatsbyImage image={image} alt={title} />
    </a>
  </StyledBookItem>);
};

export default Book;
