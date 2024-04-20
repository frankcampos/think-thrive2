/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import { Button } from 'react-bootstrap';
import { signIn } from '../utils/auth';
import { useAuth } from '../utils/context/authContext'; // import useAuth hook

function Signin() {
  const { signInAsGuest } = useAuth(); // get signInAsGuest from auth context

  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
        color: 'white',
      }}
    >
      <img src="/thinkthrive.png" alt="Logo" />
      <h1>Welcome to ThinkThrive</h1>
      <p>Our app is a platform designed to enhance your learning experience. Click the button below to get started!</p>
      <p>Made by Frank Campos</p>
      <Button type="button" size="lg" className="copy-btn" onClick={signIn} style={{ marginBottom: '10px' }}>
        Sign In
      </Button>
      <Button type="button" size="lg" className="copy-btn" onClick={signInAsGuest}>
        Continue as Guest
      </Button>
    </div>
  );
}

export default Signin;
