import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const conceptualSteps = [
  {
    icon: '🤔',
    title: 'Write a question',
    description: 'Something you want to understand. Frame it as a real question you\'d ask yourself.',
    tip: 'Example: "What is Agile Methodology?"',
  },
  {
    icon: '✍️',
    title: 'Write the answer in your own words',
    description: 'Don\'t copy-paste. Paraphrasing forces you to actually understand the concept.',
    tip: 'You can always edit it later as your understanding improves.',
  },
  {
    icon: '🏷️',
    title: 'Add tags',
    description: 'Click the Tags area on any card to organize it. You can create, add, or remove tags.',
    tip: 'Example tags: #Agile #SoftwareDevelopment #ProjectManagement',
  },
  {
    icon: '🤖',
    title: 'Review with AI feedback',
    description: 'Hit Review, type your answer from memory, then reveal the correct answer. AI will grade your response and give you a simplified example.',
    tip: 'The AI uses GPT-4 to provide personalized feedback on your answer.',
  },
];

const proceduralSteps = [
  {
    icon: '📋',
    title: 'Name the skill or task',
    description: 'Use a clear "How to..." format so you know exactly what procedure this covers.',
    tip: 'Example: "How to run a Next.js server" or "How to make chicken soup"',
  },
  {
    icon: '🔢',
    title: 'Break it into numbered steps',
    description: 'List each action required to complete the task. Number them clearly.',
    tip: 'Example: 1. Open terminal  2. cd into project  3. Run npm run dev',
  },
  {
    icon: '🔁',
    title: 'Review by recalling steps',
    description: 'Hit Review, try to recall the steps from memory, then reveal them to compare.',
    tip: 'Use "Feedback on Steps" to get AI recommendations on what you missed.',
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
  marginBottom: '10px',
};

function StepCard({ step, index, accent }) {
  return (
    <div style={stepCardStyle}>
      <div style={{
        fontSize: '1.5rem', lineHeight: 1, flexShrink: 0, width: '36px', textAlign: 'center',
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
            background: `${accent}22`,
            color: accent,
            fontSize: '0.68rem',
            fontWeight: '700',
            padding: '1px 7px',
            borderRadius: '10px',
            border: `1px solid ${accent}55`,
          }}
          >
            Step {index + 1}
          </span>
          <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'white' }}>{step.title}</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>
          {step.description}
        </p>
        <div style={{
          background: `${accent}11`,
          borderLeft: `3px solid ${accent}`,
          borderRadius: '0 6px 6px 0',
          padding: '6px 10px',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.5)',
          fontStyle: 'italic',
        }}
        >
          {step.tip}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ emoji, label, accent }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '14px',
      marginTop: '8px',
      paddingBottom: '10px',
      borderBottom: `1px solid ${accent}33`,
    }}
    >
      <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
      <div>
        <div style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>{label}</div>
        <div style={{
          fontSize: '0.72rem', color: accent, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px',
        }}
        >
          Card Type
        </div>
      </div>
    </div>
  );
}

function InstructionConceptualAndProceduralModal() {
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
              fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#c084fc', marginBottom: '4px',
            }}
            >
              Knowledge Cards
            </div>
            <Modal.Title style={{ fontWeight: '700', fontSize: '1.3rem', color: 'white' }}>
              How to Build Your Cards
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body style={{ padding: '24px', maxHeight: '65vh', overflowY: 'auto' }}>
          <SectionHeader emoji="💡" label="Conceptual Cards — What is it?" accent="#00d4ff" />
          {conceptualSteps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} accent="#00d4ff" />
          ))}

          <div style={{ margin: '24px 0 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }} />

          <SectionHeader emoji="⚙️" label="Procedural Cards — How to do it?" accent="#c084fc" />
          {proceduralSteps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} accent="#c084fc" />
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

export default InstructionConceptualAndProceduralModal;
