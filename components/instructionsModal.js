import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const steps = [
  {
    icon: '🎯',
    title: 'Name your path',
    description: 'Choose a clear, motivating title that captures what you want to learn.',
    tip: 'Example: "Becoming a Web Developer" — short, specific, and inspiring.',
  },
  {
    icon: '🏆',
    title: 'Set a goal',
    description: 'Write why you want to learn this. Make it concrete and measurable.',
    tip: 'Example: "I want to acquire the skills needed to land a junior dev job."',
  },
  {
    icon: '🖼️',
    title: 'Add an image',
    description: 'Paste a URL or upload a file. To grab a URL: right-click any image online → "Copy Image Address".',
    tip: 'Pick something that visually represents your goal — it helps with motivation.',
  },
  {
    icon: '🃏',
    title: 'Build your cards',
    description: 'Once your path is created, open it and start adding Conceptual cards (Q&A) and Procedural cards (step-by-step).',
    tip: 'Click "How It Works" inside the path for a full guide on cards.',
  },
];

const stepCardStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
};

function InstructionsModal() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button className="glass-btn-outline" style={{ margin: '0 0 10px' }} onClick={() => setShow(true)}>
        How It Works
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        size="lg"
        contentClassName="glass-modal-content"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '20px 24px',
          }}
        >
          <div>
            <div style={{
              fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#00d4ff', marginBottom: '4px',
            }}
            >
              Getting Started
            </div>
            <Modal.Title style={{ fontWeight: '700', fontSize: '1.3rem', color: 'white' }}>
              How to Create a Learning Path
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '24px', maxHeight: '65vh', overflowY: 'auto' }}>
          {steps.map((step, i) => (
            <div key={step.title} style={stepCardStyle}>
              <div style={{
                fontSize: '1.6rem',
                lineHeight: 1,
                flexShrink: 0,
                width: '40px',
                textAlign: 'center',
              }}
              >
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px',
                }}
                >
                  <span style={{
                    background: 'rgba(0,212,255,0.15)',
                    color: '#00d4ff',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0,212,255,0.3)',
                  }}
                  >
                    Step {i + 1}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>{step.title}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '8px' }}>
                  {step.description}
                </p>
                <div style={{
                  background: 'rgba(0,212,255,0.07)',
                  borderLeft: '3px solid #00d4ff',
                  borderRadius: '0 6px 6px 0',
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.55)',
                  fontStyle: 'italic',
                }}
                >
                  {step.tip}
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer style={{
          background: 'transparent',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 24px',
          justifyContent: 'flex-end',
        }}
        >
          <Button className="glass-btn" onClick={() => setShow(false)}>Got it</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InstructionsModal;
