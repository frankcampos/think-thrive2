/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Container } from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllPaths } from '../api/pathsData';
import PathCard from '../components/pathCard';
import InstructionsModal from '../components/instructionsModal';

function Home() {
  const [paths, setPaths] = useState([]);

  const getAllThePaths = () => {
    getAllPaths().then((response) => {
      setPaths(response);
    });
  };

  useEffect(() => { getAllThePaths(); }, []);

  return (
    <Container>
      <div className="d-flex flex-wrap justify-content-evenly" style={{ margin: '0 auto' }}>
        <Link href="./path/new" passHref>
          <Button variant="dark" style={{ margin: '0 0 10px' }}>
            Add A Learning Path
          </Button>
        </Link>
        <InstructionsModal style={{ margin: '10px' }} />
      </div>
      <div className="d-flex flex-wrap justify-content-evenly" style={{ margin: '0 auto' }}>
        {paths.map((path) => (
          <PathCard key={path.firebaseKey} path={path} onUpdate={getAllThePaths} />
        ))}
      </div>
    </Container>
  );
}

export default Home;
