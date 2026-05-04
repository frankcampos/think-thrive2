import React from 'react';
import {
  Spinner,
} from 'react-bootstrap';

export default function Loading() {
  return (
    <div className="text-center mt-5">
      <Spinner
        animation="border"
        style={{
          color: '#00d4ff',
          width: '80px',
          height: '80px',
        }}
      />
    </div>
  );
}
