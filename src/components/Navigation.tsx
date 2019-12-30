import React from 'react';
import { connect } from 'react-redux';
import { setVisibleProfile, selectWorkspace } from '../redux/actions';
import { Workspace } from '../types';
import WorkspaceItem from './WorkspaceItem';

/**
 * Navigation module to change app views (workspaces, notifications, profile and logout button)
 * @visibleName Toolbar
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Navigation: React.FC<NavigationProps> = ({ workspaces, selectedWorkspace, setVisibleProfile, selectWorkspace, active, setActive }) => {
  return (
    <div id='navigation'>
      <div>
        <div onClick={() => setVisibleProfile(true)}>
          <p>
            <img src={require('../assets/images/profile-icon.png')} alt='profile' />
            Profile
          </p>
        </div>
        <div onClick={() => setActive('Notifications')}>
          {active === 'Notifications' && <div id='active-indicator' className='opacityIn'></div>}          
          <p>
            <img src={require('../assets/images/notifications-icon.png')} alt='nots' />
            Notifications
          </p>
        </div>
        <p>Workspaces</p>
        {workspaces.map(w => <WorkspaceItem workspace={w} key={w.id} onClick={() => selectWorkspace(w.id)} 
          active={selectedWorkspace && active === 'Workspace' ? w.id === selectedWorkspace.id : false} />)}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const { userReducer } = state;
  return {
    workspaces: userReducer.workspaces,
    selectedWorkspace: userReducer.selectedWorkspace,
  };
};

export default connect(mapStateToProps, { setVisibleProfile, selectWorkspace })(Navigation);

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
}