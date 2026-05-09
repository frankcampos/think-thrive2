/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Container } from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getAllPaths } from '../api/pathsData';
import PathCard from '../components/pathCard';
import InstructionsModal from '../components/instructionsModal';

const getBentoSize = (index) => {
  if (index === 0) return 'featured';
  if (index % 7 === 5) return 'wide';
  return 'default';
};

function Home() {
  const [paths, setPaths] = useState([]);

  const getAllThePaths = () => {
    getAllPaths().then((response) => setPaths(response));
  };

  useEffect(() => { getAllThePaths(); }, []);

  return (
    <Container>
      <Head>
        <title>Learning Paths | ThinkThrive</title>
        <meta name="description" content="Explore community-created neuroscience-based learning paths on ThinkThrive." />
      </Head>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontWeight: '700', fontSize: '2rem', color: 'white', marginBottom: '6px',
        }}
        >
          Learning Paths
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '20px' }}>
          Explore paths created by the community
        </p>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap',
        }}
        >
          <Link href="./path/new" passHref>
            <Button className="glass-btn">+ Add A Learning Path</Button>
          </Link>
          <InstructionsModal />
        </div>
      </div>

      {paths.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center', padding: '48px 24px', maxWidth: '400px', margin: '0 auto',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📚</div>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>No paths yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>Be the first to create a learning path!</p>
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
    </Container>
  );
}

export default Home;
