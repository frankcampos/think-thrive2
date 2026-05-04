/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { getProceduralKnowledgeByFirebaseKey } from '../../../api/proceduralknowledgeData';

const ACCENT = '#c084fc';
const STEPPER_LABELS = ['Task', 'Your Steps', 'AI Review'];

function getCircleStyle(done, active) {
  if (done) return { background: ACCENT, border: `2px solid ${ACCENT}`, color: '#0a0a1a' };
  if (active) return { background: 'rgba(192,132,252,0.15)', border: `2px solid ${ACCENT}`, color: ACCENT };
  return { background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.3)' };
}

function ReviewStepper({ current }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '14px 24px',
      background: 'rgba(0,0,0,0.15)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}
    >
      {STEPPER_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const circleStyle = getCircleStyle(done, active);
        let labelColor = 'rgba(255,255,255,0.25)';
        if (active) labelColor = ACCENT;
        else if (done) labelColor = 'rgba(192,132,252,0.6)';
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPPER_LABELS.length - 1 ? 1 : 'none' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
            }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: '700',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                ...circleStyle,
              }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '0.58rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                whiteSpace: 'nowrap',
                transition: 'color 0.3s ease',
                color: labelColor,
              }}
              >
                {label}
              </span>
            </div>
            {i < STEPPER_LABELS.length - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                margin: '0 8px',
                marginBottom: '22px',
                borderRadius: '1px',
                transition: 'background 0.4s ease',
                background: done ? ACCENT : 'rgba(255,255,255,0.08)',
              }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

ReviewStepper.propTypes = { current: PropTypes.number.isRequired };

