import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import WorkspaceMenu from '../components/workspace/WorkspaceMenu';
import Sprint from './Sprint';
import Backlog from './Backlog';
import Chat from './Chat';
import { State, Workspace as WorkspaceI } from 'electra';

/**
 * Workspace view
 * @visibleName Workspace View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Workspace: React.FC<WorkspaceProps> = ({ selectedWorkspace }) => {
  const [active, setActive] = useState<string>('Sprint');
  const [showing, setShowing] = useState<string>('Sprint');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive('Sprint');
  }, [selectedWorkspace]);

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
        {showing === 'Chat' && <Chat />}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    selectedWorkspace: userReducer.selectedWorkspace
  };
};

export default connect(mapStateToProps)(Workspace);

interface WorkspaceProps {
  /** selected worksapce */
  selectedWorkspace: WorkspaceI
}