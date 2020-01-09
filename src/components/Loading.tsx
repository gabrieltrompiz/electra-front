import React from 'react';

/**
 * Loading view
 * @visibleName Loading
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Loading: React.FC<LoadingProps> = ({ color = 'white' }) => {
  return (
    <div id='loading' style={{ color }}>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;

interface LoadingProps {
  /** Color of the 'Loading...' text. Defaults to white */
  color?: string
}