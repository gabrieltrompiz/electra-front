import React, { useState, useEffect, useRef } from 'react';
import WorkspaceMenu from '../components/workspace/WorkspaceMenu';
import Sprint from './Sprint';
import Backlog from './Backlog';

/**
 * Workspace view
 * @visibleName Workspace View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Workspace: React.FC = () => {
  const [active, setActive] = useState<string>('Sprint');
  const [showing, setShowing] = useState<string>('Sprint');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(active && contentRef.current) {
      contentRef.current.classList.toggle('opacityIn');
      contentRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setShowing(active);
        contentRef.current.classList.toggle('opacityOut');
        contentRef.current.classList.toggle('opacityIn');
      }, 150);
    }
  }, [active]);

  return (
    <div id='workspace'>
      <WorkspaceMenu active={active} setActive={setActive} />
      <div id='workspace-content' ref={contentRef} className='opacityIn'>
        {showing === 'Sprint' && <Sprint />}
        {showing === 'Backlog' && <Backlog />}
      </div>
    </div>
  );
};

export default Workspace;