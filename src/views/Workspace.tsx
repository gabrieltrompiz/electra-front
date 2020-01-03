import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Workspace as WorkspaceI, State } from '../types';
import WorkspaceMenu from '../components/WorkspaceMenu';

const Workspace: React.FC<WorkspaceProps> = ({ workspace }) => {
  const [active, setActive] = useState<string>('Sprint');

  return (
    <div id='workspace'>
      <WorkspaceMenu active={active} setActive={setActive} />
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