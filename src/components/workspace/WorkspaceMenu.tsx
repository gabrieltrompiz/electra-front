import React from 'react';
import { connect } from 'react-redux';
import { setShowInvite } from '../../redux/actions';
import { State, Workspace } from 'electra';
import CollaboratorItem from './CollaboratorItem';

/**
 * Menu showing workspace options
 * @visibleName Workspace Menu
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const WorkspaceMenu: React.FC<WorkspaceMenuProps> = ({ workspace, active, setActive, setShowInvite }) => {
  console.log(workspace.chats)
  return workspace ? (
    <div>
      <div>
        <p>{workspace.name}</p>
      </div>
      <div>
        <div className={active === 'Sprint' ? 'active' : undefined} onClick={() => setActive('Sprint')}>
          <img src={require('../../assets/images/active-sprint.png')} alt='active' />
          <p>Active Sprint</p>
        </div>
        <div className={active === 'Backlog' ? 'active' : undefined} onClick={() => setActive('Backlog')}>
          <img src={require('../../assets/images/backlog.png')} alt='backlog' />
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
      <div id='invite-user' onClick={() => setShowInvite(true)}>
        <img src={require('../../assets/images/add-circle-border.png')} alt='add' />
        <p>Add Collaborators</p>
      </div>
    </div>
  ): <div></div>;
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    workspace: userReducer.selectedWorkspace
  };
};

export default connect(mapStateToProps, { setShowInvite })(WorkspaceMenu);

interface WorkspaceMenuProps {
  /** The current selected workspace */
  workspace: Workspace
  /** The current selected item from the menu */
  active: string
  /** Function to change the active view in workspace view */
  setActive: Function
  /** Function to show invite users view */
  setShowInvite: Function
}