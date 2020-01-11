import React, { forwardRef, useRef, useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
import Profile from './Profile';
import { Workspace as WorkspaceI, State } from '../types';
import Workspace from './Workspace';
import Notifications from './Notifications';
import CreateWorkspace from './CreateWorkspace';
import CreateSprint from './CreateSprint';
import CreateTask from './CreateTask';
import Task from './Task';

/**
 * Dashboard view
 * @visibleName Dashboard View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Dashboard: React.RefForwardingComponent<HTMLDivElement, DashboardProps> = ({ showing, selectedWorkspace }, ref) => {
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('Notifications');

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(showing.profileView) {
      setVisibleProfile(true);
    } else if (profileRef.current) {
      profileRef.current.classList.toggle('opacityIn');
      profileRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setVisibleProfile(false);
      }, 300);
    }
  }, [showing.profileView]);

  useEffect(() => {
    if(selectedWorkspace) {
      setCurrentView('Workspace');
    }
  }, [selectedWorkspace]);

  return (
    <Fragment>
      {visibleProfile && <Profile ref={profileRef} user={showing.profile ? showing.profile : undefined} />}
      {showing.createWorkspace && <CreateWorkspace />}
      {showing.createSprint && <CreateSprint />}
      {showing.createTask && <CreateTask />}
      {showing.taskView && <Task task={showing.task} />}
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
    showing: settingsReducer.show,
    selectedWorkspace: userReducer.selectedWorkspace,
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(forwardRef<HTMLDivElement, DashboardProps>(Dashboard));

interface DashboardProps {
  /** Current selected workspace */
  selectedWorkspace: WorkspaceI
  /** Showing settings */
  showing: State["settingsReducer"]["show"]
}