const ProceduralCardKnowledgeReviewPage = () => {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [proceduralCard, setProceduralCard] = useState({});
  const [messages, setMessages] = useState([]);
  const [steps, setSteps] = useState([]);
  const [stepInput, setStepInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const uidRef = useRef(0);

  const stepCount = steps.length;

  let currentStep = 0;
  if (answered && !loading) currentStep = 2;
  else if (answered || stepCount > 0) currentStep = 1;

  useEffect(() => {
    getProceduralKnowledgeByFirebaseKey(firebaseKey).then((response) => {
      setProceduralCard(response);
      setMessages([{
        role: 'bot', type: 'task', content: response.title, picture: response.picture, uid: 0,
      }]);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const pushMessage = (role, content, type) => {
    uidRef.current += 1;
    setMessages((prev) => [...prev, {
      role, content, type, uid: uidRef.current,
    }]);
  };

  const handleAddStep = () => {
    if (!stepInput.trim() || answered) return;
    const text = stepInput.trim();
    setSteps((prev) => [...prev, text]);
    pushMessage('user', text, 'step');
    setStepInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddStep(); }
  };

  const handleSubmit = async () => {
    if (stepCount === 0 || loading || answered) return;
    setAnswered(true);
    setLoading(true);
    const combined = steps.map((s, i) => `${i + 1}. ${s}`).join('\n');

    try {
      const feedbackRes = await axios.post('/api/openai', {
        model: 'gpt-4o-mini',
        prompt: `Considering the task of '${proceduralCard.title}', you've outlined these steps:\n${combined}\n\nLet's take a closer look together to see if anything might have been missed or could be tweaked for better clarity or efficiency. After reviewing, I'll suggest a revised set of steps that includes any improvements or additional actions needed to complete the task more effectively.`,
        max_tokens: 600,
      });

      pushMessage('bot', proceduralCard.taskSteps, 'steps');
      pushMessage('bot', feedbackRes.data.choices[0].message.content, 'feedback');
    } catch (err) {
      pushMessage('bot', 'Sorry, something went wrong getting AI feedback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{
      role: 'bot', type: 'task', content: proceduralCard.title, picture: proceduralCard.picture, uid: 0,
    }]);
    setSteps([]);
    setStepInput('');
    setAnswered(false);
  };

  const handleClose = () => router.push(`/conceptual-knowledge/${proceduralCard.pathId}`);

  const getBotBubbleStyle = (type) => {
    const base = {
      maxWidth: '78%',
      padding: '14px 18px',
      borderRadius: '18px 18px 18px 4px',
      fontSize: '0.95rem',
      lineHeight: 1.65,
      color: 'white',
      whiteSpace: 'pre-wrap',
    };
    if (type === 'steps') return { ...base, background: 'rgba(192,132,252,0.12)', border: '1px solid rgba(192,132,252,0.3)' };
    if (type === 'feedback') return { ...base, background: 'rgba(102,126,234,0.12)', border: '1px solid rgba(102,126,234,0.3)' };
    return { ...base, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' };
  };

  const getLabelFor = (role, type) => {
    if (role === 'user') return { text: 'Your Step', color: '#00d4ff' };
    if (type === 'task') return { text: 'Task', color: ACCENT };
    if (type === 'steps') return { text: 'Correct Steps', color: ACCENT };
    if (type === 'feedback') return { text: 'AI Feedback', color: '#a78bfa' };
    return null;
  };

  // Count step number for a given message index
  const getStepNum = (upToIndex) => messages.slice(0, upToIndex + 1).filter((m) => m.type === 'step').length;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 16px' }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        minHeight: '540px',
      }}
      >
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(192,132,252,0.25)',
          borderBottom: 'none',
          borderRadius: '16px 16px 0 0',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9333ea, #c084fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0,
            }}
            >
              ⚙
            </div>
            <div>
              <div style={{
                fontSize: '0.68rem', fontWeight: '700', color: ACCENT, letterSpacing: '1px', textTransform: 'uppercase',
              }}
              >
                Procedural Review
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>AI-powered study session</div>
            </div>
          </div>
          <Button className="glass-btn-outline" size="sm" onClick={handleClose}>← Back</Button>
        </div>

        {/* Stepper */}
        <ReviewStepper current={currentStep} />

        {/* Chat window */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: 'none',
          borderBottom: 'none',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
        >
          {messages.map((msg, i) => {
            const label = getLabelFor(msg.role, msg.type);
            const isUser = msg.role === 'user';

            if (msg.type === 'task') {
              return (
                <div key={msg.uid} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {label && (
                    <span style={{
                      fontSize: '0.63rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: label.color,
                      marginBottom: '5px',
                      paddingLeft: '4px',
                    }}
                    >
                      {label.text}
                    </span>
                  )}
                  <div style={{
                    maxWidth: '78%',
                    borderRadius: '18px 18px 18px 4px',
                    overflow: 'hidden',
                    background: 'rgba(192,132,252,0.1)',
                    border: '1px solid rgba(192,132,252,0.3)',
                  }}
                  >
                    {msg.picture && (
                      <img
                        src={msg.picture}
                        alt={msg.content}
                        style={{
                          width: '100%', height: '180px', objectFit: 'cover', display: 'block',
                        }}
                      />
                    )}
                    <div style={{
                      padding: '14px 18px', fontSize: '1rem', fontWeight: '700', color: 'white', lineHeight: 1.5,
                    }}
                    >
                      {msg.content}
                    </div>
                    <div style={{ padding: '0 18px 14px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                      Recall the steps for this task one by one.
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.type === 'step') {
              const num = getStepNum(i);
              return (
                <div key={msg.uid} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{
                    fontSize: '0.63rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#00d4ff',
                    marginBottom: '5px',
                    paddingRight: '4px',
                  }}
                  >
                    Step
                    {' '}
                    {num}
                  </span>
                  <div style={{
                    maxWidth: '78%',
                    padding: '12px 18px',
                    borderRadius: '18px 18px 4px 18px',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'white',
                    background: 'rgba(0,212,255,0.12)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                  >
                    <span style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'rgba(0,212,255,0.25)',
                      border: '1px solid rgba(0,212,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: '#00d4ff',
                    }}
                    >
                      {num}
                    </span>
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.uid} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                {label && (
                  <span style={{
                    fontSize: '0.63rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: label.color,
                    marginBottom: '5px',
                    paddingLeft: isUser ? 0 : '4px',
                    paddingRight: isUser ? '4px' : 0,
                  }}
                  >
                    {label.text}
                  </span>
                )}
                <div style={isUser ? {
                  maxWidth: '78%',
                  padding: '14px 18px',
                  borderRadius: '18px 18px 4px 18px',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'white',
                  whiteSpace: 'pre-wrap',
                  background: 'rgba(0,212,255,0.15)',
                  border: '1px solid rgba(0,212,255,0.35)',
                } : getBotBubbleStyle(msg.type)}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                padding: '14px 20px',
                borderRadius: '18px 18px 18px 4px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
              }}
              >
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="typing-dot"
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: ACCENT,
                      animationDelay: `${d * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0 0 16px 16px',
          padding: '14px 16px',
        }}
        >
          {!answered ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#00d4ff',
                }}
                >
                  Step
                  {' '}
                  {stepCount + 1}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,212,255,0.2)' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Describe step ${stepCount + 1}…`}
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="glass-input"
                  style={{
                    flex: 1, borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem',
                  }}
                />
                <Button
                  className="glass-btn-outline"
                  onClick={handleAddStep}
                  disabled={!stepInput.trim()}
                  style={{
                    borderRadius: '10px', padding: '10px 18px', flexShrink: 0, fontWeight: '600',
                  }}
                >
                  + Add
                </Button>
              </div>
              {stepCount > 0 && (
                <Button
                  className="glass-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px' }}
                >
                  Submit
                  {' '}
                  {stepCount}
                  {' '}
                  Step
                  {stepCount !== 1 ? 's' : ''}
                  {' '}
                  for Review →
                </Button>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap',
            }}
            >
              <Button className="glass-btn" onClick={handleReset} disabled={loading}>Try Again</Button>
              <Button className="glass-btn-outline" onClick={handleClose}>← Back to Cards</Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProceduralCardKnowledgeReviewPage;
