import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSinglePath } from '../../../api/pathsData';
import FormPath from '../../../components/forms/FormPath';

function EditPath() {
  const [editPath, setEditPath] = useState({});
  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    if (firebaseKey) {
      getSinglePath(firebaseKey).then(setEditPath);
    }
  }, [firebaseKey]);

  return (
    <div>
      <FormPath objPath={editPath} />
    </div>
  );
}

export default EditPath;
