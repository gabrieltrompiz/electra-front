import React from 'react';
import { connect } from 'react-redux';
import { Workspace as WorkspaceI } from '../types';

const Workspace: React.FC<WorkspaceProps> = ({ workspace }) => {
  return (
    <div>
      {workspace.name}
      {workspace.id}
    </div>
  );
};

const mapStateToProps = (state: any) => {
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