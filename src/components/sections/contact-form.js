import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
// import ReCAPTCHA from 'react-google-recaptcha';

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

  .input {
    width: 100%;
    padding: 14px;
    margin-bottom: 24px;
    border-radius: 5px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  .input-error {
    border: 2px solid #fd4646;
    animation: shake3 0.4s ease-in-out 0s 2;
  }

  .required {
    color: red;
  }

  .submit-button {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 32px;
    width: 100%;
  }

  @keyframes shake3 {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
`;

const ContactForm = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const initialInputs = {
    name: '',
    email: '',
    phone: '',
    title: '',
    message: '',
  };
  const [inputs, setInputs] = useState(initialInputs);

  const initialErrors = {
    name: false,
    email: false,
    phone: false,
    title: false,
    message: false,
  };
  const [errors, setErrors] = useState(initialErrors);
//   const [recaptchaValue, setRecaptchaValue] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const isEmailValid = email => email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

  const validate = (name, value) => {
    if (!value) {
      setErrors(errors => ({ ...errors, [name]: true }));
      return;
    }
    if (name === 'email') {
      if (!isEmailValid(value)) {
        setErrors(errors => ({ ...errors, [name]: true }));
        return;
      }
    }
    setErrors(errors => ({ ...errors, [name]: false }));
  };

  const isValidateAll = () => {
    const errors = {};
    let isValid = true;

    if (!inputs.name) {
      errors.name = true;
      isValid = false;
    }

    if (!inputs.email || !isEmailValid(inputs.email)) {
      errors.email = true;
      isValid = false;
    }

    if (!inputs.title) {
      errors.title = true;
      isValid = false;
    }

    if (!inputs.message) {
      errors.message = true;
      isValid = false;
    }

    setErrors(errors);

    return isValid;
  };

  const clearData = () => {
    setInputs({ ...initialInputs });
    setErrors({ ...initialErrors });
    // setRecaptchaValue(null);
  };

  const submitData = async () => {
    // const url = `${process.env.BASE_URL}/portfolio-contact`;
    const url = 'https://j2yempxlb9.execute-api.us-east-1.amazonaws.com/v1/portfolio-contact';
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs), 
    });

    if (response.ok) {
      alert('Thank you for your message. I will get back to you soon.');
      clearData();
    }   
  };

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
    validate(name, value);
  };

//   const handleRecaptchaChange = value => {
//     setRecaptchaValue(value);
//   };

  const handleSubmit = event => {
    event.preventDefault();

    // if (recaptchaValue === null) {
    //   return;
    // }

    setErrors({ ...initialErrors });
    setTimeout(() => {
      if (!isValidateAll()) {
        return;
      }
      submitData();
    }, 0);
  };

  return (
    <StyledFormSection id="contact-form" ref={revealContainer}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name<span className="required">*</span></label>
          <input className={errors.name ? 'input input-error' : 'input'} id="name" type="text" value={inputs.name}  name="name" placeholder="Enter your name"  onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="email">Email<span className="required">*</span></label>
          <input className={errors.email ? 'input input-error' : 'input'} id="email" type="text" value={inputs.email} name="email" placeholder="Enter your email"  onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input className="input" id="phone" type="text" value={inputs.phone} name="phone"  placeholder="Enter your phone"  onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="title">Title<span className="required">*</span></label>
          <input className={errors.title ? 'input input-error' : 'input'} id="title" type="text" value={inputs.title} name="title" placeholder="Enter your message title"  onChange={handleChange}></input>
        </div>
        <div>
          <label htmlFor="message">Message<span className="required">*</span></label>
          <textarea className={errors.message ? 'input input-error' : 'input'} id="message" rows={5} value={inputs.message} name="message" placeholder="Enter your message"  onChange={handleChange}></textarea>
        </div>
        <div >
          {/* <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY} onChange={handleRecaptchaChange} />
          { recaptchaValue !== null ? 
            <input className="submit-button" disabled={recaptchaValue === null} type="submit" value="Submit" />
            : <div/>
          } */}
          <input className="submit-button" type="submit" value="Submit" />
        </div>
      </form>
    </StyledFormSection>
  );
};

export default ContactForm;
