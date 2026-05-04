/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from 'react-bootstrap';
import { signIn } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

const PretextBackground = dynamic(() => import('./PretextBackground'), { ssr: false });

function Signin() {
  const { signInAsGuest } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
      }}
    >
      <PretextBackground />
      <div
        className="glass-card text-center"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '48px 36px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src="/thinkthrive.png"
          alt="ThinkThrive Logo"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            marginBottom: '24px',
          }}
        />
        <h1 style={{ fontWeight: '700', fontSize: '1.8rem', marginBottom: '8px' }}>
          Welcome to ThinkThrive
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', marginBottom: '4px' }}>
          Your AI-powered learning companion
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '36px' }}>
          Made by Frank Campos
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            className="glass-btn"
            size="lg"
            onClick={signIn}
            style={{ width: '100%' }}
          >
            Sign In with Google
          </Button>
          <Button
            className="glass-btn-outline"
            size="lg"
            onClick={signInAsGuest}
            style={{ width: '100%' }}
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
