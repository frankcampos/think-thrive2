/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const features = [
  {
    icon: '🗺️',
    title: 'Create Learning Paths',
    desc: 'Organize any topic into a structured path with a goal and cover image.',
  },
  {
    icon: '🧠',
    title: 'Build Knowledge Cards',
    desc: 'Add Conceptual cards (Q&A) and Procedural cards (step-by-step tasks).',
  },
  {
    icon: '🤖',
    title: 'Review with AI',
    desc: 'Get AI-powered feedback on your answers to deepen your understanding.',
  },
];

export default function WelcomeScreen({ onDone }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}
    >
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>

        {/* Logo + name */}
        <div style={{ marginBottom: '24px' }}>
          <img
            src="/thinkthrive.png"
            alt="ThinkThrive"
            style={{
              width: '72px', height: '72px', borderRadius: '16px', marginBottom: '16px',
            }}
          />
          <h1 style={{
            fontWeight: '800', fontSize: '2rem', color: 'white', marginBottom: '8px',
          }}
          >
            Welcome to ThinkThrive
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem' }}>
            Learn smarter with neuroscience-based learning paths
          </p>
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px',
          }}
        >
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{
                  fontWeight: '700', fontSize: '0.95rem', color: 'white', margin: '0 0 4px',
                }}
                >
                  {title}
                </p>
                <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="glass-btn"
          style={{ padding: '12px 40px', fontSize: '1rem', fontWeight: '700' }}
          onClick={onDone}
        >
          Get Started →
        </Button>
      </div>
    </div>
  );
}

WelcomeScreen.propTypes = {
  onDone: PropTypes.func.isRequired,
};
