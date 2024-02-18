/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'react-bootstrap';
import Link from 'next/link';

function Home() {
  return (
    <div className="text-center my-4">
      <Link href="./path/new" passHref>
        <Button variant="dark" style={{ margin: '0 0 10px' }}>
          Add A Learning Path
        </Button>
      </Link>
    </div>
  );
}

export default Home;
