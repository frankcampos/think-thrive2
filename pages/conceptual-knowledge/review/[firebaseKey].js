/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { getSingleConceptualKnowledge } from '../../../api/conceptualknowledgeData';

function ReviewConceptualKnowledge() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [conceptualCard, setConceptualCard] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getSingleConceptualKnowledge(firebaseKey).then((response) => {
      setConceptualCard(response);
      setMessages([{ role: 'bot', type: 'question', content: response.question }]);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const pushMessage = (role, content, type = 'text') => {
    setMessages((prev) => [...prev, { role, content, type }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || answered) return;
    const userAnswer = input.trim();
    setInput('');
    setAnswered(true);
    pushMessage('user', userAnswer, 'user-answer');
    setLoading(true);

    try {
      const [feedbackRes, exampleRes] = await Promise.all([
        axios.post('/api/openai', {
          model: 'gpt-4o-mini',
          prompt: `Hey there! You've just tackled a flashcard with the question: '${conceptualCard.question}' and you've provided this answer: '${userAnswer}'. Let's take a moment to dive into how accurate and helpful your answer was. We'll look into the details together and see if there's anything missing or if there were any inaccuracies. I'll also share some tips on how you can make your answers even stronger, clearer, and more engaging. The goal here is to boost your understanding and make learning a more enjoyable journey. Ready? Let's get started!`,
          temperature: 0.7,
          max_tokens: 200,
        }),
        axios.post('/api/openai', {
          model: 'gpt-4o-mini',
          prompt: `Please explain the answer to this ${conceptualCard.question} in the simplest way possible, as if you're talking to someone who's never heard about the topic before. Include an example of an acronym and a short, easy-to-understand story related to the question: '${conceptualCard.question}'. Make sure your explanation is very clear and use examples that are easy to relate to.`,
          temperature: 0.7,
          max_tokens: 200,
        }),
      ]);

      pushMessage('bot', conceptualCard.answer, 'answer');
      pushMessage('bot', feedbackRes.data.choices[0].message.content, 'feedback');
      pushMessage('bot', exampleRes.data.choices[0].message.content, 'example');
    } catch (err) {
      pushMessage('bot', 'Sorry, something went wrong getting AI feedback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'bot', type: 'question', content: conceptualCard.question }]);
    setAnswered(false);
    setInput('');
  };

  const handleClose = () => router.push(`/conceptual-knowledge/${conceptualCard.pathId}`);

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
    if (type === 'answer') return { ...base, background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)' };
    if (type === 'feedback') return { ...base, background: 'rgba(102,126,234,0.12)', border: '1px solid rgba(102,126,234,0.3)' };
    if (type === 'example') return { ...base, background: 'rgba(118,75,162,0.12)', border: '1px solid rgba(118,75,162,0.3)' };
    return { ...base, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' };
  };

  const getLabelFor = (role, type) => {
    if (role === 'user') return { text: 'Your Answer', color: '#c084fc' };
    if (type === 'question') return { text: 'Question', color: '#00d4ff' };
    if (type === 'answer') return { text: 'Correct Answer', color: '#00d4ff' };
    if (type === 'feedback') return { text: 'AI Feedback', color: '#a78bfa' };
    if (type === 'example') return { text: 'Example & Tip', color: '#667eea' };
    return null;
  };

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
          border: '1px solid rgba(0,212,255,0.25)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
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
              background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0,
            }}
            >
              ◆
            </div>
            <div>
              <div style={{
                fontSize: '0.68rem', fontWeight: '700', color: '#00d4ff', letterSpacing: '1px', textTransform: 'uppercase',
              }}
              >Conceptual Review
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>AI-powered study session</div>
            </div>
          </div>
          <Button className="glass-btn-outline" size="sm" onClick={handleClose}>← Back</Button>
        </div>

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
          gap: '18px',
        }}
        >
          {messages.map((msg, i) => {
            const label = getLabelFor(msg.role, msg.type);
            const isUser = msg.role === 'user';
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
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
                  background: 'rgba(192,132,252,0.18)',
                  border: '1px solid rgba(192,132,252,0.4)',
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
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#00d4ff',
                      animationDelay: `${d * 0.2}s`,
                    }}
                    className="typing-dot"
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
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                rows={3}
                placeholder="Write your answer from memory… (Enter to send, Shift+Enter for newline)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="glass-input"
                style={{
                  flex: 1, resize: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem',
                }}
              />
              <Button
                className="glass-btn"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{ padding: '12px 22px', borderRadius: '10px', flexShrink: 0 }}
              >
                Send →
              </Button>
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

      <style jsx>{`
        .typing-dot {
          animation: typingBounce 1.2s ease-in-out infinite;
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}
      </style>
    </div>
  );
}

export default ReviewConceptualKnowledge;
