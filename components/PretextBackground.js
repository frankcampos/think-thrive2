import { useEffect, useRef } from 'react';
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

const PHRASES = [
  'Build lasting knowledge. ',
  'Master concepts through active recall. ',
  'Review smarter, not harder. ',
  'Get instant AI feedback. ',
  'Think deeper. Thrive faster. ',
  'Learn anything, anywhere. ',
  'Knowledge compounds over time. ',
  'Small steps, massive results. ',
];
const TEXT = PHRASES.join('').repeat(25);

const BODY_FONT = '13px Inter, sans-serif';
const KW_FONT = 'bold 60px Inter, sans-serif';
const LINE_HEIGHT = 21;
const MARGIN = 36;
const CURSOR_BASE_R = 72;
const CURSOR_PULSE_AMP = 20;
const KW_PAD = 20;
const MAGNET_RADIUS = 240;
const MAGNET_STRENGTH = 0.9;
const MAX_SPEED = 2.5;
const CONSTELLATION_DIST = 400;

const KW_DEFS = [
  {
    text: 'LEARN', color: '#00d4ff', xR: 0.12, yR: 0.18, vx: 0.28, vy: 0.18,
  },
  {
    text: 'MASTER', color: '#c084fc', xR: 0.72, yR: 0.32, vx: -0.22, vy: 0.26,
  },
  {
    text: 'THINK', color: '#60a5fa', xR: 0.38, yR: 0.62, vx: 0.20, vy: -0.24,
  },
  {
    text: 'THRIVE', color: '#c084fc', xR: 0.65, yR: 0.76, vx: -0.26, vy: 0.16,
  },
  {
    text: 'RECALL', color: '#00d4ff', xR: 0.22, yR: 0.82, vx: 0.16, vy: -0.28,
  },
];

function getLineSegments(y, keywords, cursor, canvasW) {
  let xStart = MARGIN;
  let xEnd = canvasW - MARGIN;

  keywords.forEach(({
    px, py, kw, kh,
  }) => {
    const halfH = kh / 2 + KW_PAD;
    if (Math.abs(y - py) >= halfH) return;
    const halfW = kw / 2 + KW_PAD;
    const kLeft = px - halfW;
    const kRight = px + halfW;
    if (kLeft - MARGIN >= canvasW - MARGIN - kRight) {
      xEnd = Math.min(xEnd, kLeft);
    } else {
      xStart = Math.max(xStart, kRight);
    }
  });

  const segments = [{ x: xStart, width: Math.max(0, xEnd - xStart) }];

  if (cursor) {
    const r = cursor.r || CURSOR_BASE_R;
    const dy = Math.abs(y - cursor.y);
    if (dy < r) {
      const halfChord = Math.sqrt(r * r - dy * dy) + 12;
      const cLeft = cursor.x - halfChord;
      const cRight = cursor.x + halfChord;
      const result = [];
      segments.forEach(({ x, width }) => {
        const segEnd = x + width;
        const left = { x, width: Math.max(0, Math.min(cLeft, segEnd) - x) };
        const right = { x: Math.max(cRight, x), width: Math.max(0, segEnd - Math.max(cRight, x)) };
        if (left.width >= 50) result.push(left);
        if (right.width >= 50) result.push(right);
      });
      return result;
    }
  }

  return segments.filter((s) => s.width >= 50);
}

