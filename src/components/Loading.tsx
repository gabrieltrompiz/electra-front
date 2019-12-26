import React from 'react';

interface LoadingProps {
  /** Color of the 'Loading...' text. Defaults to white */
  color?: string
}

const Loading: React.FC<LoadingProps> = ({ color = 'white' }) => {
  return (
    <div id='loading' style={{ color }}>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;