import React from 'react';
import { connect } from 'react-redux';
import { State, Workspace } from '../types';
import CollaboratorItem from './CollaboratorItem';

const WorkspaceMenu: React.FC<WorkspaceMenuProps> = ({ workspace, active, setActive, userId }) => {
  return (
    <div>
      <div>
        <p>{workspace.name}</p>
      </div>
      <div>
        <div className={active === 'Sprint' ? 'active' : undefined}>
          <img src={require('../assets/images/active-sprint.png')} alt='active' />
          <p>Active Sprint</p>
        </div>
        <div className={active === 'Backlog' ? 'active' : undefined}>
          <img src={require('../assets/images/backlog.png')} alt='backlog' />
          <p>Sprint Backlog</p>
        </div>
      </div>
      <p>CHANNELS</p>
      <div id='channels'>
        <p>#general</p>
        <p>#development</p>
      </div>
      <p>COLLABORATORS</p>
      {workspace.members.map(m => <CollaboratorItem key={m.user.id} user={m.user} />)}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    workspace: userReducer.selectedWorkspace,
    userId: userReducer.user.id
  };
};

export default connect(mapStateToProps)(WorkspaceMenu);

interface WorkspaceMenuProps {
  /** The current selected workspace */
  workspace: Workspace
  /** The current selected item from the menu */
  active: string
  /** Function to change the active view in workspace view */
  setActive: Function
  /** Logged user id */
  userId: number
}