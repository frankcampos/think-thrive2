/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPaths } from '../api/pathsData';
import { useAuth } from '../utils/context/authContext';
import PathCard from '../components/pathCard';

function MyPaths() {
  const [paths, setPaths] = useState([]);
  const { user } = useAuth();

  const getAllThePaths = () => {
    getPaths(user.uid).then((response) => {
      setPaths(response);
      console.warn(response);
    });
  };

  useEffect(() => { getAllThePaths(); }, []);

  return (
    <div className="text-center my-4">
      <Link href="./path/new" passHref>
        <Button variant="dark" style={{ margin: '0 0 10px' }}>
          Add A Learning Path
        </Button>
      </Link>
      <div className="d-flex flex-wrap justify-content-evenly" style={{ margin: '0 auto' }}>
        {paths.map((path) => (
          <PathCard key={path.firebaseKey} path={path} onUpdate={getAllThePaths} />
        ))}
      </div>
    </div>
  );
}

export default MyPaths;
