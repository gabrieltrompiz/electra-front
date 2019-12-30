import React, { forwardRef, useRef, useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { setShownProfile } from '../redux/actions';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
import Profile from './Profile';
import { Profile as ProfileI, Workspace as WorkspaceI } from '../types';
import Workspace from './Workspace';
import Notifications from './Notifications';

/**
 * Dashboard view
 * @visibleName Dashboard View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Dashboard: React.RefForwardingComponent<HTMLDivElement, DashboardProps> = ({ shownProfile, show, setShownProfile, selectedWorkspace }, ref) => {
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('Notifications');

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(show) {
      setVisibleProfile(true);
    } else if (profileRef.current) {
      profileRef.current.classList.toggle('opacityIn');
      profileRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setVisibleProfile(false);
      }, 300);
    }
  }, [show]);

  useEffect(() => {
    if(selectedWorkspace) {
      setCurrentView('Workspace');
    }
  }, [selectedWorkspace])

  return (
    <Fragment>
      {visibleProfile && <Profile ref={profileRef} close={() => setShownProfile(null)} user={shownProfile ? shownProfile : undefined} />}
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

const mapStateToProps = (state: any) => {
  const { settingsReducer, userReducer } = state;
  return {
    show: settingsReducer.show,
    shownProfile: settingsReducer.shownProfile,
    selectedWorkspace: userReducer.selectedWorkspace
  };
};

export default connect(mapStateToProps, { setShownProfile }, null, { forwardRef: true })(forwardRef<HTMLDivElement, DashboardProps>(Dashboard));

interface DashboardProps {
  /** Profile to be shown in the Profile view */
  shownProfile: ProfileI | null
  /** Wether the profile should be shown or not */
  show: boolean
  /** Changes the profile to be shown at profile view */
  setShownProfile: Function
  /** Current selected workspace */
  selectedWorkspace: WorkspaceI
}