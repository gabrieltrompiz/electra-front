import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Workspace as WorkspaceI, State } from '../types';
import WorkspaceMenu from '../components/workspace/WorkspaceMenu';
import Sprint from './Sprint';
import Backlog from './Backlog';

/**
 * Workspace view
 * @visibleName Workspace View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Workspace: React.FC<WorkspaceProps> = ({ workspace }) => {
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

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    workspace: userReducer.selectedWorkspace
  };
};

export default connect(mapStateToProps)(Workspace);

interface WorkspaceProps {
  /** Current selected workspace */
  workspace: WorkspaceI
}