export default function PretextBackground() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    const syncSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    syncSize();
    window.addEventListener('resize', syncSize);

    const onMouseMove = (e) => {
      const prev = cursorRef.current;
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (!prev || Math.hypot(e.clientX - prev.x, e.clientY - prev.y) > 18) {
        ripplesRef.current.push({
          x: e.clientX, y: e.clientY, r: 0, alpha: 0.55,
        });
        if (ripplesRef.current.length > 10) ripplesRef.current.shift();
      }
    };
    const onMouseLeave = () => { cursorRef.current = null; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    let keywords = [];
    let prepared = null;
    let rafId = null;

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const pulseR = CURSOR_BASE_R + Math.sin(Date.now() / 380) * CURSOR_PULSE_AMP;
      const activeCursor = cursorRef.current ? { ...cursorRef.current, r: pulseR } : null;

      // Move keywords + bounce + cursor magnetism
      for (let ki = 0; ki < keywords.length; ki++) {
        if (activeCursor) {
          const dx = keywords[ki].px - activeCursor.x;
          const dy = keywords[ki].py - activeCursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAGNET_RADIUS && dist > 0) {
            const force = MAGNET_STRENGTH * (1 - dist / MAGNET_RADIUS);
            keywords[ki].vx += (dx / dist) * force;
            keywords[ki].vy += (dy / dist) * force;
            const speed = Math.sqrt(keywords[ki].vx ** 2 + keywords[ki].vy ** 2);
            if (speed > MAX_SPEED) {
              keywords[ki].vx = (keywords[ki].vx / speed) * MAX_SPEED;
              keywords[ki].vy = (keywords[ki].vy / speed) * MAX_SPEED;
            }
          }
        }
        keywords[ki].px += keywords[ki].vx;
        keywords[ki].py += keywords[ki].vy;
        const halfW = keywords[ki].kw / 2 + KW_PAD;
        const halfH = keywords[ki].kh / 2 + KW_PAD;
        if (keywords[ki].px - halfW < 0 || keywords[ki].px + halfW > w) keywords[ki].vx *= -1;
        if (keywords[ki].py - halfH < 0 || keywords[ki].py + halfH > h) keywords[ki].vy *= -1;
      }

      // Draw body text wrapping around keywords and cursor void
      if (prepared) {
        ctx.font = BODY_FONT;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = 'rgba(255,255,255,0.13)';

        let cursor = { segmentIndex: 0, graphemeIndex: 0 };
        let y = MARGIN + LINE_HEIGHT;

        while (y <= h + LINE_HEIGHT) {
          const segments = getLineSegments(y, keywords, activeCursor, w);
          for (let si = 0; si < segments.length; si++) {
            const seg = segments[si];
            const line = layoutNextLine(prepared, cursor, seg.width);
            if (line) {
              ctx.fillText(line.text, seg.x, y);
              cursor = line.end;
            } else {
              cursor = { segmentIndex: 0, graphemeIndex: 0 };
            }
          }
          y += LINE_HEIGHT;
        }
      }

      // Draw constellation lines between nearby keywords
      for (let i = 0; i < keywords.length; i++) {
        for (let j = i + 1; j < keywords.length; j++) {
          const dx = keywords[i].px - keywords[j].px;
          const dy = keywords[i].py - keywords[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONSTELLATION_DIST) {
            const alpha = (1 - dist / CONSTELLATION_DIST) * 0.4;
            ctx.save();
            ctx.strokeStyle = `rgba(192,132,252,${alpha})`;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(192,132,252,0.5)';
            ctx.beginPath();
            ctx.moveTo(keywords[i].px, keywords[i].py);
            ctx.lineTo(keywords[j].px, keywords[j].py);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw expanding ripple rings
      ripplesRef.current = ripplesRef.current.filter((rip) => rip.alpha > 0.02);
      for (let ri = 0; ri < ripplesRef.current.length; ri++) {
        ripplesRef.current[ri].r += 2.8;
        ripplesRef.current[ri].alpha *= 0.93;
        ctx.save();
        ctx.strokeStyle = `rgba(0,212,255,${ripplesRef.current[ri].alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0,212,255,0.4)';
        ctx.beginPath();
        ctx.arc(ripplesRef.current[ri].x, ripplesRef.current[ri].y, ripplesRef.current[ri].r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw cursor glow dot
      if (cursorRef.current) {
        const { x: cx, y: cy } = cursorRef.current;
        const dotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR * 1.1);
        dotGrad.addColorStop(0, 'rgba(0,212,255,0.18)');
        dotGrad.addColorStop(0.3, 'rgba(0,212,255,0.06)');
        dotGrad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.fillStyle = dotGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseR * 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#00d4ff';
        ctx.fillStyle = 'rgba(0,212,255,0.85)';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw keywords on top (glow + text)
      ctx.textBaseline = 'middle';
      keywords.forEach(({
        text, px, py, color,
      }) => {
        ctx.save();
        ctx.font = KW_FONT;
        ctx.shadowBlur = 40;
        ctx.shadowColor = color;
        ctx.fillStyle = `${color}bb`;
        ctx.fillText(text, px - ctx.measureText(text).width / 2, py);
        ctx.restore();
      });

      rafId = requestAnimationFrame(animate);
    };

    document.fonts.ready.then(() => {
      ctx.font = KW_FONT;
      const KW_H = 60;
      keywords = KW_DEFS.map((def) => ({
        text: def.text,
        color: def.color,
        kw: ctx.measureText(def.text).width,
        kh: KW_H,
        px: def.xR * canvas.width,
        py: def.yR * canvas.height,
        vx: def.vx,
        vy: def.vy,
      }));

      try {
        prepared = prepareWithSegments(TEXT, BODY_FONT);
      } catch (e) {
        console.warn('[PretextBackground]', e);
      }
      animate();
    });

    return () => {
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
