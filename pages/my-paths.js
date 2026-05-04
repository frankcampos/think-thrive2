/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPathsByUserId } from '../api/pathsData';
import { useAuth } from '../utils/context/authContext';
import PathCard from '../components/pathCard';

const getBentoSize = (index) => {
  if (index === 0) return 'featured';
  if (index % 7 === 5) return 'wide';
  return 'default';
};

function MyPaths() {
  const [paths, setPaths] = useState([]);
  const { user } = useAuth();

  const getAllThePaths = () => {
    getPathsByUserId(user.uid).then((response) => setPaths(response));
  };

  useEffect(() => { getAllThePaths(); }, []);

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontWeight: '700', fontSize: '2rem', color: 'white', marginBottom: '6px',
        }}
        >
          My Paths
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '20px' }}>
          Your personal learning collection
        </p>
        <Link href="./path/new" passHref>
          <Button className="glass-btn">+ Add A Learning Path</Button>
        </Link>
      </div>

      {paths.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center', padding: '48px 24px', maxWidth: '400px', margin: '0 auto',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗂️</div>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>No paths yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>Create your first learning path to get started.</p>
        </div>
      ) : (
        <div className="bento-grid">
          {paths.map((path, index) => {
            const size = getBentoSize(index);
            return (
              <div key={path.firebaseKey} className={`bento-${size}`}>
                <PathCard path={path} onUpdate={getAllThePaths} size={size} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyPaths;
