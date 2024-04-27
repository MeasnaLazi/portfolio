import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledFormSection = styled.div`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;
  padding-top: 50px;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  label {
    display: block;
    margin-bottom: 3px;
    font-size: 1.2rem;
    text-align: left;
  }

  input, textarea {
    width: 100%;
    padding: 14px;
    margin-bottom: 24px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  .required {
    color: red;
  }

  .submit-button {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 25px;
  }
`;

const ContactForm = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledFormSection id="contact-form" ref={revealContainer}>
      <form>
        <div>
          <label htmlFor="name">Name<span className="required">*</span></label>
          <input id="name" type="text" value="" name="name" placeholder="Enter your name"></input>
        </div>
        <div>
          <label htmlFor="email">Email<span className="required">*</span></label>
          <input id="email" type="text" value="" name="email" placeholder="Enter your email"></input>
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="text" value="" name="phone"  placeholder="Enter your phone"></input>
        </div>
        <div>
          <label htmlFor="title">Title<span className="required">*</span></label>
          <input id="title" type="text" value="" name="title" placeholder="Enter your message title"></input>
        </div>
        <div>
          <label htmlFor="message">Message<span className="required">*</span></label>
          <textarea id="message" rows={5} value="" name="message" placeholder="Enter your message"></textarea>
        </div>
        <div >
          <input className="submit-button" type="submit" value="Submit" />
        </div>
      </form>
    </StyledFormSection>
  );
};

export default ContactForm;
