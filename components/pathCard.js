/* eslint-disable @next/next/no-img-element */
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import { deletePath } from '../api/pathsData';

function PathCard({ path, onUpdate, size }) {
  const { user } = useAuth();
  const deletethisPath = () => {
    if (window.confirm(`Are you sure you want to delete ${path.title}?`)) deletePath(path.firebaseKey).then(onUpdate());
  };
  const madeBy = user.uid === path.user_id ? user.displayName : path.user_name;
  const userPhoto = user.uid === path.user_id ? user.photoURL : path.user_photo;
  const isOwner = user.uid === path.user_id;

  const privateBadge = path.public === false && isOwner ? (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '0.7rem',
      fontWeight: '600',
      color: 'rgba(255,255,255,0.6)',
      background: 'rgba(255,255,255,0.1)',
      padding: '2px 8px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.15)',
    }}
    >
      🔒 Private
    </span>
  ) : null;

  const actions = (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Link href={`/conceptual-knowledge/${path.firebaseKey}`} passHref>
        <Button className="glass-btn" size="sm">View</Button>
      </Link>
      {isOwner && (
        <>
          <Link href={`/path/edit/${path.firebaseKey}`} passHref>
            <Button className="glass-btn-outline" size="sm">Edit</Button>
          </Link>
          <Button className="glass-btn-danger" size="sm" onClick={deletethisPath}>Delete</Button>
        </>
      )}
    </div>
  );

  const creator = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img
        src={userPhoto || '/placeholder-avatar.svg'}
        alt={madeBy}
        onError={(e) => { e.target.src = '/placeholder-avatar.svg'; }}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(255,255,255,0.35)',
        }}
      />
      <span style={{ fontSize: '0.82rem', color: '#00d4ff', fontWeight: '600' }}>{madeBy}</span>
    </div>
  );

  /* ── FEATURED (2×2) ── full-bleed image with overlay */
  if (size === 'featured') {
    return (
      <div
        className="glass-card"
        style={{
          position: 'relative', overflow: 'hidden', height: '100%', padding: 0,
        }}
      >
        <img
          src={path.image}
          alt={path.title}
          onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }}
        />
        {/* gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.1) 100%)',
        }}
        />
        {/* content pinned to bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px',
        }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
          >
            <div style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#00d4ff',
            }}
            >
              Featured
            </div>
            {privateBadge}
          </div>
          <h2 style={{
            fontWeight: '800', fontSize: '1.6rem', color: 'white', marginBottom: '8px', lineHeight: 1.2,
          }}
          >
            {path.title}
          </h2>
          <p style={{
            fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          >
            {path.goal}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
          }}
          >
            {creator}
            {actions}
          </div>
        </div>
      </div>
    );
  }

  /* ── WIDE (2×1) ── image left, info right */
  if (size === 'wide') {
    return (
      <div
        className="glass-card"
        style={{
          display: 'flex', overflow: 'hidden', height: '100%', padding: 0,
        }}
      >
        <img
          src={path.image}
          alt={path.title}
          onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
          style={{
            width: '42%', objectFit: 'cover', flexShrink: 0, borderRadius: '16px 0 0 16px',
          }}
        />
        <div style={{
          flex: 1, padding: '20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
        }}
        >
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '8px',
            }}
            >
              <h3 style={{
                fontWeight: '700', fontSize: '1.1rem', color: 'white', margin: 0, lineHeight: 1.3,
              }}
              >
                {path.title}
              </h3>
              {privateBadge}
            </div>
            <p style={{
              fontSize: '0.83rem',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '0',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            >
              {path.goal}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {creator}
            {actions}
          </div>
        </div>
      </div>
    );
  }

  /* ── DEFAULT (1×1) ── compact card */
  return (
    <div
      className="glass-card"
      style={{
        display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: 0,
      }}
    >
      <div style={{ position: 'relative', height: '55%', flexShrink: 0 }}>
        <img
          src={path.image}
          alt={path.title}
          onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 16px 0 0',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px 16px 0 0',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
        }}
        />
      </div>
      <div style={{
        flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
      >
        <h4 style={{
          fontWeight: '700',
          fontSize: '0.92rem',
          color: 'white',
          marginBottom: '4px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        >
          {path.title}
        </h4>
        {privateBadge && <div style={{ marginBottom: '4px' }}>{privateBadge}</div>}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px',
        }}
        >
          {creator}
          <Link href={`/conceptual-knowledge/${path.firebaseKey}`} passHref>
            <Button className="glass-btn" size="sm">View</Button>
          </Link>
        </div>
        {isOwner && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <Link href={`/path/edit/${path.firebaseKey}`} passHref>
              <Button className="glass-btn-outline" size="sm">Edit</Button>
            </Link>
            <Button className="glass-btn-danger" size="sm" onClick={deletethisPath}>Delete</Button>
          </div>
        )}
      </div>
    </div>
  );
}

PathCard.propTypes = {
  path: PropTypes.shape({
    firebaseKey: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    goal: PropTypes.string,
    user_id: PropTypes.string,
    user_name: PropTypes.string,
    user_photo: PropTypes.string,
    public: PropTypes.bool,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['featured', 'wide', 'default']),
};

PathCard.defaultProps = {
  size: 'default',
};

export default PathCard;
