import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { navDelay } from '@utils';
import { Layout } from '@components';
import { usePrefersReducedMotion } from '@hooks';
import { graphql } from 'gatsby';

const StyledMainContainer = styled.main`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
`;

const StyledContent = styled.div`
  width: 100%;
  max-width: 800px;

  h1 {
    font-size: clamp(30px, 5vw, 50px);
    font-weight: 400;
    padding-top: 150px;
    margin-bottom: 40px;
    text-align: center;
  }

  h2 {
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 15px;
    line-height: 1.6;
  }

  ul {
    padding-left: 20px;
    margin-bottom: 20px;

    li {
      margin-bottom: 10px;
    }
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }
`;

const BioPrivacy = ({ data, location }) => {
    const [isMounted, setIsMounted] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReducedMotion) {
            return;
        }

        const timeout = setTimeout(() => setIsMounted(true), navDelay);
        return () => clearTimeout(timeout);
    }, []);

    const { html, frontmatter } = data.markdownRemark;
    const { title } = frontmatter;

    const content = (
        <StyledMainContainer className="fillHeight">
            <StyledContent dangerouslySetInnerHTML={{ __html: html }} />
        </StyledMainContainer>
    );

    return (
        <Layout location={location}>
            <Helmet title={title} />

            {prefersReducedMotion ? (
                <>{content}</>
            ) : (
                <TransitionGroup component={null}>
                    {isMounted && (
                        <CSSTransition timeout={500} classNames="fadeup">
                            {content}
                        </CSSTransition>
                    )}
                </TransitionGroup>
            )}
        </Layout>
    );
};

BioPrivacy.propTypes = {
    data: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default BioPrivacy;

export const query = graphql`
  query {
    markdownRemark(frontmatter: { slug: { eq: "/bio-privacy" } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
