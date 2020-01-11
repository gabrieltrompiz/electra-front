import React from 'react';
import { connect } from 'react-redux';
import { setVisibleProfile, selectWorkspace, setShowCreateWorkspace, logout } from '../redux/actions';
import { Workspace, State } from '../types';
import WorkspaceItem from './workspace/WorkspaceItem';

/**
 * Navigation module to change app views (workspaces, notifications, profile and logout button)
 * @visibleName Toolbar
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Navigation: React.FC<NavigationProps> = ({ workspaces, selectedWorkspace, setVisibleProfile, selectWorkspace, active, setActive, setShowCreateWorkspace, logout }) => {
  const onLogout = () => {
    localStorage.clear();
    logout();
  };

  return (
    <div id='navigation'>
      <div>
        <div onClick={() => setVisibleProfile(true)}>
          <p>
            <img src={require('../assets/images/profile-icon.png')} alt='profile' />
            Profile
          </p>
        </div>
        <div onClick={() => { setActive('Notifications'); selectWorkspace(null); }}>
          {active === 'Notifications' && <div id='active-indicator' className='opacityIn'></div>}          
          <p>
            <img src={require('../assets/images/notifications-icon.png')} alt='nots' />
            Notifications
          </p>
        </div>
        <p>Workspaces</p>
        {workspaces.map(w => <WorkspaceItem workspace={w} key={w.id} onClick={() => selectWorkspace(w.id)} 
          active={selectedWorkspace && active === 'Workspace' ? w.id === selectedWorkspace.id : false} />)}
        <div onClick={() => setShowCreateWorkspace(true)}>
          <p>
            <img src={require('../assets/images/add-circle.png')} alt='create' />
            Create Workspace
          </p>
        </div>
        <div>
          <p>
            <img src={require('../assets/images/search-circle.png')} alt='create' />
            Workspace Discovery
          </p>
        </div>
      </div>
      <div>
        <button onClick={() => onLogout()}>
          <img src={require('../assets/images/logout.png')} alt='logout'/>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    workspaces: userReducer.workspaces,
    selectedWorkspace: userReducer.selectedWorkspace,
  };
};

export default connect(mapStateToProps, { setVisibleProfile, selectWorkspace, setShowCreateWorkspace, logout })(Navigation);

interface NavigationProps {
  /** Array containing all workspaces */
  workspaces: Array<Workspace>
  /** Current selected workspace */
  selectedWorkspace: Workspace | null
  /** Control if the profile is visible or not */
  setVisibleProfile: Function
  /** Method to change active workspace */
  selectWorkspace: Function
  /** Active view controlled by Dashboard */
  active: string
  /** Methods to change active view from Dashborad */
  setActive: Function
  /** Shows the create workspace view */
  setShowCreateWorkspace: Function
  /** Logout method */
  logout: Function
}