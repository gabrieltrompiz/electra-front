import React, { forwardRef, useRef, useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
import Profile from './Profile';
import { Profile as ProfileI, Workspace as WorkspaceI, State } from '../types';
import Workspace from './Workspace';
import Notifications from './Notifications';

/**
 * Dashboard view
 * @visibleName Dashboard View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Dashboard: React.RefForwardingComponent<HTMLDivElement, DashboardProps> = ({ shownProfile, showProfileView, selectedWorkspace, showCreateWorkspace }, ref) => {
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('Notifications');

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(showProfileView) {
      setVisibleProfile(true);
    } else if (profileRef.current) {
      profileRef.current.classList.toggle('opacityIn');
      profileRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setVisibleProfile(false);
      }, 300);
    }
  }, [showProfileView]);

  useEffect(() => {
    console.log(selectedWorkspace)
    if(selectedWorkspace) {
      setCurrentView('Workspace');
    }
  }, [selectedWorkspace]);

  return (
    <Fragment>
      {visibleProfile && <Profile ref={profileRef} user={shownProfile ? shownProfile : undefined} />}
      {showCreateWorkspace && <div></div>}
      <div id='dashboard' className='opacityIn' ref={ref}>
        <ToolBar />
        <div>
          <Navigation active={currentView} setActive={setCurrentView} />
          <div id='main-view'>
            {currentView === 'Workspace' && <Workspace />}
            {currentView === 'Notifications' && <Notifications />}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: State) => {
  const { settingsReducer, userReducer } = state;
  return {
    showProfileView: settingsReducer.showProfileView,
    shownProfile: settingsReducer.shownProfile,
    selectedWorkspace: userReducer.selectedWorkspace,
    showCreateWorkspace: settingsReducer.showCreateWorkspace
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(forwardRef<HTMLDivElement, DashboardProps>(Dashboard));

interface DashboardProps {
  /** Profile to be shown in the Profile view */
  shownProfile: ProfileI | null
  /** Wether the profile should be shown or not */
  showProfileView: boolean
  /** Current selected workspace */
  selectedWorkspace: WorkspaceI
  /** Wether the create a workspace view should be shown or not */
  showCreateWorkspace: boolean
}